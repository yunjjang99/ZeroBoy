import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BrowserFingerprint } from "./entities/browser-fingerprint.entity";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class FingerprintService {
  constructor(
    @InjectRepository(BrowserFingerprint)
    private readonly fingerprintRepo: Repository<BrowserFingerprint>
  ) {}

  async saveFingerprint(
    fingerprint: Partial<BrowserFingerprint>,
    siteUrl: string,
    accountInfo?: { accountId: string; memo: string },
    exchange?: string
  ): Promise<string> {
    const uuid = uuidv4();
    
    // 디버깅: accountInfo 로그
    console.log('🔍 saveFingerprint - accountInfo:', JSON.stringify(accountInfo, null, 2));
    console.log('🔍 saveFingerprint - exchange:', exchange);
    
    const record = this.fingerprintRepo.create({
      uuid,
      ...fingerprint,
      siteUrl,
      accountInfo,
      exchange,
    });
    
    console.log('🔍 saveFingerprint - record.accountInfo:', JSON.stringify(record.accountInfo, null, 2));
    
    await this.fingerprintRepo.save(record);
    return uuid;
  }

  async getFingerprint(uuid: string): Promise<BrowserFingerprint | null> {
    return this.fingerprintRepo.findOneBy({ uuid });
  }

  async updateSession(
    uuid: string,
    session: {
      cookies: any[];
      localStorage: string;
      sessionStorage: string;
    }
  ): Promise<void> {
    await this.fingerprintRepo.update(
      { uuid },
      {
        cookies: session.cookies,
        localStorage: session.localStorage,
        sessionStorage: session.sessionStorage,
      }
    );
  }

  async getAllFingerprints(): Promise<BrowserFingerprint[]> {
    return this.fingerprintRepo.find({
      order: {
        createdAt: "DESC",
      },
    });
  }

  async deleteFingerprint(uuid: string): Promise<boolean> {
    const result = await this.fingerprintRepo.delete({ uuid });
    return result.affected ? result.affected > 0 : false;
  }

  async updateBrowserStatus(
    uuid: string,
    status: {
      isActive: boolean;
      lastActiveAt: Date;
      browserProcessId?: string | null;
    }
  ): Promise<void> {
    await this.fingerprintRepo.update(
      { uuid },
      {
        isActive: status.isActive,
        lastActiveAt: status.lastActiveAt,
        browserProcessId: status.browserProcessId,
      }
    );
  }

  // 테스트용 더미 데이터 생성
  async createDummyData(): Promise<void> {
    const existingCount = await this.fingerprintRepo.count();
    if (existingCount > 0) {
      console.log("이미 데이터가 존재합니다.");
      return;
    }

    const dummyProfiles = [
      {
        uuid: "1",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        language: "ko-KR",
        languages: ["ko-KR", "ko", "en-US", "en"],
        timezone: "Asia/Seoul",
        platform: "Win32",
        hardwareConcurrency: 8,
        colorDepth: 24,
        screenResolution: { width: 1920, height: 1080 },
        gpuVendor: "Intel Inc.",
        gpuModel: "Intel(R) UHD Graphics 620",
        webdriver: false,
        latitude: 37.5665,
        longitude: 126.978,
        publicIp: "203.241.xxx.xxx",
        siteUrl: "https://example.com",
        createdAt: new Date("2024-01-15"),
        cookies: [],
        localStorage: "",
        sessionStorage: "",
      },
      {
        uuid: "2",
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        language: "en-US",
        languages: ["en-US", "en"],
        timezone: "America/New_York",
        platform: "MacIntel",
        hardwareConcurrency: 12,
        colorDepth: 30,
        screenResolution: { width: 2560, height: 1600 },
        gpuVendor: "Apple Inc.",
        gpuModel: "Apple M1 Pro",
        webdriver: false,
        latitude: 40.7128,
        longitude: -74.006,
        publicIp: "192.168.xxx.xxx",
        siteUrl: "https://test.com",
        createdAt: new Date("2024-01-10"),
        cookies: [],
        localStorage: "",
        sessionStorage: "",
      },
      {
        uuid: "3",
        userAgent:
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        language: "en-US",
        languages: ["en-US", "en"],
        timezone: "Europe/London",
        platform: "Linux x86_64",
        hardwareConcurrency: 16,
        colorDepth: 24,
        screenResolution: { width: 1920, height: 1200 },
        gpuVendor: "NVIDIA Corporation",
        gpuModel: "GeForce RTX 3080",
        webdriver: false,
        latitude: 51.5074,
        longitude: -0.1278,
        publicIp: "185.xxx.xxx.xxx",
        siteUrl: "https://github.com",
        createdAt: new Date("2024-01-20"),
        cookies: [],
        localStorage: "",
        sessionStorage: "",
      },
    ];

    for (const profile of dummyProfiles) {
      await this.fingerprintRepo.save(profile);
    }

    console.log("더미 데이터가 생성되었습니다.");
  }
}
