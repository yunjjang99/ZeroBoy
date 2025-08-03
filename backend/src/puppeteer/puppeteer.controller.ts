// src/puppeteer-test/puppeteer.controller.ts
import { Controller, Post, Body, Get } from "@nestjs/common";
import { PuppeteerService } from "./puppeteer.service";
import { failure, success } from "@/utils/functionalUtil";

@Controller("puppeteer")
export class PuppeteerController {
  constructor(private readonly puppeteerService: PuppeteerService) {}

  @Post("launch")
  async launchBrowser(@Body("url") url: string) {
    const browser = await this.puppeteerService.createBrowser(url);

    const pages = await browser.browser.pages();
    const page = pages[0]; // 첫 번째 탭

    // await page.goto(url, { waitUntil: "networkidle2", timeout: 10000 });
    const title = await page.title();
    // await page.close();
    return success({ title, uuid: browser.uuid });
  }

  @Post("reopen")
  async reopenBrowser(@Body("uuid") uuid: string) {
    try {
      if (!uuid) {
        return failure({ message: "UUID가 비어 있습니다." });
      }

      const browser = await this.puppeteerService.reopenBrowser(uuid);

      const pages = await browser.pages();
      const page = pages[0];
      const title = await page.title();

      return success({ title });
    } catch (err) {
      console.error("reopen error:", err);
      return failure(err.message ?? { message: err.message });
    }
  }

  @Get("status")
  async browserStatus() {
    const statuses = await this.puppeteerService.getBrowserStatuses();
    return success({ count: statuses.length, statuses });
  }
}
