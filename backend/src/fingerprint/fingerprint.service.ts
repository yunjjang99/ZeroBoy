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
    fingerprint: Partial<BrowserFingerprint>
  ): Promise<string> {
    const uuid = uuidv4();
    const record = this.fingerprintRepo.create({ uuid, ...fingerprint });
    await this.fingerprintRepo.save(record);
    return uuid;
  }

  async getFingerprint(uuid: string): Promise<BrowserFingerprint | null> {
    return this.fingerprintRepo.findOneBy({ uuid });
  }
}
