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
    siteUrl: string
  ): Promise<string> {
    const uuid = uuidv4();
    const record = this.fingerprintRepo.create({
      uuid,
      ...fingerprint,
      siteUrl,
    });
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
}
