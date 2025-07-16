// src/puppeteer/puppeteer.service.ts
import { Injectable, OnModuleDestroy, Logger } from "@nestjs/common";
import { Browser, Page } from "puppeteer-core";
import puppeteer from "puppeteer-extra";
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
import {
  generateRandomFingerprintForKorea,
  applyFingerprint,
} from "../utils/fingerprintGenerator";

@Injectable()
export class PuppeteerService implements OnModuleDestroy {
  private readonly logger = new Logger(PuppeteerService.name);
  private browsers: Browser[] = [];

  async createBrowser(): Promise<Browser> {
    // puppeteer.use(StealthPlugin());
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
    //await applyFingerprint(page, fingerprint);
    await applyFingerprint(page, fingerprint);
    browser.on("targetcreated", async (target) => {
      const page = await target.page();
      if (page) {
        console.log("새 창 생성 감지됨. 차단 시도");
        await page.close();
      }
    });

    // await page.goto("https://amiunique.org/fingerprint", {
    //   waitUntil: "domcontentloaded",
    // });
    await page.goto("https://www.geolocation.com", {
      waitUntil: "domcontentloaded",
    });

    this.browsers.push(browser);
    return browser;
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
    await Promise.all(this.browsers.map((b) => b.close()));
  }
}
