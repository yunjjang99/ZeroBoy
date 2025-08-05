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

  @Column({ default: "unknown" })
  siteUrl: string;

  @Column("simple-json", { nullable: true })
  cookies?: any[];

  @Column("text", { nullable: true })
  localStorage?: string;

  @Column("text", { nullable: true })
  sessionStorage?: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  lastActiveAt?: Date;

  @Column({ nullable: true })
  browserProcessId?: string;

  @CreateDateColumn()
  createdAt: Date;
}
