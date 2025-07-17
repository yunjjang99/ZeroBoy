import { Entity, PrimaryColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class BrowserFingerprint {
  @PrimaryColumn()
  uuid: string;

  @Column()
  userAgent: string;

  @Column()
  language: string;

  @Column("simple-array")
  languages: string[];

  @Column()
  timezone: string;

  @Column()
  platform: string;

  @Column()
  hardwareConcurrency: number;

  @Column()
  colorDepth: number;

  @Column("json")
  screenResolution: { width: number; height: number };

  @Column()
  gpuVendor: string;

  @Column()
  gpuModel: string;

  @Column()
  webdriver: boolean;

  @Column("decimal", { precision: 10, scale: 6 })
  latitude: number;

  @Column("decimal", { precision: 10, scale: 6 })
  longitude: number;

  @Column()
  publicIp: string;

  @CreateDateColumn()
  createdAt: Date;
}
