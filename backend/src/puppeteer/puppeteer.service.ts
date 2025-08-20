// src/puppeteer/puppeteer.service.ts
import { Injectable, OnModuleDestroy, Logger } from "@nestjs/common";
import { Browser, Page } from "puppeteer-core";
import {
  generateRandomFingerprintForKorea,
  applyFingerprint,
} from "../utils/fingerprintGenerator";
import { FingerprintService } from "@/fingerprint/fingerprint.service";

import { PuppeteerGateway } from "./puppeteer.gateway";

export interface PuppeteerInstance {
  browser: Browser;
  uuid: string;
}

@Injectable()
export class PuppeteerService implements OnModuleDestroy {
  constructor(
    private readonly fingerprintService: FingerprintService,
    private readonly puppeteerGateway: PuppeteerGateway
  ) {}

  private readonly logger = new Logger(PuppeteerService.name);
  private readonly browsers = new Map<string, Browser>();

  async createBrowser(
    siteUrl: string,
    accountInfo?: { accountId: string; memo: string },
    exchange?: string
  ): Promise<PuppeteerInstance> {
    const { connect } = require("puppeteer-real-browser");

    // 디버깅: accountInfo 로그
    console.log(
      "🔍 createBrowser - accountInfo:",
      JSON.stringify(accountInfo, null, 2)
    );
    console.log("🔍 createBrowser - exchange:", exchange);

    const { browser, page }: { browser: Browser; page: Page } = await connect({
      headless: false,
      executablePath: process.env.CHROME_PATH,
      args: [
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
        "--disable-web-security=false",
        "--allow-running-insecure-content",
        "--disable-blink-features=AutomationControlled",
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
      ],
      customConfig: {
        defaultViewport: null,
      },
      turnstile: false,
      connectOption: {
        defaultViewport: {
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
        },
      },
      disableXvfb: false,
      ignoreAllFlags: false,
    });

    // ✅ 브라우저 지문 랜덤 설정
    const publicIp = await this.getPublicIp();
    const fingerprint = await generateRandomFingerprintForKorea(publicIp);
    const uuid = await this.fingerprintService.saveFingerprint(
      fingerprint,
      siteUrl,
      accountInfo,
      exchange
    );
    this.logger.log(`📦 브라우저 Fingerprint 저장됨: ${uuid}`);
    this.logger.log(
      `📦 accountInfo 저장됨: ${JSON.stringify(accountInfo, null, 2)}`
    );

    await applyFingerprint(page, fingerprint);

    // ✅ 입력받은 siteUrl로 이동
    await page.goto(siteUrl, { waitUntil: "domcontentloaded" });

    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();

        if (window.indexedDB && indexedDB.databases) {
          indexedDB.databases().then((dbs) => {
            dbs.forEach((db) => {
              if (db.name) indexedDB.deleteDatabase(db.name);
            });
          });
        }

        if (typeof caches !== "undefined" && caches.keys) {
          caches.keys().then((keys) => {
            keys.forEach((key) => caches.delete(key));
          });
        }
      } catch (e) {
        console.warn("스토리지 정리 중 오류:", e);
      }
    });

    // ✅ 네트워크 추적 활성화
    //  await this.enableCDPNetwork(page, siteUrl);

    this.browsers.set(uuid, browser);

    // 브라우저 연결 해제 이벤트 리스너 추가
    browser.on("disconnected", async () => {
      this.logger.log(`Browser disconnected: ${uuid}`);
      this.browsers.delete(uuid);
    });

    // 10초마다 저장
    setInterval(async () => {
      try {
        // ✅ 반드시 유효 페이지 로드 후에만 실행
        const url = page.url();
        if (url.startsWith("http")) {
          const cookies = await page.cookies();
          const localStorage = await page.evaluate(() =>
            JSON.stringify(window.localStorage)
          );
          const sessionStorage = await page.evaluate(() =>
            JSON.stringify(window.sessionStorage)
          );

          await this.fingerprintService.updateSession(uuid, {
            cookies,
            localStorage,
            sessionStorage,
          });

          this.logger.debug(`🧩 세션 저장 완료 (UUID: ${uuid})`);
        }
      } catch (err) {
        this.logger.warn(`세션 저장 실패: ${err}`);
      }
    }, 10_000);

    return { browser, uuid };
  }

  async reopenBrowser(
    uuid: string
  ): Promise<{ browser: Browser; isAlreadyRunning: boolean; title: string }> {
    const { connect } = require("puppeteer-real-browser");

    // 1. 현재 브라우저 상태 확인
    const existingBrowser = this.browsers.get(uuid);
    if (existingBrowser && existingBrowser.isConnected()) {
      try {
        // 이미 열려있는 브라우저를 맨 위로 올리기
        const pages = await existingBrowser.pages();
        if (pages.length > 0) {
          const page = pages[0];
          await page.bringToFront();
          const title = await page.title();
          this.logger.log(
            `이미 열려있는 브라우저를 맨 위로 올렸습니다. (UUID: ${uuid})`
          );
          return { browser: existingBrowser, isAlreadyRunning: true, title };
        }
      } catch (error) {
        this.logger.warn(
          `기존 브라우저 접근 실패, 새로 생성합니다. (UUID: ${uuid})`,
          error
        );
      }
    }

    // 2. DB에서 fingerprint 불러오기
    const fingerprint = await this.fingerprintService.getFingerprint(uuid);
    if (!fingerprint) {
      throw new Error(`해당 UUID에 대한 Fingerprint 없음: ${uuid}`);
    }

    // 3. 브라우저 실행
    const { browser, page }: { browser: Browser; page: Page } = await connect({
      headless: false,
      executablePath: process.env.CHROME_PATH,
      args: [
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
        "--disable-web-security=false",
        "--allow-running-insecure-content",
        "--disable-blink-features=AutomationControlled",
      ],
      customConfig: {
        defaultViewport: null,
      },
      turnstile: false,
      connectOption: {
        defaultViewport: {
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
        },
      },
      disableXvfb: false,
      ignoreAllFlags: false,
    });

    // 3. applyFingerprint 적용
    await applyFingerprint(page, fingerprint);

    if (fingerprint.cookies?.length) {
      await page.setCookie(...fingerprint.cookies);
      this.logger.log(`🍪 쿠키 복원 완료`);
    }

    // 🧭 페이지 이동
    await page.goto(fingerprint.siteUrl, { waitUntil: "domcontentloaded" });

    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();

        if (window.indexedDB && indexedDB.databases) {
          indexedDB.databases().then((dbs) => {
            dbs.forEach((db) => {
              if (db.name) indexedDB.deleteDatabase(db.name);
            });
          });
        }

        if (typeof caches !== "undefined" && caches.keys) {
          caches.keys().then((keys) => {
            keys.forEach((key) => caches.delete(key));
          });
        }
      } catch (e) {
        console.warn("스토리지 정리 중 오류:", e);
      }
    });

    // 🧩 Storage 복원 (이제 접근 가능)
    await page.evaluate(
      (local, session) => {
        try {
          const l = JSON.parse(local || "{}");
          for (const k in l) localStorage.setItem(k, l[k]);
        } catch {}
        try {
          const s = JSON.parse(session || "{}");
          for (const k in s) sessionStorage.setItem(k, s[k]);
        } catch {}
      },
      fingerprint.localStorage,
      fingerprint.sessionStorage
    );

    this.logger.log(`♻️ Fingerprint 재적용 브라우저 실행됨 (UUID: ${uuid})`);
    this.browsers.set(uuid, browser);

    // 브라우저 연결 해제 이벤트 리스너 추가
    browser.on("disconnected", async () => {
      this.logger.log(`Browser disconnected: ${uuid}`);
      this.browsers.delete(uuid);
    });

    const status = await this.getBrowserStatus(uuid);
    console.log(status);
    // await this.enableCDPNetwork(page, fingerprint.siteUrl);

    setInterval(async () => {
      try {
        // ✅ 반드시 유효 페이지 로드 후에만 실행
        const url = page.url();
        if (url.startsWith("http")) {
          const cookies = await page.cookies();
          const localStorage = await page.evaluate(() =>
            JSON.stringify(window.localStorage)
          );
          const sessionStorage = await page.evaluate(() =>
            JSON.stringify(window.sessionStorage)
          );

          await this.fingerprintService.updateSession(uuid, {
            cookies,
            localStorage,
            sessionStorage,
          });

          this.logger.debug(`🧩 세션 저장 완료 (UUID: ${uuid})`);
        }
      } catch (err) {
        this.logger.warn(`세션 저장 실패: ${err}`);
      }
    }, 10_000);

    const title = await page.title();
    return { browser, isAlreadyRunning: false, title };
  }

  async getBrowserStatuses(): Promise<
    { uuid: string; isConnected: boolean; tabs: string[] }[]
  > {
    const statuses: { uuid: string; isConnected: boolean; tabs: string[] }[] =
      [];

    for (const [uuid, browser] of this.browsers.entries()) {
      const isConnected = browser.isConnected();
      let tabs: string[] = [];

      try {
        const pages = await browser.pages();
        tabs = await Promise.all(pages.map((p) => p.url()));
      } catch (e) {
        tabs = ["탭 정보를 가져올 수 없음"];
      }

      statuses.push({ uuid, isConnected, tabs });
    }

    return statuses;
  }

  async getActiveBrowsers(): Promise<
    {
      uuid: string;
      isConnected: boolean;
      tabs: string[];
      lastActiveAt?: Date;
    }[]
  > {
    const activeBrowsers = [];
    for (const [uuid, browser] of this.browsers.entries()) {
      try {
        const isConnected = browser.isConnected();
        const pages = await browser.pages();
        const tabs = pages.map((page) => page.url());

        // 실제 연결 상태를 기반으로 활성 브라우저 판단
        if (isConnected) {
          activeBrowsers.push({
            uuid,
            isConnected,
            tabs,
            lastActiveAt: new Date(), // 현재 연결된 브라우저는 활성 상태
          });
        }
      } catch (error) {
        this.logger.error(
          `Failed to retrieve active browser info: ${uuid}`,
          error
        );
      }
    }
    return activeBrowsers;
  }

  private async getPublicIp(): Promise<string> {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (e) {
      this.logger.error("공인 IP 가져오기 실패, 기본 IP 사용", e);
      return "1.1.1.1"; // fallback
    }
  }

  async onModuleDestroy() {
    this.logger.log("모듈 종료, 브라우저 모두 종료");

    try {
      // Map의 values를 배열로 변환 후 map 사용
      const closeTasks = Array.from(this.browsers.values()).map(
        async (browser) => {
          try {
            await browser.close();
          } catch (error) {
            this.logger.error("브라우저 종료 중 오류:", error);
          }
        }
      );

      // 모든 브라우저 종료 대기 (최대 10초)
      await Promise.race([
        Promise.all(closeTasks),
        new Promise((resolve) => setTimeout(resolve, 10000)),
      ]);

      this.browsers.clear();
      this.logger.log("모든 브라우저 종료 완료");
    } catch (error) {
      this.logger.error("브라우저 종료 중 오류:", error);
    }
  }

  async getBrowserStatus(uuid: string): Promise<{
    uuid: string;
    isConnected: boolean;
    tabs: string[];
  } | null> {
    const browser = this.browsers.get(uuid);
    if (!browser) {
      this.logger.warn(
        `UUID ${uuid}에 해당하는 브라우저 인스턴스를 찾을 수 없습니다.`
      );
      return null;
    }

    const isConnected = browser.isConnected();
    let tabs: string[] = [];

    try {
      const pages = await browser.pages();
      tabs = await Promise.all(pages.map((p) => p.url()));
    } catch (error) {
      this.logger.error(
        `탭 정보를 가져오는 중 오류 발생 (UUID: ${uuid})`,
        error
      );
      tabs = ["탭 정보를 가져올 수 없음"];
    }

    return { uuid, isConnected, tabs };
  }

  // 브라우저 계정 정보 갱신
  async updateBrowserAccountInfo(
    uuid: string,
    accountInfo: { accountId: string; memo: string }
  ): Promise<void> {
    const browser = this.browsers.get(uuid);
    if (!browser) {
      throw new Error(`Browser with UUID ${uuid} not found`);
    }

    try {
      // FingerprintService를 통해 브라우저 프로필의 계정 정보 업데이트
      await this.fingerprintService.updateBrowserAccountInfo(uuid, accountInfo);

      this.logger.log(`Browser account info updated for UUID: ${uuid}`);
    } catch (error) {
      this.logger.error(
        `Failed to update browser account info for UUID ${uuid}:`,
        error
      );
      throw error;
    }
  }

  // 브라우저 계정 정보 조회
  async getBrowserAccountInfo(
    uuid: string
  ): Promise<{ accountId: string; memo: string } | null> {
    try {
      const fingerprint = await this.fingerprintService.getFingerprint(uuid);
      return fingerprint?.accountInfo || null;
    } catch (error) {
      this.logger.error(
        `Failed to get browser account info for UUID ${uuid}:`,
        error
      );
      return null;
    }
  }
}
