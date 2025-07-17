// src/puppeteer/puppeteer.module.ts
import { Module, Global } from "@nestjs/common";
import { PuppeteerService } from "./puppeteer.service";
import { PuppeteerController } from "./puppeteer.controller";
import { FingerprintService } from "@/fingerprint/fingerprint.service";
import { FingerprintModule } from "@/fingerprint/fingerprint.module";

@Global()
@Module({
  imports: [
    FingerprintModule, // 👈 반드시 import
    // TypeOrmModule.forFeature([...]) // 필요시 추가
  ],
  providers: [PuppeteerService],
  controllers: [PuppeteerController],
  exports: [PuppeteerService],
})
export class PuppeteerModule {}
