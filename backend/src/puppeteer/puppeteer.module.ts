// src/puppeteer/puppeteer.module.ts
import { Module, Global } from "@nestjs/common";
import { PuppeteerService } from "./puppeteer.service";
import { PuppeteerController } from "./puppeteer.controller";

@Global()
@Module({
  providers: [PuppeteerService],
  controllers: [PuppeteerController],
  exports: [PuppeteerService],
})
export class PuppeteerModule {}
