import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { FingerprintService } from "./fingerprint.service";
import { BrowserFingerprint } from "./entities/browser-fingerprint.entity";
import { failure, success } from "@/utils/functionalUtil";

@Controller("fingerprint")
export class FingerprintController {
  constructor(private readonly fingerprintService: FingerprintService) {}

  @Get("profiles")
  async getProfiles() {
    try {
      const profiles = await this.fingerprintService.getAllFingerprints();
      return success(profiles);
    } catch (error) {
      console.error("프로필 목록 조회 실패:", error);
      return failure({ message: "프로필 목록 조회에 실패했습니다." });
    }
  }

  @Get("profiles/:uuid")
  async getProfile(@Param("uuid") uuid: string) {
    try {
      const profile = await this.fingerprintService.getFingerprint(uuid);
      if (!profile) {
        return failure({ message: "프로필을 찾을 수 없습니다." });
      }
      return success(profile);
    } catch (error) {
      return failure({ message: "프로필 조회에 실패했습니다." });
    }
  }

  @Post("profiles")
  async saveFingerprint(
    @Body() data: { fingerprint: Partial<BrowserFingerprint>; siteUrl: string }
  ) {
    try {
      const uuid = await this.fingerprintService.saveFingerprint(
        data.fingerprint,
        data.siteUrl
      );
      return success({ uuid });
    } catch (error) {
      return failure({ message: "프로필 저장에 실패했습니다." });
    }
  }

  @Put("profiles/:uuid/session")
  async updateSession(
    @Param("uuid") uuid: string,
    @Body()
    session: { cookies: any[]; localStorage: string; sessionStorage: string }
  ) {
    try {
      await this.fingerprintService.updateSession(uuid, session);
      return success({ message: "세션이 업데이트되었습니다." });
    } catch (error) {
      return failure({ message: "세션 업데이트에 실패했습니다." });
    }
  }

  @Delete("profiles/:uuid")
  async deleteProfile(@Param("uuid") uuid: string) {
    try {
      const deleted = await this.fingerprintService.deleteFingerprint(uuid);
      if (!deleted) {
        return failure({ message: "프로필을 찾을 수 없습니다." });
      }
      return success({ message: "프로필이 삭제되었습니다." });
    } catch (error) {
      console.error("프로필 삭제 실패:", error);
      return failure({ message: "프로필 삭제에 실패했습니다." });
    }
  }

  // 테스트용 더미 데이터 생성 엔드포인트
  @Post("dummy-data")
  async createDummyData() {
    try {
      await this.fingerprintService.createDummyData();
      return success({ message: "더미 데이터가 생성되었습니다." });
    } catch (error) {
      console.error("더미 데이터 생성 실패:", error);
      return failure({ message: "더미 데이터 생성에 실패했습니다." });
    }
  }
}
