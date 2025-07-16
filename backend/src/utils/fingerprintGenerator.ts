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

const USER_AGENTS = [
  //"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.127 Safari/537.36",
  //"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  //"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
  //"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.2420.81",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0",
  // // 추가된 Win32 기반 User-Agent 목록 (Cloudflare 우회 검증됨)
  // "Mozilla/5.0 (Windows NT 10.0; Win32; x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5790.170 Safari/537.36",
  // "Mozilla/5.0 (Windows NT 10.0; Win32; x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.199 Safari/537.36",
  // "Mozilla/5.0 (Windows NT 10.0; Win32; x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.5672.127 Safari/537.36",
  // "Mozilla/5.0 (Windows NT 10.0; Win32; x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.167 Safari/537.36",
  // "Mozilla/5.0 (Windows NT 10.0; Win32; x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.5563.146 Safari/537.36",
  // "Mozilla/5.0 (Windows NT 6.1; Win32; x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
  // "Mozilla/5.0 (Windows NT 6.1; Win32; x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
  // "Mozilla/5.0 (Windows NT 6.1; Win32; x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
  // "Mozilla/5.0 (Windows NT 5.1; Win32; x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36",
  // "Mozilla/5.0 (Windows NT 5.1; Win32; x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
  // "Mozilla/5.0 (Windows NT 6.1; Win32; x86) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
  // "Mozilla/5.0 (Windows NT 10.0; Win32; x86; rv:116.0) Gecko/20100101 Firefox/116.0",
  // "Mozilla/5.0 (Windows NT 10.0; Win32; x86; rv:115.0) Gecko/20100101 Firefox/115.0",
  // "Mozilla/5.0 (Windows NT 6.1; Win32; x86; rv:102.0) Gecko/20100101 Firefox/102.0",
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
    languages: ["ko-KR", "ko"],
    timezone: "Asia/Seoul",
    platform: "Win32",
    hardwareConcurrency: [2, 4, 8][Math.floor(Math.random() * 3)],
    colorDepth: [24, 30][Math.floor(Math.random() * 2)],
    screenResolution: [
      { width: 1920, height: 1080 },
      { width: 1600, height: 900 },
      { width: 1366, height: 768 },
    ][Math.floor(Math.random() * 3)],
    gpuVendor: vendor,
    gpuModel: model,
    webdriver: false,
    latitude,
    longitude,
  };
}

export async function applyFingerprint(
  page: Page,
  fingerprint: Awaited<ReturnType<typeof generateRandomFingerprintForKorea>>
) {
  // await page.setUserAgent(fingerprint.userAgent); // 통과 탈락
  await page.setGeolocation({
    latitude: fingerprint.latitude,
    longitude: fingerprint.longitude,
    accuracy: 50,
  });
  await page.evaluateOnNewDocument((fp) => {
    Object.defineProperty(navigator, "language", { get: () => fp.language });
    // Object.defineProperty(navigator, "languages", { get: () => fp.languages });
    Object.defineProperty(navigator, "platform", { get: () => fp.platform });
    Object.defineProperty(navigator, "hardwareConcurrency", {
      get: () => fp.hardwareConcurrency,
    });
    Object.defineProperty(navigator, "webdriver", { get: () => fp.webdriver });
    Object.defineProperty(screen, "colorDepth", { get: () => fp.colorDepth });
    Object.defineProperty(screen, "width", {
      get: () => fp.screenResolution.width,
    });
    Object.defineProperty(screen, "height", {
      get: () => fp.screenResolution.height,
    });
    const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function (param) {
      if (param === 37445) return fp.gpuVendor;
      if (param === 37446) return fp.gpuModel;
      return originalGetParameter.call(this, param);
    };
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function (...args) {
      const ctx = this.getContext("2d");
      ctx.fillStyle = "#f00";
      ctx.fillRect(0, 0, 10, 10);
      return originalToDataURL.apply(this, args);
    };
    Object.defineProperty(Intl.DateTimeFormat.prototype, "resolvedOptions", {
      value: function () {
        return { timeZone: fp.timezone };
      },
    });
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
      success(position as GeolocationPosition);
    };
    const watchPosition = (
      success: PositionCallback,
      error?: PositionErrorCallback
    ) => {
      const watchId = Math.floor(Math.random() * 10000);
      success(position as GeolocationPosition);
      return watchId;
    };
    navigator.geolocation.getCurrentPosition = getCurrentPosition;
    navigator.geolocation.watchPosition = watchPosition;
  }, fingerprint);
}
