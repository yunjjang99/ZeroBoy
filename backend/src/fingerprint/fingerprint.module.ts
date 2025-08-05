import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BrowserFingerprint } from "./entities/browser-fingerprint.entity";
import { FingerprintService } from "./fingerprint.service";
import { FingerprintController } from "./fingerprint.controller";

@Module({
  imports: [TypeOrmModule.forFeature([BrowserFingerprint])],
  controllers: [FingerprintController],
  providers: [FingerprintService],
  exports: [FingerprintService],
})
export class FingerprintModule {}
