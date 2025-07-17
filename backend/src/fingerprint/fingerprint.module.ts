import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BrowserFingerprint } from "./entities/browser-fingerprint.entity";
import { FingerprintService } from "./fingerprint.service";

@Module({
  imports: [TypeOrmModule.forFeature([BrowserFingerprint])],
  providers: [FingerprintService],
  exports: [FingerprintService],
})
export class FingerprintModule {}
