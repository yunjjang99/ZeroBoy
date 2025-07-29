// src/puppeteer/puppeteer.service.ts
import { Injectable, OnModuleDestroy, Logger } from "@nestjs/common";
import { Browser, Page } from "puppeteer-core";
import puppeteer from "puppeteer-extra";
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
import {
  generateRandomFingerprintForKorea,
  applyFingerprint,
} from "../utils/fingerprintGenerator";
import { FingerprintService } from "@/fingerprint/fingerprint.service";

export interface PuppeteerInstance {
  browser: Browser;
  uuid: string;
}

@Injectable()
export class PuppeteerService implements OnModuleDestroy {
  constructor(private readonly fingerprintService: FingerprintService) {}

  private readonly logger = new Logger(PuppeteerService.name);
  private readonly browsers = new Map<string, Browser>();

  async createBrowser(): Promise<PuppeteerInstance> {
    //  puppeteer.use(StealthPlugin());
    const { connect } = require("puppeteer-real-browser");

    const { browser, page }: { browser: Browser; page: Page } = await connect({
      headless: false,
      executablePath: process.env.CHROME_PATH,
      args: [],
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
    const uuid = await this.fingerprintService.saveFingerprint(fingerprint);
    this.logger.log(`📦 브라우저 Fingerprint 저장됨: ${uuid}`);

    //await applyFingerprint(page, fingerprint);
    await applyFingerprint(page, fingerprint);
    // browser.on("targetcreated", async (target) => {
    //   const page = await target.page();
    //   if (page) {
    //     console.log("새 창 생성 감지됨. 차단 시도");
    //     await page.close();
    //   }
    // });

    // await page.goto("https://amiunique.org/fingerprint", {
    //   waitUntil: "domcontentloaded",
    // });
    await page.goto("https://www.geolocation.com", {
      waitUntil: "domcontentloaded",
    });

    this.browsers.set(uuid, browser);
    return { browser, uuid };
  }

  async reopenBrowser(uuid: string): Promise<Browser> {
    const { connect } = require("puppeteer-real-browser");

    // 1. DB에서 fingerprint 불러오기
    const fingerprint = await this.fingerprintService.getFingerprint(uuid);
    if (!fingerprint) {
      throw new Error(`해당 UUID에 대한 Fingerprint 없음: ${uuid}`);
    }

    // 2. 브라우저 실행
    const { browser, page }: { browser: Browser; page: Page } = await connect({
      headless: false,
      executablePath: process.env.CHROME_PATH,
      args: [],
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

    // 4. 차단 방지: 새 창 생성 자동 종료
    browser.on("targetcreated", async (target) => {
      const newPage = await target.page();
      if (newPage) {
        console.log("새 창 생성 감지됨. 차단 시도");
        await newPage.close();
      }
    });

    // 5. 검증용 페이지 접속
    await page.goto("https://amiunique.org/fingerprint", {
      waitUntil: "domcontentloaded",
    });

    this.logger.log(`♻️ Fingerprint 재적용 브라우저 실행됨 (UUID: ${uuid})`);
    this.browsers.set(uuid, browser);
    return browser;
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

    // Map의 values를 배열로 변환 후 map 사용
    const closeTasks = Array.from(this.browsers.values()).map((browser) =>
      browser.close()
    );

    await Promise.all(closeTasks);
    this.browsers.clear();
  }
}
