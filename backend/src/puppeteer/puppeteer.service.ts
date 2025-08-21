// src/puppeteer/puppeteer.service.ts
import { Injectable, OnModuleDestroy, Logger } from "@nestjs/common";
import { Browser, Page, BrowserContext } from "playwright";
import { loadCamoufox } from "./camoufox.bridge";
import { FingerprintService } from "../fingerprint/fingerprint.service";
import { PuppeteerGateway } from "./puppeteer.gateway";

export interface PuppeteerInstance {
  browser: Browser | BrowserContext;
  uuid: string;
  isAlreadyRunning?: boolean;
  title?: string;
  accountInfo?: { accountId: string; memo: string };
}

@Injectable()
export class PuppeteerService implements OnModuleDestroy {
  constructor(
    private readonly fingerprintService: FingerprintService,
    private readonly puppeteerGateway: PuppeteerGateway
  ) {}

  private readonly logger = new Logger(PuppeteerService.name);
  private readonly browsers = new Map<string, Browser | BrowserContext>();
  private camoufoxOptions: any;
  private fingerprintProfiles: Map<string, any> = new Map();

  async onModuleInit() {
    // camoufox-js 옵션 설정
    this.camoufoxOptions = {
      headless: false,
      locale: "ko-KR",
      os: "macos", // 한국 사용자를 위해 macOS 설정
      geoip: true, // IP 기반 지리적 위치 설정
      humanize: true, // 인간적인 커서 움직임
      block_webrtc: true, // WebRTC 차단
      disable_coop: true, // Cross-Origin-Opener-Policy 비활성화
      args: [
        "--disable-blink-features=AutomationControlled",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--disable-software-rasterizer",
        "--disable-gpu-sandbox",
        "--disable-accelerated-2d-canvas",
        "--disable-accelerated-video-decode",
        "--disable-accelerated-video-encode",
        "--disable-accelerated-mjpeg-decode",
        "--disable-accelerated-video",
        "--disable-gpu-memory-buffer-video-frames",
        "--disable-gpu-memory-buffer-compositor-resources",
        "--disable-gpu-memory-buffer",
        "--disable-gpu-memory-buffer-cdm",
        "--disable-gpu-memory-buffer-dxgi",
        "--disable-gpu-memory-buffer-shared-images",
        "--disable-gpu-memory-buffer-video-capture",
        "--disable-gpu-memory-buffer-webgl",
        "--disable-gpu-memory-buffer-2d-canvas",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--no-first-run",
        "--no-zygote",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-features=TranslateUI",
        "--disable-ipc-flooding-protection",
        "--enable-features=NetworkService,NetworkServiceLogging",
        "--force-color-profile=srgb",
        "--metrics-recording-only",
        "--disable-default-apps",
        "--disable-extensions",
        "--disable-plugins",
        "--disable-images=false",
        "--disable-javascript=false",
        "--allow-running-insecure-content",
        "--disable-background-networking",
        "--disable-breakpad",
        "--disable-client-side-phishing-detection",
        "--disable-component-extensions-with-background-pages",
        "--disable-domain-reliability",
        "--disable-features=AudioServiceOutOfProcess,TranslateUI",
        "--disable-hang-monitor",
        "--disable-popup-blocking",
        "--disable-prompt-on-repost",
        "--disable-sync",
        "--safebrowsing-disable-auto-update",
        "--enable-automation",
        "--password-store=basic",
        "--use-mock-keychain",
      ],
    };
  }

  async createBrowser(
    siteUrl: string,
    accountInfo?: { accountId: string; memo: string },
    exchange?: string
  ): Promise<PuppeteerInstance> {
    // 디버깅: accountInfo 로그
    console.log(
      "🔍 createBrowser - accountInfo:",
      JSON.stringify(accountInfo, null, 2)
    );
    console.log("🔍 createBrowser - exchange:", exchange);

    // 고급 지문 스푸핑 프로필 생성
    const fingerprintProfile = this.generateFingerprintProfile();

    // camoufox-js로 브라우저 컨텍스트 생성 (프로필 기반 설정)
    const mod = await loadCamoufox();
    const Camoufox = (mod as any).Camoufox ?? (mod as any).default;

    // 프로필 기반 Camoufox 옵션 생성
    const profileOptions = {
      ...this.camoufoxOptions,
      userAgent: fingerprintProfile.userAgent,
      locale: fingerprintProfile.language,
      languages: fingerprintProfile.languages,
      timezone: fingerprintProfile.timezone,
      screen: fingerprintProfile.screenResolution,
      window: [
        fingerprintProfile.screenResolution.width,
        fingerprintProfile.screenResolution.height,
      ],
    };

    const context = await Camoufox(profileOptions);

    // 새 페이지 생성
    const page = await context.newPage();

    // 고급 안티디텍팅 스크립트 주입
    const antiDetectionScript =
      this.generateAntiDetectionScript(fingerprintProfile);
    await page.addInitScript(antiDetectionScript);

    // 사이트로 이동
    await page.goto(siteUrl, { waitUntil: "domcontentloaded" });

    // 브라우저 지문 정보 수집 (고급)
    const fingerprint = await page.evaluate(() => {
      // WebGL 정보 수집
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") ||
        (canvas.getContext("experimental-webgl") as WebGLRenderingContext);
      let webglVendor = "Unknown";
      let webglRenderer = "Unknown";
      let webglExtensions: string[] = [];

      if (gl) {
        webglVendor = gl.getParameter(gl.VENDOR) || "Unknown";
        webglRenderer = gl.getParameter(gl.RENDERER) || "Unknown";
        webglExtensions = gl.getSupportedExtensions() || [];
      }

      // Canvas 지문 생성
      const canvasFingerprint = (() => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return "unknown";

        ctx.textBaseline = "top";
        ctx.font = "14px Arial";
        ctx.fillText("Canvas fingerprint test", 2, 2);
        return canvas.toDataURL();
      })();

      // Audio 지문 생성
      const audioFingerprint = (() => {
        try {
          const audioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const analyser = audioContext.createAnalyser();
          oscillator.connect(analyser);
          oscillator.type = "triangle";
          oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);
          oscillator.start(0);
          oscillator.stop(0.001);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(dataArray);
          return Array.from(dataArray).slice(0, 10).join(",");
        } catch (e) {
          return "unknown";
        }
      })();

      // Font 목록 수집
      const fontList = (() => {
        const testString = "mmmmmmmmmmlli";
        const testSize = "72px";
        const h = document.getElementsByTagName("body")[0];
        const s = document.createElement("span");
        s.style.fontSize = testSize;
        s.innerHTML = testString;
        h.appendChild(s);

        const defaultWidth = s.offsetWidth;
        const defaultHeight = s.offsetHeight;

        const fonts = [
          "Arial",
          "Verdana",
          "Helvetica",
          "Times New Roman",
          "Courier New",
          "Georgia",
          "Palatino",
          "Garamond",
          "Bookman",
          "Comic Sans MS",
          "Trebuchet MS",
          "Arial Black",
          "Impact",
          "Tahoma",
          "Lucida Console",
        ];

        const detectedFonts: string[] = [];
        fonts.forEach((font) => {
          s.style.fontFamily = font;
          if (
            s.offsetWidth !== defaultWidth ||
            s.offsetHeight !== defaultHeight
          ) {
            detectedFonts.push(font);
          }
        });

        h.removeChild(s);
        return detectedFonts;
      })();

      // Plugin 정보 수집
      const plugins = Array.from(navigator.plugins).map(
        (plugin) => plugin.name
      );
      const mimeTypes = Array.from(navigator.mimeTypes).map(
        (mime) => mime.type
      );

      return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        languages: Array.from(navigator.languages),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        platform: navigator.platform,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: (navigator as any).deviceMemory || 8,
        colorDepth: screen.colorDepth,
        screenResolution: {
          width: screen.width,
          height: screen.height,
        },
        webdriver: (navigator as any).webdriver || false,
        webglVendor,
        webglRenderer,
        webglExtensions,
        canvasFingerprint,
        audioFingerprint,
        fontList,
        plugins,
        mimeTypes,
        latitude: 37.5665, // 기본값 (실제로는 IP 기반으로 설정됨)
        longitude: 126.978, // 기본값 (실제로는 IP 기반으로 설정됨)
        publicIp: "unknown", // 실제 IP는 별도로 설정 필요
      };
    });

    // UUID 생성 및 저장
    const uuid = this.generateUUID();
    this.browsers.set(uuid, context);

    // 지문 프로필을 메모리에 저장 (재생성용)
    this.fingerprintProfiles.set(uuid, {
      profile: fingerprintProfile,
      fingerprint,
      siteUrl,
      accountInfo,
      exchange,
    });

    // 지문 정보를 데이터베이스에 저장
    try {
      await this.fingerprintService.saveFingerprint(
        fingerprint,
        siteUrl,
        accountInfo,
        exchange
      );
      this.logger.log(`Fingerprint saved for browser ${uuid}`);
    } catch (error) {
      this.logger.error(
        `Failed to save fingerprint for browser ${uuid}: ${error.message}`
      );
    }

    this.logger.log(`Camoufox browser created: ${uuid}`);

    return {
      browser: context,
      uuid,
      isAlreadyRunning: false,
      title: `Camoufox Browser - ${exchange || "Unknown"}`,
      accountInfo,
    };
  }

  async reopenBrowser(uuid: string): Promise<PuppeteerInstance> {
    const browser = this.browsers.get(uuid);
    if (!browser) {
      throw new Error("Browser not found");
    }

    // 저장된 지문 프로필 가져오기
    const savedProfile = this.fingerprintProfiles.get(uuid);
    if (!savedProfile) {
      throw new Error("Fingerprint profile not found for browser");
    }

    try {
      this.logger.log(
        `Reopening Camoufox browser: ${uuid} with saved fingerprint profile`
      );

      // 기존 브라우저 종료
      await this.closeBrowser(uuid);

      // 저장된 프로필로 새 브라우저 컨텍스트 생성
      const mod = await loadCamoufox();
      const Camoufox = (mod as any).Camoufox ?? (mod as any).default;

      // 저장된 프로필 기반 Camoufox 옵션 생성
      const profileOptions = {
        ...this.camoufoxOptions,
        userAgent: savedProfile.profile.userAgent,
        locale: savedProfile.profile.language,
        languages: savedProfile.profile.languages,
        timezone: savedProfile.profile.timezone,
        screen: savedProfile.profile.screenResolution,
        window: [
          savedProfile.profile.screenResolution.width,
          savedProfile.profile.screenResolution.height,
        ],
      };

      const newContext = await Camoufox(profileOptions);
      const page = await newContext.newPage();

      // 저장된 프로필로 고급 안티디텍팅 스크립트 다시 주입
      const antiDetectionScript = this.generateAntiDetectionScript(
        savedProfile.profile
      );
      await page.addInitScript(antiDetectionScript);

      // 원래 사이트로 이동
      await page.goto(savedProfile.siteUrl, { waitUntil: "domcontentloaded" });

      // 브라우저 인스턴스 업데이트
      this.browsers.set(uuid, newContext);

      // 지문 프로필 유지 (재생성 시에도 동일한 프로필 사용)
      this.fingerprintProfiles.set(uuid, savedProfile);

      this.logger.log(
        `Camoufox browser reopened: ${uuid} with consistent fingerprint`
      );
      return {
        browser: newContext,
        uuid,
        isAlreadyRunning: true,
        title: `Camoufox Browser - ${savedProfile.exchange || "Reopened"}`,
        accountInfo: savedProfile.accountInfo,
      };
    } catch (error) {
      this.logger.error(`Failed to reopen browser: ${error.message}`);
      throw error;
    }
  }

  async closeBrowser(uuid: string): Promise<void> {
    const browser = this.browsers.get(uuid);
    if (!browser) {
      throw new Error("Browser not found");
    }

    try {
      await browser.close();
      this.browsers.delete(uuid);

      // 지문 프로필도 정리
      this.fingerprintProfiles.delete(uuid);

      this.logger.log(`Camoufox browser closed: ${uuid}`);
    } catch (error) {
      this.logger.error(`Failed to close browser: ${error.message}`);
      throw error;
    }
  }

  async getBrowser(uuid: string): Promise<Browser | BrowserContext | null> {
    return this.browsers.get(uuid) || null;
  }

  async getAllBrowsers(): Promise<Map<string, Browser | BrowserContext>> {
    return this.browsers;
  }

  // 브라우저 계정 정보 업데이트
  async updateBrowserAccountInfo(
    uuid: string,
    accountInfo: { accountId: string; memo: string }
  ): Promise<void> {
    const browser = this.browsers.get(uuid);
    if (!browser) {
      throw new Error("Browser not found");
    }

    try {
      // BrowserContext인 경우에만 pages() 메서드 사용
      if ("pages" in browser) {
        const pages = await browser.pages();
        if (pages.length > 0) {
          const page = pages[0];

          // 페이지에서 계정 정보를 localStorage에 저장
          await page.evaluate((info) => {
            localStorage.setItem("accountInfo", JSON.stringify(info));
          }, accountInfo);

          this.logger.log(`Account info updated for browser ${uuid}`);
        }
      } else {
        // Browser인 경우 컨텍스트를 통해 접근
        const contexts = browser.contexts();
        if (contexts.length > 0) {
          const context = contexts[0];
          const pages = await context.pages();
          if (pages.length > 0) {
            const page = pages[0];

            await page.evaluate((info) => {
              localStorage.setItem("accountInfo", JSON.stringify(info));
            }, accountInfo);

            this.logger.log(`Account info updated for browser ${uuid}`);
          }
        }
      }
    } catch (error) {
      this.logger.error(
        `Failed to update account info for browser ${uuid}: ${error.message}`
      );
      throw error;
    }
  }

  // 브라우저 계정 정보 가져오기
  async getBrowserAccountInfo(
    uuid: string
  ): Promise<{ accountId: string; memo: string } | null> {
    const browser = this.browsers.get(uuid);
    if (!browser) {
      return null;
    }

    try {
      // BrowserContext인 경우에만 pages() 메서드 사용
      if ("pages" in browser) {
        const pages = await browser.pages();
        if (pages.length > 0) {
          const page = pages[0];

          // 페이지에서 계정 정보를 localStorage에서 가져오기
          const accountInfo = await page.evaluate(() => {
            const stored = localStorage.getItem("accountInfo");
            return stored ? JSON.parse(stored) : null;
          });

          return accountInfo;
        }
      } else {
        // Browser인 경우 컨텍스트를 통해 접근
        const contexts = browser.contexts();
        if (contexts.length > 0) {
          const context = contexts[0];
          const pages = await context.pages();
          if (pages.length > 0) {
            const page = pages[0];

            const accountInfo = await page.evaluate(() => {
              const stored = localStorage.getItem("accountInfo");
              return stored ? JSON.parse(stored) : null;
            });

            return accountInfo;
          }
        }
      }
    } catch (error) {
      this.logger.error(
        `Failed to get account info for browser ${uuid}: ${error.message}`
      );
    }

    return null;
  }

  // 브라우저 지문 정보 가져오기
  async getBrowserFingerprint(uuid: string): Promise<any | null> {
    const savedProfile = this.fingerprintProfiles.get(uuid);
    if (!savedProfile) {
      return null;
    }
    return savedProfile.fingerprint;
  }

  // 브라우저 지문 정보 업데이트
  async updateBrowserFingerprint(
    uuid: string,
    updates: {
      userAgent?: string;
      webglVendor?: string;
      webglRenderer?: string;
    }
  ): Promise<void> {
    const savedProfile = this.fingerprintProfiles.get(uuid);
    if (!savedProfile) {
      throw new Error("Fingerprint profile not found for browser");
    }

    // 프로필 업데이트
    if (updates.userAgent) {
      savedProfile.profile.userAgent = updates.userAgent;
    }
    if (updates.webglVendor) {
      savedProfile.profile.webglVendor = updates.webglVendor;
    }
    if (updates.webglRenderer) {
      savedProfile.profile.webglRenderer = updates.webglRenderer;
    }

    // 브라우저가 실행 중이면 실시간으로 지문 업데이트
    const browser = this.browsers.get(uuid);
    if (browser && "pages" in browser) {
      try {
        const pages = await browser.pages();
        if (pages.length > 0) {
          const page = pages[0];
          const updatedScript = this.generateAntiDetectionScript(
            savedProfile.profile
          );
          await page.evaluate(updatedScript);
          this.logger.log(`Fingerprint updated for browser ${uuid}`);
        }
      } catch (error) {
        this.logger.error(
          `Failed to update fingerprint for browser ${uuid}: ${error.message}`
        );
      }
    }
  }

  async onModuleDestroy() {
    // 모든 브라우저 종료
    for (const [uuid, browser] of this.browsers.entries()) {
      try {
        await browser.close();
        this.logger.log(`Browser ${uuid} closed during shutdown`);
      } catch (error) {
        this.logger.error(`Failed to close browser ${uuid}: ${error.message}`);
      }
    }
    this.browsers.clear();
  }

  // 고급 지문 스푸핑을 위한 프로필 생성
  private generateFingerprintProfile(): any {
    const profiles = [
      {
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
        webglVendor: "Apple Inc.",
        webglRenderer: "Apple M1 Pro",
        platform: "MacIntel",
        hardwareConcurrency: 10,
        deviceMemory: 16,
        screenResolution: { width: 2560, height: 1600 },
        colorDepth: 30,
        timezone: "Asia/Seoul",
        language: "ko-KR",
        languages: ["ko-KR", "ko", "en-US", "en"],
        fonts: [
          "Arial",
          "Helvetica",
          "Times New Roman",
          "Courier New",
          "Verdana",
          "Georgia",
          "Palatino",
          "Garamond",
          "Bookman",
          "Comic Sans MS",
          "Trebuchet MS",
          "Arial Black",
          "Impact",
        ],
        plugins: [
          "PDF Viewer",
          "Chrome PDF Plugin",
          "Native Client",
          "Chrome Web Store Payments",
        ],
        mimeTypes: [
          "application/pdf",
          "application/x-google-chrome-pdf",
          "application/x-nacl",
          "application/x-pnacl",
        ],
      },
      {
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
        webglVendor: "Intel Inc.",
        webglRenderer: "Intel(R) UHD Graphics 620",
        platform: "Win32",
        hardwareConcurrency: 8,
        deviceMemory: 8,
        screenResolution: { width: 1920, height: 1080 },
        colorDepth: 24,
        timezone: "Asia/Seoul",
        language: "ko-KR",
        languages: ["ko-KR", "ko", "en-US", "en"],
        fonts: [
          "Arial",
          "Calibri",
          "Times New Roman",
          "Segoe UI",
          "Verdana",
          "Tahoma",
          "Trebuchet MS",
          "Georgia",
          "Comic Sans MS",
          "Impact",
          "Lucida Console",
          "Courier New",
        ],
        plugins: [
          "PDF Viewer",
          "Chrome PDF Plugin",
          "Native Client",
          "Chrome Web Store Payments",
        ],
        mimeTypes: [
          "application/pdf",
          "application/x-google-chrome-pdf",
          "application/x-nacl",
          "application/x-pnacl",
        ],
      },
      {
        userAgent:
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
        webglVendor: "NVIDIA Corporation",
        webglRenderer: "GeForce RTX 3080/PCIe/SSE2",
        platform: "Linux x86_64",
        hardwareConcurrency: 16,
        deviceMemory: 32,
        screenResolution: { width: 1920, height: 1200 },
        colorDepth: 24,
        timezone: "Asia/Seoul",
        language: "ko-KR",
        languages: ["ko-KR", "ko", "en-US", "en"],
        fonts: [
          "DejaVu Sans",
          "Liberation Sans",
          "Arial",
          "Helvetica",
          "Times New Roman",
          "Liberation Serif",
          "DejaVu Serif",
          "Courier New",
          "Liberation Mono",
          "DejaVu Sans Mono",
        ],
        plugins: [
          "PDF Viewer",
          "Chrome PDF Plugin",
          "Native Client",
          "Chrome Web Store Payments",
        ],
        mimeTypes: [
          "application/pdf",
          "application/x-google-chrome-pdf",
          "application/x-nacl",
          "application/x-pnacl",
        ],
      },
    ];

    return profiles[Math.floor(Math.random() * profiles.length)];
  }

  // 고급 안티디텍팅 스크립트 생성
  private generateAntiDetectionScript(profile: any): string {
    return `
      (function() {
        // User-Agent 스푸핑
        Object.defineProperty(navigator, 'userAgent', {
          get: () => '${profile.userAgent}',
          configurable: true
        });

        // Platform 스푸핑
        Object.defineProperty(navigator, 'platform', {
          get: () => '${profile.platform}',
          configurable: true
        });

        // Hardware Concurrency 스푸핑
        Object.defineProperty(navigator, 'hardwareConcurrency', {
          get: () => ${profile.hardwareConcurrency},
          configurable: true
        });

        // Device Memory 스푸핑
        Object.defineProperty(navigator, 'deviceMemory', {
          get: () => ${profile.deviceMemory},
          configurable: true
        });

        // WebGL 스푸핑
        const getParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
          if (parameter === 37445) {
            return '${profile.webglVendor}';
          }
          if (parameter === 37446) {
            return '${profile.webglRenderer}';
          }
          return getParameter.call(this, parameter);
        };

        // Canvas 스푸핑
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, attributes) {
          const context = originalGetContext.call(this, type, attributes);
          if (type === '2d') {
            const originalFillText = context.fillText;
            context.fillText = function(text, x, y, maxWidth) {
              // Canvas 지문을 일관되게 만들기 위한 미세한 조정
              const adjustedX = x + (Math.random() * 0.1 - 0.05);
              const adjustedY = y + (Math.random() * 0.1 - 0.05);
              return originalFillText.call(this, text, adjustedX, adjustedY, maxWidth);
            };
          }
          return context;
        };

        // Audio 스푸핑
        const originalGetChannelData = AudioBuffer.prototype.getChannelData;
        AudioBuffer.prototype.getChannelData = function(channel) {
          const data = originalGetChannelData.call(this, channel);
          // Audio 지문을 일관되게 만들기 위한 미세한 조정
          for (let i = 0; i < data.length; i += 100) {
            data[i] += (Math.random() * 0.0001 - 0.00005);
          }
          return data;
        };

        // Font 스푸핑
        const originalQuerySelector = document.querySelector;
        document.querySelector = function(selector) {
          if (selector === 'body') {
            const body = originalQuerySelector.call(this, selector);
            if (body) {
              body.style.fontFamily = '${profile.fonts.join(", ")}';
            }
          }
          return originalQuerySelector.call(this, selector);
        };

        // Plugin 스푸핑
        Object.defineProperty(navigator, 'plugins', {
          get: () => {
            const plugins = [];
            ${profile.plugins
              .map(
                (plugin, index) => `
              plugins[${index}] = {
                name: '${plugin}',
                description: '${plugin}',
                filename: '${plugin.toLowerCase().replace(/\s+/g, "")}.dll',
                length: 1
              };
            `
              )
              .join("")}
            plugins.length = ${profile.plugins.length};
            return plugins;
          },
          configurable: true
        });

        // MIME Types 스푸핑
        Object.defineProperty(navigator, 'mimeTypes', {
          get: () => {
            const mimeTypes = [];
            ${profile.mimeTypes
              .map(
                (mime, index) => `
              mimeTypes[${index}] = {
                type: '${mime}',
                description: '${mime}',
                suffixes: '${mime.split("/")[1]}',
                enabledPlugin: { name: 'Chrome PDF Plugin' }
              };
            `
              )
              .join("")}
            mimeTypes.length = ${profile.mimeTypes.length};
            return mimeTypes;
          },
          configurable: true
        });

        // WebDriver 속성 완전 제거
        delete navigator.webdriver;
        delete window.webdriver;
        delete document.webdriver;

        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined,
          set: () => {},
          configurable: true,
          enumerable: false
        });

        // 자동화 속성 제거
        const automationProps = [
          'webdriver', 'selenium', 'puppeteer', 'headless', 'automation',
          'bot', 'crawler', '_selenium', '_webdriver_evaluate',
          '_webdriver_script_func', '_webdriver_script_func_result',
          '_webdriver_script_params', '_$cdc_asdjflasutopfhvcZLmcfl_',
          '_$chrome_asyncScriptInfo', 'domAutomation', 'domAutomationController'
        ];

        [navigator, window, document].forEach(obj => {
          automationProps.forEach(prop => {
            if (obj[prop] !== undefined) {
              delete obj[prop];
              Object.defineProperty(obj, prop, {
                get: () => undefined,
                set: () => {},
                configurable: true,
                enumerable: false
              });
            }
          });
        });

        // toString 오버라이드
        const originalToString = Object.prototype.toString;
        Object.prototype.toString = function() {
          const str = originalToString.call(this);
          const automationKeywords = [
            'webdriver', 'selenium', 'puppeteer', 'phantom', 'nightmare',
            'awesomium', 'automation', 'bot'
          ];
          if (automationKeywords.some(keyword => str.includes(keyword))) {
            return '[object Object]';
          }
          return str;
        };

        const originalFunctionToString = Function.prototype.toString;
        Function.prototype.toString = function() {
          const str = originalFunctionToString.call(this);
          const automationKeywords = [
            'webdriver', 'selenium', 'puppeteer', 'phantom', 'nightmare',
            'awesomium', 'automation', 'bot'
          ];
          if (automationKeywords.some(keyword => str.includes(keyword))) {
            return 'function () { [native code] }';
          }
          return str;
        };

        console.log('🔒 Advanced anti-detection script injected');
      })();
    `;
  }

  private generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  private getRandomUserAgent(): string {
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
  }

  private getRandomKoreanLatitude(): number {
    return Math.random() * (38.6 - 33.0) + 33.0;
  }

  private getRandomKoreanLongitude(): number {
    return Math.random() * (131.9 - 124.6) + 124.6;
  }
}
