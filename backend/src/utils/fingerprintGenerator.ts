// src/utils/fingerprintGenerator.ts

import { Page } from "puppeteer-core";
import axios from "axios";

interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  toJSON(): any;
}

interface GeolocationPosition {
  coords: GeolocationCoordinates;
  timestamp: number;
  toJSON(): any;
}

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

// 🚨 실제 Chrome 버전과 일치하는 User-Agent만 사용 (최신 버전들)
const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
];

const getRandomCoordinate = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const getRandomSouthKoreaLocation = () => {
  return {
    latitude: getRandomCoordinate(33.0, 38.6),
    longitude: getRandomCoordinate(124.6, 131.9),
  };
};

const getLocationFromIP = async (ip: string) => {
  try {
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);
    if (response.status !== 200 || !response.data)
      throw new Error("No location data");
    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
    };
  } catch {
    return null;
  }
};

const getRandomNearbyLocation = (lat: number, lon: number, radiusKm = 3) => {
  const R = 6371;
  const r = Math.random() * radiusKm;
  const angle = Math.random() * 2 * Math.PI;
  const dLat = (r / R) * (180 / Math.PI);
  const dLon = ((r / R) * (180 / Math.PI)) / Math.cos((lat * Math.PI) / 180);
  return {
    latitude: lat + dLat * Math.cos(angle),
    longitude: lon + dLon * Math.sin(angle),
  };
};

const getSmartRandomLocation = async (ip: string) => {
  const location = await getLocationFromIP(ip);
  if (!location) return getRandomSouthKoreaLocation();
  return getRandomNearbyLocation(location.latitude, location.longitude);
};

function getRandomGpuVendorAndModel() {
  const vendors = Object.keys(GPU_DATABASE);
  const vendor = vendors[Math.floor(Math.random() * vendors.length)];
  const models = GPU_DATABASE[vendor];
  const model = models[Math.floor(Math.random() * models.length)];
  return { vendor, model };
}

export async function generateRandomFingerprintForKorea(publicIp: string) {
  const { latitude, longitude } = await getSmartRandomLocation(publicIp);
  const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
  const { vendor, model } = getRandomGpuVendorAndModel();

  return {
    userAgent,
    language: "ko-KR",
    languages: ["ko-KR", "ko", "en-US", "en"],
    timezone: "Asia/Seoul",
    platform: "Win32",
    hardwareConcurrency: [2, 4, 8, 12, 16][Math.floor(Math.random() * 5)],
    colorDepth: [24, 30][Math.floor(Math.random() * 2)],
    screenResolution: [
      { width: 1920, height: 1080 },
      { width: 1600, height: 900 },
      { width: 1366, height: 768 },
      { width: 2560, height: 1440 },
      { width: 1440, height: 900 },
    ][Math.floor(Math.random() * 5)],
    gpuVendor: vendor,
    gpuModel: model,
    webdriver: false,
    latitude,
    longitude,
    publicIp,
  };
}

export async function applyFingerprint(
  page: Page,
  fingerprint: Awaited<ReturnType<typeof generateRandomFingerprintForKorea>>
) {
  await page.setUserAgent(fingerprint.userAgent);
  await page.setGeolocation({
    latitude: fingerprint.latitude,
    longitude: fingerprint.longitude,
    accuracy: 50,
  });

  await page.evaluateOnNewDocument((fp) => {
    // �� Dolphin Anty 스타일의 완전한 webdriver 숨김
    // 1. 즉시 모든 자동화 흔적 제거 (페이지 로드 전)
    const removeAutomationTraces = () => {
      // webdriver 속성 완전 제거
      delete (navigator as any).webdriver;
      delete (window as any).webdriver;
      delete (document as any).webdriver;
      delete (globalThis as any).webdriver;

      // Object.defineProperty로 완전 차단
      const defineUndefined = (obj: any, prop: string) => {
        try {
          Object.defineProperty(obj, prop, {
            get: () => undefined,
            set: () => {},
            configurable: true,
            enumerable: false,
          });
        } catch (e) {
          // 이미 정의된 경우 무시
        }
      };

      defineUndefined(navigator, "webdriver");
      defineUndefined(window, "webdriver");
      defineUndefined(document, "webdriver");
      defineUndefined(globalThis, "webdriver");

      // 프로토타입 체인에서 완전 제거
      let currentProto = (navigator as any).__proto__;
      while (currentProto) {
        if (currentProto.hasOwnProperty("webdriver")) {
          delete currentProto.webdriver;
        }
        currentProto = currentProto.__proto__;
      }
    };

    // 즉시 실행
    removeAutomationTraces();

    // 2. Dolphin Anty 스타일의 확장된 자동화 속성 제거
    const automationProps = [
      "webdriver",
      "selenium",
      "puppeteer",
      "headless",
      "automation",
      "bot",
      "crawler",
      "_selenium",
      "_webdriver_evaluate",
      "_webdriver_script_func",
      "_webdriver_script_func_result",
      "_webdriver_script_params",
      "_$cdc_asdjflasutopfhvcZLmcfl_",
      "_$chrome_asyncScriptInfo",
      "domAutomation",
      "domAutomationController",
      "_phantom",
      "callPhantom",
      "phantom",
      "awesomium",
      "nightmare",
      "webdriver-evaluate",
      "webdriver-evaluate-result",
      "webdriver-script-evaluate",
      "webdriver-script-evaluate-result",
      "webdriver-script-function",
      "webdriver-script-params",
      "webdriver-script-result",
      "webdriver-script-result-type",
      "webdriver-script-result-value",
      "webdriver-script-result-error",
      "webdriver-script-result-error-message",
      "webdriver-script-result-error-stack",
      "webdriver-script-result-error-name",
      "webdriver-script-result-error-lineNumber",
      "webdriver-script-result-error-columnNumber",
      "webdriver-script-result-error-fileName",
      "webdriver-script-result-error-cause",
      "webdriver-script-result-error-cause-message",
      "webdriver-script-result-error-cause-stack",
      "webdriver-script-result-error-cause-name",
      "webdriver-script-result-error-cause-lineNumber",
      "webdriver-script-result-error-cause-columnNumber",
      "webdriver-script-result-error-cause-fileName",
    ];

    // 모든 객체에서 자동화 속성 제거
    const objects = [navigator, window, document, globalThis];
    objects.forEach((obj) => {
      automationProps.forEach((prop) => {
        if ((obj as any)[prop] !== undefined) {
          delete (obj as any)[prop];
          Object.defineProperty(obj, prop, {
            get: () => undefined,
            set: () => {},
            configurable: true,
            enumerable: false,
          });
        }
      });
    });

    // 3. Dolphin Anty 스타일의 toString 완전 오버라이드
    const originalToString = Object.prototype.toString;
    Object.prototype.toString = function () {
      const str = originalToString.call(this);
      const automationKeywords = [
        "webdriver",
        "selenium",
        "puppeteer",
        "phantom",
        "nightmare",
        "awesomium",
        "automation",
        "bot",
      ];

      if (automationKeywords.some((keyword) => str.includes(keyword))) {
        return "[object Object]";
      }
      return str;
    };

    const originalFunctionToString = Function.prototype.toString;
    Function.prototype.toString = function () {
      const str = originalFunctionToString.call(this);
      const automationKeywords = [
        "webdriver",
        "selenium",
        "puppeteer",
        "phantom",
        "nightmare",
        "awesomium",
        "automation",
        "bot",
      ];

      if (automationKeywords.some((keyword) => str.includes(keyword))) {
        return "function () { [native code] }";
      }
      return str;
    };

    // 4. 실제 사용자처럼 보이도록 최소한의 속성만 수정
    Object.defineProperty(navigator, "language", {
      get: () => fp.language,
      configurable: true,
    });
    Object.defineProperty(navigator, "languages", {
      get: () => fp.languages,
      configurable: true,
    });
    Object.defineProperty(navigator, "platform", {
      get: () => fp.platform,
      configurable: true,
    });
    Object.defineProperty(navigator, "hardwareConcurrency", {
      get: () => fp.hardwareConcurrency,
      configurable: true,
    });

    // 5. Chrome 객체는 실제 브라우저처럼 설정
    if (!(window as any).chrome) {
      Object.defineProperty(window, "chrome", {
        value: {
          runtime: {},
          loadTimes: function () {},
          csi: function () {},
          app: {},
        },
        configurable: true,
      });
    }

    // 6. Permissions API는 실제 브라우저처럼 설정
    if (!navigator.permissions) {
      Object.defineProperty(navigator, "permissions", {
        value: {
          query: function () {
            return Promise.resolve({ state: "granted" });
          },
        },
        configurable: true,
      });
    }

    // 7. Screen 속성은 실제 화면 크기와 일치하도록 설정
    const actualScreen = {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
    };

    // 실제 화면 크기와 fingerprint 크기가 다르면 실제 크기 사용
    if (
      actualScreen.width !== fp.screenResolution.width ||
      actualScreen.height !== fp.screenResolution.height
    ) {
      fp.screenResolution = {
        width: actualScreen.width,
        height: actualScreen.height,
      };
    }

    Object.defineProperty(screen, "colorDepth", {
      get: () => fp.colorDepth,
      configurable: true,
    });

    // 8. WebGL은 최소한의 수정만
    const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function (param) {
      if (param === 37445) return fp.gpuVendor;
      if (param === 37446) return fp.gpuModel;
      return originalGetParameter.call(this, param);
    };

    // 9. Timezone 설정
    Object.defineProperty(Intl.DateTimeFormat.prototype, "resolvedOptions", {
      value: function () {
        return { timeZone: fp.timezone };
      },
      configurable: true,
    });

    // 10. Geolocation 시뮬레이션
    const coords = {
      latitude: fp.latitude,
      longitude: fp.longitude,
      accuracy: 50,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
      toJSON: () => ({
        latitude: fp.latitude,
        longitude: fp.longitude,
        accuracy: 50,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      }),
    };

    const position = {
      coords,
      timestamp: Date.now(),
      toJSON: () => ({
        coords: coords.toJSON(),
        timestamp: Date.now(),
      }),
    };

    const getCurrentPosition = (
      success: PositionCallback,
      error?: PositionErrorCallback
    ) => {
      setTimeout(
        () => {
          success(position as GeolocationPosition);
        },
        Math.random() * 100 + 50
      );
    };

    const watchPosition = (
      success: PositionCallback,
      error?: PositionErrorCallback
    ) => {
      const watchId = Math.floor(Math.random() * 10000);
      setTimeout(
        () => {
          success(position as GeolocationPosition);
        },
        Math.random() * 100 + 50
      );
      return watchId;
    };

    navigator.geolocation.getCurrentPosition = getCurrentPosition;
    navigator.geolocation.watchPosition = watchPosition;

    // 11. Chrome 버전 일치 확인
    const userAgentVersion = navigator.userAgent.match(/Chrome\/(\d+)/);
    if (userAgentVersion) {
      const version = userAgentVersion[1];
      if (!navigator.userAgent.includes(`Chrome/${version}`)) {
        Object.defineProperty(navigator, "userAgent", {
          get: () =>
            navigator.userAgent.replace(/Chrome\/\d+/, `Chrome/${version}`),
          configurable: true,
        });
      }
    }

    // 12. 자동화 감지 스크립트 무력화
    const originalQuerySelector = document.querySelector;
    document.querySelector = function (selector) {
      if (typeof selector === "string" && selector.includes("webdriver")) {
        return null;
      }
      return originalQuerySelector.call(this, selector);
    };

    // 13. 지속적인 webdriver 제거 (Dolphin Anty 스타일)
    setInterval(removeAutomationTraces, 1000);

    // 14. 페이지 로드 완료 후 추가 정리
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", removeAutomationTraces);
    } else {
      removeAutomationTraces();
    }

    window.addEventListener("load", removeAutomationTraces);
  }, fingerprint);

  // 쿠키 정리
  const cookies = await page.cookies();
  if (cookies.length) {
    await page.deleteCookie(...cookies);
  }
}
