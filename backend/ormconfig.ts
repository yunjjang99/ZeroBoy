import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSourceOptions } from "typeorm";
import { join } from "path";
import { User } from "./src/user/entities/user.entity"; // 필요한 모든 엔티티 import
import { BrowserFingerprint } from "@/fingerprint/entities/browser-fingerprint.entity";

// SQLite 전용 설정 - 일렉트론 환경 고려
const isElectron =
  process.env.ELECTRON_IS_DEV === "true" || (process as any).resourcesPath;
const isDev = process.env.NODE_ENV === "development";

let databasePath: string;

if (isElectron) {
  // Electron 환경 (프로덕션)
  if (isDev) {
    // 개발 모드에서 Electron 실행
    databasePath = join(__dirname, "..", "data", "db", "db.sqlite");
  } else {
    // 프로덕션 빌드된 Electron 앱
    databasePath = join(
      (process as any).resourcesPath,
      "data",
      "db",
      "db.sqlite"
    );
  }
} else {
  // 일반 Node.js 환경 (개발 서버)
  databasePath = join(__dirname, "..", "data", "db", "db.sqlite");
}

const commonTypeOrmConfig: TypeOrmModuleOptions & DataSourceOptions = {
  type: "sqlite",
  database: databasePath,
  // entities: [User, BrowserFingerprint], // 또는 [__dirname + '/src/**/*.entity{.ts,.js}']
  entities: [__dirname + "/**/*.entity.{ts,js}"],
  migrations: [join(__dirname, "src/migrations/*.ts")],
  synchronize: true, // 개발 시 true (배포 시 false + migration 사용)
  logging: false,
};

console.log("SQLite DB Path:", databasePath);
console.log("Environment Info:", {
  isElectron,
  isDev,
  resourcesPath: (process as any).resourcesPath,
  NODE_ENV: process.env.NODE_ENV,
  ELECTRON_IS_DEV: process.env.ELECTRON_IS_DEV,
});

export const typeOrmConfig = {
  ...commonTypeOrmConfig,
};

export const dataSourceConfig: DataSourceOptions = {
  ...commonTypeOrmConfig,
  synchronize: false, // 마이그레이션 실행 시엔 항상 false
};
