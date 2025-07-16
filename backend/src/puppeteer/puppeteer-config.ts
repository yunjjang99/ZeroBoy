// src/puppeteer/puppeteer-config.ts
import puppeteer from "puppeteer-extra";
import { Browser, Page, executablePath } from "puppeteer-core";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { Cookie } from "puppeteer-core";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export interface PageFingerprint {
  cookies: Cookie[];
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  geolocation: { latitude: number; longitude: number } | null;
  caches: string[];
  userAgent: string;
  language: string;
  hardwareConcurrency: number;
  webdriver: boolean;
  gpuVendor: string;
  platform: string;
  timezone: string;
  screenResolution: { width: number; height: number };
}

export interface FullFingerprint {
  id: string; // 고유 식별자 (예: UUID)
  cookies: Cookie[];
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  userAgent: string;
  viewport: { width: number; height: number };
  lastUpdated: Date;
  geolocation: { latitude: number; longitude: number } | null;
  caches: string[];
  language: string;
  hardwareConcurrency: number;
  webdriver: boolean;
  gpuVendor: string;
  platform: string;
  timezone: string;
  screenResolution: { width: number; height: number };
  plugins: string[];
  mimeTypes: string[];
  cookieEnabled: boolean;
  deviceMemory: number | null;
  languages: string[]; // mutable 배열로 처리
  colorDepth: number;
  canvasFingerprint: string;
  doNotTrack: string;
}

puppeteer.use(StealthPlugin());

export interface BrowserInstance {
  browser: Browser;
  page: Page;
  environmentData: EnvironmentData;
}

const getRandomCoordinate = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const getLocationFromIP = async (ip: string) => {
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);

    if (response.status !== 200 || !response.data) {
      throw new Error("IP 위치 정보를 가져올 수 없습니다.");
    }

    const data = response.data;
    return {
      latitude: data.latitude,
      longitude: data.longitude,
    };
  } catch (error) {
    console.warn("❌ IP 기반 위치 조회 실패:", error.message);
    return null;
  }
};

// GPU 벤더 정보를 랜덤하게 선택
const GPU_DATABASE = {
  "Google Inc. (Intel)": [
    "ANGLE (Intel, Intel(R) HD Graphics 630 (0x00005912) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) HD Graphics 630 (0x00005912) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) UHD Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) HD Graphics 630 (0x00005912) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) HD Graphics 630 (0x00005912) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) HD Graphics 630 (0x00005912) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (Intel, Intel(R) HD Graphics Direct3D11 vs_5_0 ps_5_0)",
    "ANGLE (Intel, Intel(R) HD Graphics 530 (0x0000191B) Direct3D11 vs_5_0 ps_5_0, D3D11)",
  ],
  "Google Inc. (NVIDIA)": [
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 980 Direct3D11 vs_5_0 ps_5_0)",
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 980 Direct3D11 vs_5_0 ps_5_0), or similar",
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 750 Ti Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce 8800 GTX Direct3D11 vs_4_1 ps_4_1)",
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 480 Direct3D11 vs_5_0 ps_5_0)",
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 1050 Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 1050 Ti (0x00001C82) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 1060 6GB (0x00001C03) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce GTX 1070 (0x00001B81) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 2060 SUPER Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 (0x00002206) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 (0x00002206) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Laptop GPU (0x000028A0) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 (0x00002882) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Ti (0x00002803) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 (0x00002882) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 (0x00002882) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 (0x00002882) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Direct3D11 vs_5_0 ps_5_0, D3D11-32.0.15.5585)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Direct3D11 vs_5_0 ps_5_0, D3D11-32.0.15.6109)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Direct3D11 vs_5_0 ps_5_0, D3D11-32.0.15.5599)",
    "ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Direct3D11 vs_5_0 ps_5_0, D3D11-32.0.15.6636)",
  ],
  "Google Inc. (AMD)": [
    "ANGLE (AMD, ASUS Radeon RX 560 Series (0x000067EF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, Radeon RX 560 Series (0x000067EF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, Radeon RX 560 Series (0x000067EF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, ASUS Radeon RX 560 Series (0x000067EF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001638) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon(TM) Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, Radeon R9 200 Series Direct3D11 vs_5_0 ps_5_0)",
    "ANGLE (AMD, Radeon RX 560 Series (0x000067EF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon RX 6500 XT Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon RX 6600 (0x000073FF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon RX 6600 XT (0x000073FF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon RX 6650 XT (navi23 LLVM 15.0.7 DRM 3.54 6.5.0-35-generic), OpenGL 4.6)",
    "ANGLE (AMD, AMD Radeon RX 6700 XT (0x000073DF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon RX 6750 XT (0x000073DF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon RX 6800 (0x000073BF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon RX 7700 XT (0x0000747E) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon RX 7900 XT (0x0000744C) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon RX590 GME (0x00006FDF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon Vega 3 Graphics (raven2 LLVM 15.0.7), OpenGL 4.6)",
    "ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001506) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001636) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001638) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon(TM) Graphics (0x0000164C) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon(TM) Graphics (0x0000164E) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001681) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon(TM) Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon(TM) R4 Graphics (0x0000131B) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon(TM) RX 560 Series (0x000067EF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon(TM) RX 560 Series Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, AMD Radeon(TM) Vega 3 Graphics (0x000015D8) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, NAVI24 (navi24 LLVM 15.0.7 DRM 3.54 6.6.26-1-MANJARO), OpenGL 4.6)",
    "ANGLE (AMD, Radeon (TM) RX 470 Graphics (0x000067DF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, Radeon HD 3200 Graphics Direct3D11 vs_5_0 ps_5_0), or similar",
    "ANGLE (AMD, Radeon HD 5850 Direct3D11 vs_5_0 ps_5_0), or similar",
    "ANGLE (AMD, Radeon Instinct MI25 MxGPU (0x0000686C) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, Radeon R9 200 Series Direct3D11 vs_5_0 ps_5_0)",
    "ANGLE (AMD, Radeon R9 200 Series Direct3D11 vs_5_0 ps_5_0), or similar",
    "ANGLE (AMD, Radeon RX 560 Series (0x000067FF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, Radeon RX 570 Series (0x000067DF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, Radeon RX 580 Series (0x000067DF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, Radeon RX 590 Series (0x000067DF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, Radeon RX(TM) RX 460 Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)",
    "ANGLE (AMD, Radeon RX550/550 Series Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.14501.18003)",
  ],
  "Google Inc. (Microsoft)": [
    "ANGLE (Microsoft, Microsoft Basic Render Driver Direct3D11 vs_5_0 ps_5_0)",
  ],
};

// 랜덤한 GPU 벤더와 해당 벤더에 맞는 GPU 모델을 선택하는 함수
const getRandomGpuVendorAndModel = () => {
  const vendors = Object.keys(GPU_DATABASE); // ["Intel Inc.", "NVIDIA Corporation", "Advanced Micro Devices, Inc."]
  const selectedVendor = vendors[Math.floor(Math.random() * vendors.length)];
  const gpuModels = GPU_DATABASE[selectedVendor]; // 해당 벤더의 GPU 목록 가져오기
  const selectedModel = gpuModels[Math.floor(Math.random() * gpuModels.length)];

  return { vendor: selectedVendor, model: selectedModel };
};

// 🇰🇷 대한민국 내 랜덤 위경도 생성 함수
const getRandomSouthKoreaLocation = () => {
  return {
    latitude: getRandomCoordinate(33.0, 38.6), // 대한민국 내 랜덤 위도
    longitude: getRandomCoordinate(124.6, 131.9), // 대한민국 내 랜덤 경도
  };
};

const getRandomNearbyLocation = (lat: number, lon: number, radiusKm = 3) => {
  const R = 6371; // 지구 반지름 (km)
  const randomRadius = Math.random() * radiusKm; // 0~radiusKm 사이 랜덤 거리
  const randomAngle = Math.random() * 2 * Math.PI; // 0~360도 사이 랜덤 방향

  // 위도, 경도 변환
  const deltaLat = (randomRadius / R) * (180 / Math.PI);
  const deltaLon =
    ((randomRadius / R) * (180 / Math.PI)) / Math.cos((lat * Math.PI) / 180);

  return {
    latitude: lat + deltaLat * Math.cos(randomAngle),
    longitude: lon + deltaLon * Math.sin(randomAngle),
  };
};

const getSmartRandomLocation = async (publicIp: string) => {
  const location = await getLocationFromIP(publicIp);
  console.log(location, "lo");
  if (!location) return getRandomSouthKoreaLocation(); // 기본값: 한국 내 랜덤

  return getRandomNearbyLocation(location.latitude, location.longitude, 3);
};

export interface EnvironmentData {
  userAgent: string;
  language: string;
  hardwareConcurrency: number | string;
  webdriver: boolean | string;
  gpuVendor: string;
  gpuModel: string;
  geolocation: { latitude: number; longitude: number };
  publicIp: string; // https://api.ipify.org?format=json 에서 조회한 IP
}

interface LaunchOptions {
  siteUrl: string;
  positionSide?: "SHORT" | "LONG";
}

export interface CustomLaunchOptions extends LaunchOptions {
  savedEnvironmentData: EnvironmentData;
}

const USER_AGENTS = [
  // ✅ Windows 10 - Chrome
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
];

const getRandomUserAgent = (): string => {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
};

const randomLaunchBrowser = async (
  options: LaunchOptions
): Promise<BrowserInstance> => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
    defaultViewport: null,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      `--user-agent=${getRandomUserAgent()}`,
      "--lang=ko-KR",
      "--window-size=1920,1080",
    ],
  });

  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "platform", {
      get: () => "Win32", // Windows 10/11의 경우 "Win64"도 가능
    });
  });
  await page.evaluateOnNewDocument(() => {
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function () {
      return "data:image/png;base64,canvasFingerprint"; // 특정한 캔버스 값으로 변조
    };

    const originalGetImageData =
      CanvasRenderingContext2D.prototype.getImageData;
    CanvasRenderingContext2D.prototype.getImageData = function (
      sx,
      sy,
      sw,
      sh
    ) {
      const imageData = originalGetImageData.call(this, sx, sy, sw, sh);
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = imageData.data[i] ^ 0xff; // 색상 데이터를 변조하여 캔버스 지문을 변경
      }
      return imageData;
    };
  });
  await page.evaluateOnNewDocument(() => {
    const commonFonts = [
      "Arial",
      "Verdana",
      "Times New Roman",
      "Courier New",
      "Tahoma",
      "Georgia",
      "Comic Sans MS",
      "Impact",
      "Trebuchet MS",
    ];

    Object.defineProperty(document, "fonts", {
      get: () => ({
        check: () => true,
        values: () => commonFonts,
      }),
    });
  });
  // await page.setViewport({ width: 1920, height: 1080 });
  const cdp = await page.target().createCDPSession();
  await cdp.send("Storage.clearDataForOrigin", {
    origin: new URL(options.siteUrl).origin, // 예: "https://example.com"
    storageTypes: "all", // cookies, localStorage, indexedDB 등 모든 타입을 초기화
  });

  const { vendor, model } = getRandomGpuVendorAndModel();

  // ✅ [1] 페이지 로딩 이전에 모든 환경 설정을 주입합니다.
  await page.evaluateOnNewDocument(
    (vendor: any, model: any) => {
      // navigator.webdriver 값을 false로 설정
      Object.defineProperty(navigator, "webdriver", { get: () => false });

      // 하드웨어 코어 수 랜덤 설정
      const commonCores = [2, 4, 6, 8];
      const randomCores =
        commonCores[Math.floor(Math.random() * commonCores.length)];
      Object.defineProperty(navigator, "hardwareConcurrency", {
        get: () => randomCores,
      });
      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function (parameter) {
        if (parameter === 7936 || parameter === 37445) return vendor;
        if (parameter === 7937 || parameter === 37446) return model; // RENDERER 변경
        return getParameter.call(this, parameter);
      };

      if (typeof WebGL2RenderingContext !== "undefined") {
        const getParameter2 = WebGL2RenderingContext.prototype.getParameter;
        WebGL2RenderingContext.prototype.getParameter = function (parameter) {
          if (parameter === 7936 || parameter === 37445) return vendor;
          if (parameter === 7937 || parameter === 37446) return model;
          return getParameter2.call(this, parameter);
        };
      }
    },
    vendor,
    model
  );

  // GPU 벤더 오버라이드 함수 정의 및 호출
  // function overrideWebGLVendor(randomVendor: string): void {
  //   const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
  //   WebGLRenderingContext.prototype.getParameter = function (
  //     parameter: number
  //   ) {
  //     if (parameter === 7936 || parameter === 37445) {
  //       return randomVendor;
  //     }
  //     return originalGetParameter.call(this, parameter);
  //   };

  //   if (typeof WebGL2RenderingContext !== "undefined") {
  //     const originalGetParameter2 =
  //       WebGL2RenderingContext.prototype.getParameter;
  //     WebGL2RenderingContext.prototype.getParameter = function (
  //       parameter: number
  //     ) {
  //       if (parameter === 7936 || parameter === 37445) {
  //         return randomVendor;
  //       }
  //       return originalGetParameter2.call(this, parameter);
  //     };
  //   }
  // }

  // overrideWebGLVendor(randomVendor);

  // ✅ [2] 첫 번째 페이지에서도 GPU 및 코어 수 변경 적용
  await page.evaluate(
    (vendor: any, model: any) => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });

      const commonCores = [2, 4, 6, 8];
      const randomCores =
        commonCores[Math.floor(Math.random() * commonCores.length)];
      Object.defineProperty(navigator, "hardwareConcurrency", {
        get: () => randomCores,
      });

      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function (parameter) {
        if (parameter === 7936 || parameter === 37445) return vendor;
        if (parameter === 7937 || parameter === 37446) return model; // RENDERER 변경
        return getParameter.call(this, parameter);
      };

      if (typeof WebGL2RenderingContext !== "undefined") {
        const getParameter2 = WebGL2RenderingContext.prototype.getParameter;
        WebGL2RenderingContext.prototype.getParameter = function (parameter) {
          if (parameter === 7936 || parameter === 37445) return vendor;
          if (parameter === 7937 || parameter === 37446) return model;
          return getParameter2.call(this, parameter);
        };
      }
    },
    vendor,
    model
  );

  const cookies = await page.cookies();
  if (cookies.length) {
    await page.deleteCookie(...cookies);
  }

  let publicIp = "unknown";

  // ✅ 더 안전한 IP 조회 방식 사용 (IPv4/IPv6 지원)
  try {
    const ipRes = await fetch("https://api64.ipify.org?format=json");
    if (ipRes.ok) {
      const ipData = await ipRes.json();
      publicIp = ipData.ip;
    }
  } catch (err) {
    console.warn("❌ 공인 IP 조회 실패:", err.message);
  }

  const randomLocation = await getSmartRandomLocation(publicIp);

  // ✅ [3] Geolocation 설정
  try {
    const context = browser.defaultBrowserContext();
    const domain = new URL(options.siteUrl).origin;
    await context.overridePermissions(domain, ["geolocation"]);
    await page.setGeolocation(randomLocation);
  } catch (error) {
    console.warn("Geolocation 설정에 실패했습니다.", error);
  }

  // ✅ [4] 환경 설정 확인 로그 출력
  console.log("📌 브라우저 환경 정보:");
  console.log(`🌍 접속 사이트: ${options.siteUrl}`);
  console.log(
    `🖥️ User-Agent: ${await page.evaluate(() => navigator.userAgent)}`
  );
  console.log(
    `📍 Geolocation:${randomLocation.latitude},${randomLocation.longitude} (서울)`
  );
  console.log(`🕰️ Timezone: Asia/Seoul`);
  console.log(`🌐 언어 설정: ${await page.evaluate(() => navigator.language)}`);
  console.log(
    `💻 하드웨어 코어 수: ${await page.evaluate(
      () => navigator.hardwareConcurrency
    )}`
  );
  console.log(
    `🔎 WebRTC (Navigator.webdriver 값): ${await page.evaluate(
      () => navigator.webdriver
    )}`
  );

  const gpuVendorInfo = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
    if (!gl) return "WebGL not supported";
    return gl.getParameter(gl.VENDOR);
  });

  console.log(`🎮 변경된 GPU 벤더 정보: ${gpuVendorInfo}`);

  // [5] 각종 환경 정보 수집
  const userAgent = await page.evaluate(() => navigator.userAgent);
  const language = await page.evaluate(() => navigator.language);
  const hardwareConcurrency = await page.evaluate(
    () => navigator.hardwareConcurrency
  );
  const webdriver = await page.evaluate(
    () => (navigator as any).webdriver || false
  );
  const gpuVendor = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
    if (!gl) return "WebGL not supported";
    return gl.getParameter(gl.VENDOR);
  });
  const gpuModel = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
    if (!gl) return "WebGL not supported";
    return gl.getParameter(gl.RENDERER);
  });

  const environmentData: EnvironmentData = {
    userAgent,
    language,
    hardwareConcurrency,
    webdriver,
    gpuVendor,
    gpuModel,
    geolocation: randomLocation,
    publicIp,
    // positionSide: options.positionSide,
  };

  return { browser, page, environmentData };
};

const customLaunchBrowser = async (
  options: CustomLaunchOptions
): Promise<BrowserInstance> => {
  const savedEnv = options.savedEnvironmentData;
  // 선언적으로 지정한 값 사용
  const userAgent = savedEnv.userAgent;
  const hardwareConcurrency = savedEnv.hardwareConcurrency;
  const gpuVendor = savedEnv.gpuVendor;
  const geolocation = savedEnv.geolocation;

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      `--user-agent=${userAgent}`,
      "--lang=ko-KR",
    ],
  });

  const page = await browser.newPage();
  const cdp = await page.target().createCDPSession();
  await cdp.send("Storage.clearDataForOrigin", {
    origin: new URL(options.siteUrl).origin,
    storageTypes: "all",
  });

  // [1] 페이지 로딩 이전 환경 설정 주입 (선언적 값 사용)
  await page.evaluateOnNewDocument(
    (fixedHardwareConcurrency, fixedGpuVendor) => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
      Object.defineProperty(navigator, "hardwareConcurrency", {
        get: () => fixedHardwareConcurrency,
      });
      function overrideWebGLVendor(randomVendor: string): void {
        const originalGetParameter =
          WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function (
          parameter: number
        ) {
          if (parameter === 7936 || parameter === 37445) {
            return randomVendor;
          }
          return originalGetParameter.call(this, parameter);
        };
        if (typeof WebGL2RenderingContext !== "undefined") {
          const originalGetParameter2 =
            WebGL2RenderingContext.prototype.getParameter;
          WebGL2RenderingContext.prototype.getParameter = function (
            parameter: number
          ) {
            if (parameter === 7936 || parameter === 37445) {
              return randomVendor;
            }
            return originalGetParameter2.call(this, parameter);
          };
        }
      }
      overrideWebGLVendor(fixedGpuVendor);
    },
    hardwareConcurrency,
    gpuVendor
  );

  // [2] 쿠키 삭제 및 Geolocation 설정 (선언적 값 사용)
  const cookies = await page.cookies();
  if (cookies.length) await page.deleteCookie(...cookies);

  try {
    const context = browser.defaultBrowserContext();
    const domain = new URL(options.siteUrl).origin;
    await context.overridePermissions(domain, ["geolocation"]);
    await page.setGeolocation(geolocation);
  } catch (error) {
    console.warn("Geolocation 설정에 실패했습니다.", error);
  }

  // [3] 환경 정보 최종 수집 (선언적 값 유지)
  const finalUserAgent = await page.evaluate(() => navigator.userAgent);
  const language = await page.evaluate(() => navigator.language);
  const finalHardwareConcurrency = await page.evaluate(
    () => navigator.hardwareConcurrency
  );
  const webdriver = await page.evaluate(
    () => (navigator as any).webdriver || false
  );
  const finalGpuVendor = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
    if (!gl) return "WebGL not supported";
    return gl.getParameter(gl.VENDOR);
  });
  let publicIp = "unknown";
  try {
    const ipRes = await fetch("https://api.ipify.org?format=json");
    if (ipRes.ok) {
      const ipData = await ipRes.json();
      publicIp = ipData.ip;
    }
  } catch (err) {
    console.warn("공인 IP 조회 실패:", err);
  }
  const finalGpuModel = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
    if (!gl) return "WebGL not supported";
    return gl.getParameter(gl.RENDERER);
  });

  const environmentData: EnvironmentData = {
    userAgent: finalUserAgent,
    language,
    hardwareConcurrency: finalHardwareConcurrency,
    webdriver,
    gpuVendor: finalGpuVendor,
    gpuModel: finalGpuModel,
    geolocation,
    publicIp,
    // positionSide: options.positionSide,
  };

  return { browser, page, environmentData };
};

/**
 * 주어진 Puppeteer Page에서 웹 지문에 해당하는 모든 정보를 추출합니다.
 * - 쿠키, 로컬스토리지, 세션스토리지
 * - geolocation (현재 위치, 권한이 부여된 경우)
 * - Cache Storage 키 목록 (브라우저 캐싱 정보)
 * - 브라우저 관련 정보 (User Agent, 언어, 코어 수, webdriver 여부, GPU 벤더, 플랫폼, 타임존, 화면 해상도)
 *
 * @param page Puppeteer Page 인스턴스
 * @returns PageFingerprint 객체
 */
export async function extractFullFingerprint(
  page: Page
): Promise<FullFingerprint> {
  // 고유 식별자 생성 (UUID)
  const id: string = uuidv4();

  // 쿠키 추출
  const cookies = await page.cookies();

  // 현재 viewport 정보
  const viewport = page.viewport() || { width: 0, height: 0 };
  const lastUpdated = new Date();

  // 로컬스토리지와 세션스토리지 데이터 추출
  const storageData = await page.evaluate(() => {
    const ls: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) ls[key] = localStorage.getItem(key) || "";
    }
    const ss: Record<string, string> = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) ss[key] = sessionStorage.getItem(key) || "";
    }
    return { localStorage: ls, sessionStorage: ss };
  });

  // Cache Storage의 키 목록 추출
  const cachesList = await page.evaluate(async () => {
    if ("caches" in window) {
      try {
        return await caches.keys();
      } catch (err) {
        return [];
      }
    }
    return [];
  });

  // Geolocation 정보 추출 (권한이 허용된 경우)
  const geolocation = await page.evaluate(() => {
    return new Promise<{ latitude: number; longitude: number } | null>(
      (resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) =>
              resolve({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              }),
            () => resolve(null),
            { timeout: 1000 }
          );
        } else {
          resolve(null);
        }
      }
    );
  });

  // navigator, screen 등 기타 브라우저 정보 추출
  const otherData = await page.evaluate(() => {
    const language = navigator.language;
    const hardwareConcurrency = navigator.hardwareConcurrency || 0;
    const webdriver = Boolean((navigator as any).webdriver);
    const platform = navigator.platform;
    const doNotTrack = navigator.doNotTrack || "";
    // readonly 배열을 mutable 배열로 변환
    const languages = navigator.languages
      ? Array.from(navigator.languages)
      : [];
    const cookieEnabled = navigator.cookieEnabled;
    const deviceMemory = (navigator as any).deviceMemory || null;

    let connection: {
      type?: string;
      downlink?: number;
      effectiveType?: string;
      rtt?: number;
      saveData?: boolean;
    } | null = null;

    if ((navigator as any).connection) {
      connection = {
        type: (navigator as any).connection.type,
        downlink: (navigator as any).connection.downlink,
        effectiveType: (navigator as any).connection.effectiveType,
        rtt: (navigator as any).connection.rtt,
        saveData: (navigator as any).connection.saveData,
      } as {
        type?: string;
        downlink?: number;
        effectiveType?: string;
        rtt?: number;
        saveData?: boolean;
      };
    }

    // Canvas Fingerprinting: 캔버스에 텍스트 렌더링 후 데이터 URL 추출
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let canvasFingerprint = "";
    if (ctx) {
      canvas.width = 200;
      canvas.height = 50;
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("Hello, world!", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("Hello, world!", 4, 17);
      canvasFingerprint = canvas.toDataURL();
    }

    const plugins: string[] = [];
    for (let i = 0; i < navigator.plugins.length; i++) {
      const plugin = navigator.plugins[i];
      plugins.push(plugin.name);
    }
    const mimeTypes: string[] = [];
    for (let i = 0; i < navigator.mimeTypes.length; i++) {
      const mime = navigator.mimeTypes[i];
      mimeTypes.push(mime.type);
    }

    const colorDepth = screen.colorDepth;
    const screenResolution = { width: screen.width, height: screen.height };
    const userAgent = navigator.userAgent;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return {
      language,
      hardwareConcurrency,
      webdriver,
      platform,
      doNotTrack,
      languages,
      cookieEnabled,
      deviceMemory,
      network: connection,
      canvasFingerprint,
      plugins,
      mimeTypes,
      colorDepth,
      screenResolution,
      userAgent,
      timezone,
    };
  });

  // GPU 벤더 정보 추출 (WebGL 사용)
  const gpuVendor = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
    return gl ? gl.getParameter(gl.VENDOR) : "Not Supported";
  });

  return {
    id,
    cookies,
    localStorage: storageData.localStorage,
    sessionStorage: storageData.sessionStorage,
    userAgent: otherData.userAgent,
    viewport,
    lastUpdated,
    geolocation,
    caches: cachesList,
    language: otherData.language,
    hardwareConcurrency: otherData.hardwareConcurrency,
    webdriver: otherData.webdriver,
    gpuVendor,
    platform: otherData.platform,
    timezone: otherData.timezone,
    screenResolution: otherData.screenResolution,
    plugins: otherData.plugins,
    mimeTypes: otherData.mimeTypes,
    cookieEnabled: otherData.cookieEnabled,
    deviceMemory: otherData.deviceMemory,
    languages: otherData.languages,
    colorDepth: otherData.colorDepth,
    canvasFingerprint: otherData.canvasFingerprint,
    doNotTrack: otherData.doNotTrack,
  };
}

export {
  USER_AGENTS,
  getRandomUserAgent,
  randomLaunchBrowser,
  customLaunchBrowser,
};
