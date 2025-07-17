import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSourceOptions } from "typeorm";
import { join } from "path";
import { User } from "./src/user/entities/user.entity"; // 필요한 모든 엔티티 import
import { BrowserFingerprint } from "@/fingerprint/entities/browser-fingerprint.entity";

// SQLite 전용 설정
const databasePath = join(__dirname, "data", "db.sqlite");

const commonTypeOrmConfig: TypeOrmModuleOptions & DataSourceOptions = {
  type: "sqlite",
  database: databasePath,
  // entities: [User, BrowserFingerprint], // 또는 [__dirname + '/src/**/*.entity{.ts,.js}']
  entities: [__dirname + "/**/*.entity.{ts,js}"],
  migrations: [join(__dirname, "src/migrations/*.ts")],
  synchronize: true, // 개발 시 true (배포 시 false + migration 사용)
  logging: true,
};

console.log("SQLite DB Path:", join(__dirname, "data", "db.sqlite"));

export const typeOrmConfig = {
  ...commonTypeOrmConfig,
};

export const dataSourceConfig: DataSourceOptions = {
  ...commonTypeOrmConfig,
  synchronize: false, // 마이그레이션 실행 시엔 항상 false
};
