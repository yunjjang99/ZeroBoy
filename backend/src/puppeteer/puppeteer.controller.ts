// src/puppeteer-test/puppeteer.controller.ts
import { Controller, Post, Body } from "@nestjs/common";
import { PuppeteerService } from "./puppeteer.service";
import { failure, success } from "@/utils/functionalUtil";

@Controller("puppeteer")
export class PuppeteerController {
  constructor(private readonly puppeteerService: PuppeteerService) {}

  @Post("launch")
  async launchBrowser(@Body("url") url: string) {
    const browser = await this.puppeteerService.createBrowser();

    const pages = await browser.pages();
    const page = pages[0]; // 첫 번째 탭

    // await page.goto(url, { waitUntil: "networkidle2", timeout: 10000 });
    const title = await page.title();
    // await page.close();
    return success({ title });
  }
  catch(err) {
    console.error("Puppeteer Error:", err);
    return failure({
      message: "브라우저 실행 중 오류가 발생했습니다.",
      status: 500,
    });
  }
}
