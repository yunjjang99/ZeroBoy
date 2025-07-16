// src/puppeteer-test/puppeteer.controller.ts
import { Controller, Post, Body } from "@nestjs/common";
import { PuppeteerService } from "./puppeteer.service";

@Controller("puppeteer-test")
export class PuppeteerController {
  constructor(private readonly puppeteerService: PuppeteerService) {}

  @Post("launch")
  async launchBrowser(@Body("url") url: string) {
    const browser = await this.puppeteerService.createBrowser();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const title = await page.title();
    console.log(title, "타이틀");
    // await page.close();
    return { status: "ok", title };
  }
}
