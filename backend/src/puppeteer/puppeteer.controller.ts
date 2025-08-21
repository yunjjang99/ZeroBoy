// src/puppeteer/puppeteer.controller.ts
import { Controller, Post, Body, Get, Param, Delete } from "@nestjs/common";
import { PuppeteerService } from "./puppeteer.service";
import { failure, success } from "@/utils/functionalUtil";

@Controller("puppeteer")
export class PuppeteerController {
  constructor(private readonly puppeteerService: PuppeteerService) {}

  @Post("browser/create")
  async createBrowser(
    @Body() body: { siteUrl: string; accountInfo?: any; exchange?: string }
  ) {
    try {
      const browser = await this.puppeteerService.createBrowser(
        body.siteUrl,
        body.accountInfo,
        body.exchange
      );

      return success({
        uuid: browser.uuid,
        message: "Camoufox browser created successfully",
      });
    } catch (error) {
      return failure({ message: error.message });
    }
  }

  @Post("browser/:uuid/reopen")
  async reopenBrowser(@Param("uuid") uuid: string) {
    try {
      if (!uuid) {
        return failure({ message: "UUID가 비어 있습니다." });
      }

      const result = await this.puppeteerService.reopenBrowser(uuid);

      return success({
        uuid: result.uuid,
        message: "Camoufox browser reopened successfully",
      });
    } catch (error) {
      return failure({ message: error.message });
    }
  }

  @Delete("browser/:uuid")
  async closeBrowser(@Param("uuid") uuid: string) {
    try {
      if (!uuid) {
        return failure({ message: "UUID가 비어 있습니다." });
      }

      await this.puppeteerService.closeBrowser(uuid);

      return success({
        uuid,
        message: "Camoufox browser closed successfully",
      });
    } catch (error) {
      return failure({ message: error.message });
    }
  }

  @Get("browsers")
  async getAllBrowsers() {
    try {
      const browsers = await this.puppeteerService.getAllBrowsers();
      const browserList = Array.from(browsers.keys()).map((uuid) => ({ uuid }));

      return success({
        count: browserList.length,
        browsers: browserList,
      });
    } catch (error) {
      return failure({ message: error.message });
    }
  }

  @Get("browser/:uuid")
  async getBrowser(@Param("uuid") uuid: string) {
    try {
      const browser = await this.puppeteerService.getBrowser(uuid);

      if (!browser) {
        return failure({ message: "Browser not found" });
      }

      return success({
        uuid,
        status: "running",
      });
    } catch (error) {
      return failure({ message: error.message });
    }
  }

  @Get("browser/:uuid/fingerprint")
  async getBrowserFingerprint(@Param("uuid") uuid: string) {
    try {
      const fingerprint =
        await this.puppeteerService.getBrowserFingerprint(uuid);

      if (!fingerprint) {
        return failure({ message: "Fingerprint not found" });
      }

      return success({
        uuid,
        fingerprint,
      });
    } catch (error) {
      return failure({ message: error.message });
    }
  }

  @Post("browser/:uuid/update-fingerprint")
  async updateBrowserFingerprint(
    @Param("uuid") uuid: string,
    @Body()
    body: { userAgent?: string; webglVendor?: string; webglRenderer?: string }
  ) {
    try {
      await this.puppeteerService.updateBrowserFingerprint(uuid, body);
      return success({
        uuid,
        message: "Fingerprint updated successfully",
      });
    } catch (error) {
      return failure({ message: error.message });
    }
  }
}
