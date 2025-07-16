// src/puppeteer/puppeteer.service.ts
import { Injectable, OnModuleDestroy, Logger } from "@nestjs/common";
import { Browser } from "puppeteer-core";
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

import puppeteer from "puppeteer-extra";

@Injectable()
export class PuppeteerService implements OnModuleDestroy {
  private readonly logger = new Logger(PuppeteerService.name);
  private browsers: Browser[] = [];

  async createBrowser(): Promise<Browser> {
    puppeteer.use(StealthPlugin());

    const { connect } = require("puppeteer-real-browser");

    const { browser, page } = await connect({
      headless: false,
      //   devtools: true, // 자동으로 개발자 도구 열기
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

    browser.on("targetcreated", async (target) => {
      const page = await target.page();
      if (page) {
        console.log("새 창 생성 감지됨. 차단 시도");
        await page.close();
      }
    });

    await page.evaluateOnNewDocument(() => {
      window.open = () => {
        console.log("window.open 호출 차단");
        return null;
      };
    });

    // ✅ 브라우저 지문 랜덤 설정
    await this.applyRandomFingerprint(page);

    await page.goto("https://amiunique.org/fingerprint", {
      waitUntil: "domcontentloaded",
    });

    this.browsers.push(browser);
    return browser;
  }

  private async applyRandomFingerprint(page: any) {
    await page.evaluateOnNewDocument(() => {
      const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/134.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
      ];
      const randomUA =
        userAgents[Math.floor(Math.random() * userAgents.length)];
      Object.defineProperty(navigator, "userAgent", {
        get: () => randomUA,
      });
      Object.defineProperty(navigator, "hardwareConcurrency", {
        get: () => [2, 4, 8][Math.floor(Math.random() * 3)],
      });
      Object.defineProperty(navigator, "webdriver", {
        get: () => false,
      });
    });
  }

  async onModuleDestroy() {
    this.logger.log("모듈 종료, 브라우저 모두 종료");
    await Promise.all(this.browsers.map((b) => b.close()));
  }
}
