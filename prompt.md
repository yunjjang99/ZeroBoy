Directory structure:
└── yunjjang99-zeroboy/
├── README.md
└── backend/
├── README.md
├── nest-cli.json
├── ormconfig.ts
├── package.json
├── tsconfig.build.json
├── tsconfig.json
├── typeorm.config.ts
├── src/
│ ├── app.logger.ts
│ ├── app.module.ts
│ ├── app.service.ts
│ ├── main.ts
│ ├── auth/
│ │ ├── auth.controller.ts
│ │ ├── auth.module.ts
│ │ ├── auth.service.ts
│ │ ├── jwt-auth.guard.ts
│ │ └── jwt.strategy.ts
│ ├── common/
│ │ ├── guard/
│ │ │ ├── ip-whitelist.guard.ts
│ │ │ └── role.guard.ts
│ │ ├── interceptor/
│ │ │ ├── logging.interceptor.ts
│ │ │ └── response.interceprot.ts
│ │ ├── middleware/
│ │ │ ├── ip-geolocation.middleware.ts
│ │ │ └── logger.middleware.ts
│ │ └── redis/
│ │ ├── redis.client.ts
│ │ ├── redis.config.ts
│ │ ├── redis.lock.ts
│ │ ├── redis.module.ts
│ │ └── redis.service.ts
│ ├── enums/
│ │ └── enum.ts
│ ├── fingerprint/
│ │ ├── fingerprint.module.ts
│ │ ├── fingerprint.service.ts
│ │ └── entities/
│ │ └── browser-fingerprint.entity.ts
│ ├── formatters/
│ │ ├── ASCENDEX/
│ │ │ ├── ascendex-order.fomatter.ts
│ │ │ ├── ascendex-orderbook.ts
│ │ │ ├── ascendex-ticker.fomatter.ts
│ │ │ └── ascendex-trade.formatter.ts
│ │ ├── BITMART/
│ │ │ ├── bitmart-order.fomater.ts
│ │ │ ├── bitmart-orderbook.formatter.ts
│ │ │ ├── bitmart-ticker.formmater.ts
│ │ │ └── bitmart-trade.formatter.ts
│ │ ├── BLOFIN/
│ │ │ ├── blofin-order.formatter.ts
│ │ │ ├── blofin-orderbook.formatter.ts
│ │ │ ├── blofin-ticker.formatter.ts
│ │ │ └── blofin-trade.formatter.ts
│ │ ├── LBANK/
│ │ │ ├── lbank-order.fommater.ts
│ │ │ ├── lbank-orderbook.formatter.ts
│ │ │ ├── lbank-ticker.formatter.ts
│ │ │ └── lbank-trade.formatter.ts
│ │ └── XT/
│ │ ├── xt-orderbook.formatter.ts
│ │ └── xt-ticker.formatter.ts
│ ├── interface/
│ │ ├── elementParse.interface.ts
│ │ ├── enum.ts
│ │ ├── formatter.interface.ts
│ │ └── messege.ts
│ ├── puppeteer/
│ │ ├── puppeteer.controller.ts
│ │ ├── puppeteer.gateway.ts
│ │ ├── puppeteer.module.ts
│ │ ├── puppeteer.service.spec.ts
│ │ ├── puppeteer.service.ts
│ │ ├── exchange/
│ │ │ ├── bitmart.ts
│ │ │ └── lbank.ts
│ │ └── interfaces/
│ │ └── browser-factory.interface.ts
│ ├── types/
│ │ ├── enumList.ts
│ │ └── response.interface.ts
│ ├── user/
│ │ ├── user.controller.spec.ts
│ │ ├── user.controller.ts
│ │ ├── user.module.ts
│ │ ├── user.service.spec.ts
│ │ ├── user.service.ts
│ │ ├── domain/
│ │ │ └── userDomain.dummy.ts
│ │ ├── dto/
│ │ │ ├── create-user.dto.ts
│ │ │ └── update-user.dto.ts
│ │ └── entities/
│ │ └── user.entity.ts
│ └── utils/
│ ├── cryptoUtil.ts
│ ├── dateUtil.ts
│ ├── deepClone.ts
│ ├── errorUtil.ts
│ ├── fileUtil.ts
│ ├── fingerprintGenerator.ts
│ ├── functionalUtil.ts
│ ├── httpUtil.ts
│ ├── logUtil.ts
│ └── objectUtil.ts
└── test/
├── app.e2e-spec.ts
└── jest-e2e.json

Files Content:

================================================
FILE: README.md
================================================
🦾 ZeroBoy

ZeroBoy is a desktop application designed for automated cryptocurrency futures trading, focused on arbitrage opportunities and bidirectional hedging strategies.
It includes built-in mechanisms to bypass centralized exchange bot detection through advanced browser fingerprint spoofing and Cloudflare bot challenge evasion.

⸻

🧠 Overview

ZeroBoy enables safe and stealthy execution of automated trading strategies on centralized exchanges (CEXs).
It combines market-neutral techniques like hedging with deep system-level tactics to evade anti-bot systems and ensure maximum operational freedom.

⸻

🚀 Key Features
• ✅ Automated Crypto Futures Trading
• Supports long/short entries with pre-configured risk/return logic
• Automatically manages entry/exit timing and profit targets
• 🔁 Bidirectional Hedging Engine
• Simultaneous long & short positions for neutral exposure
• Designed to minimize risk in volatile markets
• 🛡 Browser Fingerprint Spoofing
• Randomized spoofing of user agent, GPU model, WebGL, Canvas, timezone, and more
• Thousands of unique identity combinations generated dynamically
• 🌐 Cloudflare and Bot Protection Bypass
• Uses Puppeteer with Stealth plugins to pass anti-bot challenges
• Simulates real user behavior and browser characteristics
• 💾 Lightweight Local Database
• SQLite-based storage for fast, embedded data handling
• Stores browser sessions, trade history, and fingerprint metadata
• 🖥 Cross-Platform Desktop App
• Built with React + Electron
• Windows and macOS packaging planned

⸻

🧱 Tech Stack

Layer Technology
Backend NestJS
Frontend React, Electron
Automation Puppeteer, Stealth
Database SQLite (local embedded DB)

⸻

🛠 Architecture

┌────────────┐ ┌────────────┐
│ Electron │◀────▶│ React GUI │
└────────────┘ └────────────┘
▲ ▲
│ │
┌────────────┐ ┌───────────────┐
│ Puppeteer │◀────▶│ NestJS Backend │
└────────────┘ └───────────────┘
▼
┌────────────┐
│ SQLite DB │
└────────────┘

⸻

🔒 Security & Stealth Mechanisms
• UUID-based browser session identity for reliable state management
• Seamless session persistence (cookies, localStorage, sessionStorage)
• Multi-layered fingerprint spoofing: randomized at launch
• Simulates Korean user environments (geolocation, language, timezone, etc.)
• Supports IP/region masking for advanced stealth

⸻

📦 Distribution

ZeroBoy is distributed as a standalone desktop application:
• ✅ Electron-based packaging
• ✅ Windows .exe and macOS .dmg supported
• 🔄 Auto-updater functionality planned

⸻

📌 Roadmap
• Telegram/Discord notification integration
• Multi-exchange arbitrage (Binance, Bybit, etc.)
• Distributed proxy routing support
• Real-time funding fee arbitrage logic
• Dark mode and enhanced UI

================================================
FILE: backend/README.md
================================================

# 프로젝트 구조 및 코딩 가이드라인

이 문서는 우리의 NestJS 애플리케이션을 위한 표준화된 프로젝트 구조와 코딩 원칙을 설명합니다. 이러한 지침을 준수함으로써 우리는 일관성을 유지하고, 가독성을 높이며, 코드베이스의 유지보수성을 향상시키는 것을 목표로 합니다.

## 디렉터리 구조

우리의 프로젝트는 각 모듈이 자신의 도메인 로직을 캡슐화하는 모듈화된 구조를 따릅니다. 아래는 `user` 모듈의 디렉터리 구조입니다:

```
src/
├── user/
│   ├── dto/
│   ├── entities/
│   ├── domain/
│   │   ├── parser/
│   │   │   ├── persnal.parser.ts
│   │   │   └── resumeFile.parser.ts
│   │   ├── math/
│   │   │   └── complex_calculation.math.ts
│   │   └── utils/
│   │       └── helper.ts
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.module.ts
```

### 디렉터리 설명

- **dto/**: 데이터 전송 객체를 포함하며, 데이터 형태를 정의하고 입력을 검증하는 데 사용됩니다.

- **domain/**: 모듈의 핵심 비즈니스 로직에 필요한코드를 작성하는 레이어입니다, 클래스별로 하위 폴더에 정리되어 있습니다

  - **parser/**: `persnal.parser.ts`와 `resumeFile.parser.ts`와 같은 파싱 작업을 담당하는 클래스를 포함합니다.

  - **math/**: `complex_calculation.math.ts`와 같은 복잡한 수학적 계산을 위한 클래스를 포함합니다.

  - **utils/**: `user` 모듈에 특화된 유틸리티 함수와 헬퍼 클래스를 포함합니다.

- **user.controller.ts**: 들어오는 HTTP 요청을 처리하고 응답을 전송하며, API 라우팅과 데이터 전송에만 집중합니다.

- **user.service.ts**: 비즈니스 로직 절차를 관리하며, `domain` 레이어의 클래스를 활용하여 작업을 조율합니다.

- **user.module.ts**: NestJS 모듈 시스템을 위해 컨트롤러, 서비스 및 기타 제공자들을 결합하는 모듈 파일입니다.

## 코딩 원칙

### 함수형 프로그래밍 패러다임

우리는 함수형 프로그래밍 원칙을 활용하여 깨끗하고 유지보수 가능하며 테스트 가능한 코드를 작성합니다. 여기에는 다음이 포함됩니다:

- **순수 함수**: 동일한 입력에 대해 항상 동일한 출력을 반환하며, 부작용이 없는 함수.

- **불변성**: 예기치 않은 부작용을 방지하기 위해 데이터 구조를 변경하지 않음.

- **함수 조합**: `pipe`와 같은 고차 함수를 사용하여 단순하고 재사용 가능한 함수들로 복잡한 작업을 구성.

### 복잡한 비즈니스 로직의 캡슐화

- **domain 레이어 조직**: 복잡한 비즈니스 로직은 `domain` 레이어 안에서 의미 있는 하위 디렉터리(`parser`, `math`, `utils` ,`각 도메인에 맞는 구성요소들` ...등등)로 나뉘어 캡슐화됩니다.

- **서비스 레이어 단순화**: 복잡한 로직을 `domain` 레이어로 오프로드하여 서비스 레이어는 비즈니스 프로세스에 집중하게 됩니다.

### 컨트롤러와 서비스의 역할 분리

- **컨트롤러**: API 요청과 응답을 처리하며, 비즈니스 로직을 포함하지 않습니다.

- **서비스**: 비즈니스 로직 절차에 집중하고, `domain` 레이어의 메서드를 활용하여 작업을 수행합니다.

## 개발 가이드라인

### 새로운 로직 추가

- **domain 레이어**: 새로운 복잡한 비즈니스 로직 클래스는 `domain/` 내의 적절한 하위 디렉터리에 추가하십시오. 예를 들어, 새로운 파싱 로직을 추가하려면 `domain/parser/`에 새 파일을 생성하십시오.

- **서비스 레이어**: `domain` 레이어의 클래스와 함수를 사용하여 비즈니스 절차를 구축하고, 다른 서비스들과의 의존성을 나타내는것에 집중합니다. 서비스 메서드는 최대한 간결하고 집중적이어야 합니다.

- **컨트롤러 레이어**: 컨트롤러는 요청 및 응답 처리에만 집중하고, 모든 처리는 서비스 레이어에 위임하십시오.

### 코딩 표준

- **명명 규칙**: 파일, 클래스, 함수에 대해 목적을 반영하는 명확하고 설명적인 이름을 사용하고 개발자들간에 공통적으로 지켜지는 코드 컨벤션을 따르도록 합니다 -파일명 케밥케이스로 구분 -클래스명 파스칼 케이스로 구분
  -DB테이블,컬럼명 스네이크케이스로 구분

- **함수의 순수성**: 특히 `domain` 레이어에서 순수 함수를 작성하려고 노력하세요.

- **불변성**: 입력 매개변수를 변경하지 않고, 대신 새로운 인스턴스나 데이터 구조를 반환하세요.

- **에러 처리**: 에러반환들은 domain에서의 순수함수들의 Either/Result 반환 패턴으로 통일합니다.

## 예시 구현

### 서비스 레이어 (`user.service.ts`)

```typescript
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { parsnalParser } from "./domain/user/parsnal.parser";

@Injectable()
export class UserService {
  constructor(private readonly parsnalParser: ParsnalParser) {}

  async create(file: Express.Multer.File) {
    try {
      const parsedText = await parsePdfToText(file.buffer);
      const userInfo = this.parsnalParser.extractUser(parsedText);
      //  모나드를 이용한 에러처리 로직
      // 추가적인 비즈니스 로직 (예: 데이터베이스에 데이터 저장)
      return userInfo;
    } catch (error) {
      throw new InternalServerErrorException(`PDF 파싱 실패: ${error.message}`);
    }
  }

  // 기타 비즈니스 절차에 집중한 서비스 메서드들...
}
```

### 서비스 레이어에서 활용될 도메인 레이어 (`/user/domain/parser/resume.parser.ts`)

```typescript
import { pipe } from "../../../utils/functionalUtil";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ResumeParser {
  extractResume = (text: string) => {
    const result = pipe(
      this.extractSelfIntroduction,
      this.extractAddress,
      this.extractPhoneNumber,
      this.extractAge,
      this.extractUniversity
    )(text);

    return {
      score: result.score,
      priority: result.priority,
      interviewDate: result.interviewDate,
    };
  };

  private extractSelfIntroduction = (text: string) => {
    // 순수 함수 구현...
  };

  private extractAddress = (text: string) => {
    // 순수 함수 구현...
  };

  // 기타 추출 함수들...
}
```

================================================
FILE: backend/nest-cli.json
================================================
{
"$schema": "https://json.schemastore.org/nest-cli",
"collection": "@nestjs/schematics",
"sourceRoot": "src",
"compilerOptions": {

    "deleteOutDir": true

}
}

================================================
FILE: backend/ormconfig.ts
================================================
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSourceOptions } from "typeorm";
import { join } from "path";
import { User } from "./src/user/entities/user.entity"; // 필요한 모든 엔티티 import
import { BrowserFingerprint } from "@/fingerprint/entities/browser-fingerprint.entity";

// SQLite 전용 설정
const databasePath = join(\_\_dirname, "data", "db.sqlite");

const commonTypeOrmConfig: TypeOrmModuleOptions & DataSourceOptions = {
type: "sqlite",
database: databasePath,
// entities: [User, BrowserFingerprint], // 또는 [__dirname + '/src/**/*.entity{.ts,.js}']
entities: [__dirname + "/**/*.entity.{ts,js}"],
migrations: [join(__dirname, "src/migrations/*.ts")],
synchronize: true, // 개발 시 true (배포 시 false + migration 사용)
logging: false,
};

console.log("SQLite DB Path:", join(\_\_dirname, "data", "db.sqlite"));

export const typeOrmConfig = {
...commonTypeOrmConfig,
};

export const dataSourceConfig: DataSourceOptions = {
...commonTypeOrmConfig,
synchronize: false, // 마이그레이션 실행 시엔 항상 false
};

================================================
FILE: backend/package.json
================================================
{
"name": "project-name",
"version": "0.0.1",
"description": "",
"author": "",
"private": true,
"license": "UNLICENSED",
"scripts": {
"check-node-version": "node -e \"const version = process.versions.node.split('.'); const [major, minor, patch] = version.map(v => parseInt(v, 10)); if (major !== 20 || minor !== 16 || patch !== 0) { console.error(`Required Node.js version is 20.16.0, but found ${process.versions.node}`); process.exit(1); }\"",
"prebuild": "npm run check-node-version",
"prestart": "npm run check-node-version",
"prestart:dev": "npm run check-node-version",
"prestart:debug": "npm run check-node-version",
"prestart:prod": "npm run check-node-version",
"pretest": "npm run check-node-version",
"pretest:watch": "npm run check-node-version",
"pretest:debug": "npm run check-node-version",
"pretest:e2e": "npm run check-node-version",
"build": "nest build",
"format": "prettier --write \"src/**/\*.ts\" \"test/**/_.ts\"",
"start": "nest start",
"start:dev": "nest start --watch",
"start:debug": "nest start --debug --watch",
"start:prod": "node dist/main",
"lint": "eslint \"{src,apps,libs,test}/\*\*/_.ts\" --fix",
"test": "jest",
"test:watch": "jest --watch",
"test:cov": "jest --coverage",
"test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node*modules/.bin/jest --runInBand",
"test:e2e": "jest --config ./test/jest-e2e.json",
"typeorm": "node --require ts-node/register ./node_modules/typeorm/cli.js",
"db:run": "npm run typeorm migration:run -- -d ./typeorm.config.ts",
"db:revert": "npm run typeorm -- -d ./typeorm.config.ts migration:revert",
"db:create": "npm run typeorm -- migration:create ./src/migrations/$npm_config_name",
    "db:generate": "npm run typeorm -- migration:generate ./src/migrations/migrations/$npm_config_name -d ./typeorm.config.ts",
"db:generate:window": "npm run typeorm -- migration:generate ./src/migrations/$npm_config_name -d ./typeorm.config.ts",
    "db:generate:docker": "npm run typeorm -- migration:generate /app/dist/src/migrations/migrations/$npm_config_name -d /app/dist/typeorm.config.js",
"db:run:docker": "npm run typeorm migration:run -- -d /app/dist/typeorm.config.js"
},
"dependencies": {
"@nestjs/common": "^10.0.0",
"@nestjs/config": "^3.2.3",
"@nestjs/core": "^10.0.0",
"@nestjs/jwt": "^10.2.0",
"@nestjs/mapped-types": "^2.0.5",
"@nestjs/passport": "^10.0.3",
"@nestjs/platform-express": "^10.4.4",
"@nestjs/platform-socket.io": "^10.4.20",
"@nestjs/typeorm": "^10.0.2",
"@nestjs/websockets": "^10.4.20",
"axios": "^1.7.7",
"bcryptjs": "^2.4.3",
"class-validator": "^0.14.1",
"cookie-parser": "^1.4.7",
"date-fns": "^4.1.0",
"geoip-lite": "^1.4.10",
"ioredis": "^5.4.1",
"mysql2": "^3.11.0",
"passport": "^0.7.0",
"passport-jwt": "^4.0.1",
"puppeteer-core": "^24.11.1",
"puppeteer-extra-plugin-stealth": "^2.11.2",
"puppeteer-real-browser": "^1.4.2",
"redlock": "^5.0.0-beta.2",
"socket.io": "^4.8.1",
"sqlite3": "^5.1.7",
"typeorm": "^0.3.20",
"websockets": "^0.2.0",
"winston": "^3.15.0",
"winston-daily-rotate-file": "^5.0.0",
"winston-logstash-transport": "^2.0.0"
},
"devDependencies": {
"@nestjs/cli": "^10.0.0",
"@nestjs/schematics": "^10.0.0",
"@nestjs/testing": "^10.0.0",
"@types/bcryptjs": "^2.4.6",
"@types/express": "^4.17.21",
"@types/jest": "^29.5.2",
"@types/multer": "^1.4.12",
"@types/node": "^20.3.1",
"@types/passport-jwt": "^4.0.1",
"@types/supertest": "^6.0.0",
"@typescript-eslint/eslint-plugin": "^8.0.0",
"@typescript-eslint/parser": "^8.0.0",
"eslint": "^8.42.0",
"eslint-config-prettier": "^9.0.0",
"eslint-plugin-prettier": "^5.0.0",
"jest": "^29.5.0",
"prettier": "^3.0.0",
"source-map-support": "^0.5.21",
"supertest": "^7.0.0",
"ts-jest": "^29.1.0",
"ts-loader": "^9.4.3",
"ts-node": "^10.9.2",
"tsconfig-paths": "^4.2.0",
"typescript": "^5.1.3"
},
"jest": {
"moduleFileExtensions": [
"js",
"json",
"ts"
],
"rootDir": "src",
"testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
},
"collectCoverageFrom": [
"\*\*/_.(t|j)s"
],
"coverageDirectory": "../coverage",
"testEnvironment": "node"
}
}

================================================
FILE: backend/tsconfig.build.json
================================================
{
"extends": "./tsconfig.json",
"compilerOptions": {
"baseUrl": "./",
"paths": {
"@/_": ["src/_"]
}
},
"exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}

================================================
FILE: backend/tsconfig.json
================================================
{
"compilerOptions": {
"module": "commonjs",
"declaration": true,
"removeComments": true,
"emitDecoratorMetadata": true,
"experimentalDecorators": true,
"allowSyntheticDefaultImports": true,
"target": "ES2021",
"sourceMap": true,
"outDir": "./dist",
"baseUrl": "./",
"paths": {
"@/_": ["src/_"]
},
"incremental": true,
"skipLibCheck": true,
"strictNullChecks": false,
"noImplicitAny": false,
"moduleResolution": "node",
"strictBindCallApply": false,
"forceConsistentCasingInFileNames": false,
"noFallthroughCasesInSwitch": false
}
}

================================================
FILE: backend/typeorm.config.ts
================================================
import { DataSource } from "typeorm";
import { dataSourceConfig } from "./ormconfig";

export const AppDataSource = new DataSource(dataSourceConfig);

================================================
FILE: backend/src/app.logger.ts
================================================
import { Injectable, LoggerService } from "@nestjs/common";
import { logger } from "@/utils/logUtil"; // logger.ts 파일에서 올바르게 import

@Injectable()
export class AppLogger implements LoggerService {
log(message: string) {
logger.info(message); // 올바르게 logger 객체 사용
}

error(message: string, trace?: string) {
logger.error(message, { trace }); // 에러 로그 처리
}

warn(message: string) {
logger.warn(message); // 경고 로그 처리
}

debug?(message: string) {
logger.debug(message); // 디버그 로그 처리
}

verbose?(message: string) {
logger.verbose(message); // 상세 로그 처리
}
}

================================================
FILE: backend/src/app.module.ts
================================================
import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { User } from "@/user/entities/user.entity";
import { AuthModule } from "./auth/auth.module";
import { typeOrmConfig } from "ormconfig";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { IpGeolocationMiddleware } from "./common/middleware/ip-geolocation.middleware"; // IP 미들웨어 추가
import { AppLogger } from "./app.logger";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "./common/interceptor/logging.interceptor";
import { PuppeteerModule } from "./puppeteer/puppeteer.module";
import { FingerprintModule } from "./fingerprint/fingerprint.module";

@Module({
imports: [
ConfigModule.forRoot({
isGlobal: true,
}),
TypeOrmModule.forRoot(typeOrmConfig),
AuthModule,
UserModule,
PuppeteerModule,
FingerprintModule,
],
providers: [
AppLogger,
{
provide: APP_INTERCEPTOR,
useClass: LoggingInterceptor,
},
// 기타 프로바이더
],
})
export class AppModule implements NestModule {
configure(consumer: MiddlewareConsumer) {
consumer
// .apply(LoggerMiddleware) // 로깅 미들웨어 적용 ELK 미들웨어입니다
// .forRoutes("_") // 모든 라우트에 대해 적용
.apply(IpGeolocationMiddleware) // 한국에서만 접근 허용 미들웨어 적용
.forRoutes("_"); // 모든 라우트에 대해 적용
}
}

================================================
FILE: backend/src/app.service.ts
================================================
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
getHello(): string {
return "Hello World!";
}
}

================================================
FILE: backend/src/main.ts
================================================
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import _ as cookieParser from "cookie-parser";
import _ as dotenv from "dotenv";
import { ExpressAdapter } from "@nestjs/platform-express";
import \* as express from "express";
import { INestApplication } from "@nestjs/common";
import { AppLogger } from "./app.logger";
import { ResponseInterceptor } from "./common/interceptor/response.interceprot";
async function bootstrap() {
dotenv.config();

const server = express();
const app = (await NestFactory.create(AppModule, new ExpressAdapter(server), {
logger: new AppLogger(), // Winston 커스텀 로거 적용
})) as INestApplication & express.Application;
app.use(cookieParser());
app.enableCors();
app.set("trust proxy", 1);
app.useGlobalInterceptors(new ResponseInterceptor());

await app.listen(process.env.BACKEND_PORT);
}

bootstrap();

================================================
FILE: backend/src/auth/auth.controller.ts
================================================
import { Controller, Post, Body, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";

@Controller("auth")
export class AuthController {
constructor(private readonly authService: AuthService) {}

@Post("login")
async login(
@Body("email") email: string,
@Body("password") password: string,
@Res({ passthrough: true }) res: Response // 쿠키 설정을 위해 Response 객체 주입
) {
const user = await this.authService.validateUser(email, password);
const { accessToken } = await this.authService.login(user);

    // 쿠키에 JWT 토큰 설정 (httpOnly, secure 옵션 추가)
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // 클라이언트가 JS로 쿠키에 접근하지 못하게 함 (XSS 보호)
      secure: process.env.NODE_ENV === "production", // HTTPS에서만 전송 (프로덕션 환경에서만 적용)
      maxAge: 3600 * 1000, // 1시간
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // CSRF 보호를 위한 sameSite 설정
    });

    return { message: "Login successful" };

}
}

================================================
FILE: backend/src/auth/auth.module.ts
================================================
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";

@Module({
imports: [
UserModule,
PassportModule,
JwtModule.register({
secret: process.env.JWT_SECRET, // JWT secret
signOptions: { expiresIn: "1h" }, // 토큰 만료 시간
}),
],
providers: [AuthService, JwtStrategy],
controllers: [AuthController],
exports: [AuthService],
})
export class AuthModule {}

================================================
FILE: backend/src/auth/auth.service.ts
================================================
[Binary file]

================================================
FILE: backend/src/auth/jwt-auth.guard.ts
================================================
import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}

================================================
FILE: backend/src/auth/jwt.strategy.ts
================================================
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
constructor(private readonly authService: AuthService) {
super({
jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
ignoreExpiration: false,
secretOrKey: process.env.JWT_SECRET,
});
}

async validate(payload: any) {
return { userId: payload.sub, email: payload.email };
}
}

================================================
FILE: backend/src/common/guard/ip-whitelist.guard.ts
================================================
import {
Injectable,
CanActivate,
ExecutionContext,
ForbiddenException,
} from "@nestjs/common";
import { Request } from "express";
import { getClientIp } from "@/utils/httpUtil"; // 유틸리티 함수 import

@Injectable()
export class IpWhitelistGuard implements CanActivate {
// 허용된 IP 목록 (여러 개 설정 가능)
private readonly allowedIPs: string[] = [
"127.0.0.1", // 로컬
"::1", // ip6 로컬
];

canActivate(context: ExecutionContext): boolean {
const request: Request = context.switchToHttp().getRequest();
const requestIP = getClientIp(request); // 유틸리티 함수 사용

    if (!this.isAllowedIP(requestIP)) {
      // throw new ForbiddenException("허용되지 않은 IP에서의 요청입니다.");  // TODO : 운영버전에서 활성화하기
    }

    return true;

}

// IP가 허용 목록에 있는지 확인하는 메소드
private isAllowedIP(requestIP: string): boolean {
return this.allowedIPs.includes(requestIP);
}
}

================================================
FILE: backend/src/common/guard/role.guard.ts
================================================
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import \* as jwt from "jsonwebtoken";
import { UserService } from "src/user/user.service";
import { UserRole } from "@/types/enumList"; // user_group enum import
import { failure, success } from "@/utils/functionalUtil"; // success, failure import

const dotenv = require("dotenv");
dotenv.config();

@Injectable()
export class RolesGuard implements CanActivate {
constructor(
private reflector: Reflector,
private userService: UserService
) {}

async canActivate(context: ExecutionContext): Promise<boolean> {
// 컨트롤러에서 설정된 역할들 (roles 데코레이터를 통해 설정)
const roles = this.reflector.get<string[]>("roles", context.getHandler());

    if (!roles || roles.length === 0) {
      // 역할이 설정되지 않은 경우, 기본적으로 통과시킴
      return true;
    }

    const request = context.switchToHttp().getRequest();

    try {
      // 쿠키에서 JWT 토큰 추출
      const token = request.cookies?.accessToken;
      if (!token) {
        // 토큰이 없는 경우 false 반환
        return false;
      }

      // JWT 토큰 검증 및 디코딩
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        sub: string;
        role: string;
      };
      const userId = Number(decoded.sub);

      // DB에서 사용자 정보 조회
      const member = await this.userService.findUserById(userId);
      const memberRole = member.role as keyof typeof UserRole;

      // 사용자의 역할이 요청에 필요한 역할 중 하나와 일치하는지 확인
      if (roles.includes(memberRole)) {
        return true;
      }

      // 필요한 역할 중 일치하는 것이 없는 경우
      return false;
    } catch (err) {
      // JWT가 유효하지 않은 경우 false 반환
      return false;
    }

}
}

================================================
FILE: backend/src/common/interceptor/logging.interceptor.ts
================================================
import {
Injectable,
NestInterceptor,
ExecutionContext,
CallHandler,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AppLogger } from "@/app.logger";
import { HttpException } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
constructor(private readonly logger: AppLogger) {}

intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
const now = Date.now();
const request = context.switchToHttp().getRequest<Request>();
const { ip, method, originalUrl: url } = request;
const userAgent = request.headers["user-agent"] || "";
const requestBody = request.body;

    return next.handle().pipe(
      tap((responseBody) => {
        const response = context.switchToHttp().getResponse<Response>();
        const { statusCode } = response;
        const contentLength = response.get("content-length");

        // 성공적인 요청에 대한 로그
        this.logger.log(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            method,
            url,
            statusCode,
            responseTime: `${Date.now() - now}ms`,
            ip,
            userAgent,
            requestBody,
            responseBody,
            contentLength,
          })
        );
      }),
      catchError((error) => {
        const status = error instanceof HttpException ? error.getStatus() : 500;
        const responseTime = `${Date.now() - now}ms`;

        // 에러 발생 시의 로그
        this.logger.error(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            method,
            url,
            statusCode: status,
            responseTime,
            ip,
            userAgent,
            requestBody,
            message: error.message || null,
          }),
          error.stack
        );

        return throwError(() => error);
      })
    );

}
}

================================================
FILE: backend/src/common/interceptor/response.interceprot.ts
================================================
import {
Injectable,
NestInterceptor,
ExecutionContext,
CallHandler,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { HttpException } from "@nestjs/common";
import { Request, Response } from "express";
import { Result } from "@/utils/functionalUtil";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
const request = context.switchToHttp().getRequest<Request>();
const response = context.switchToHttp().getResponse<Response>();
const statusCode = response.statusCode;

    return next.handle().pipe(
      map((result: Result<T, any>) => {
        // 결과가 isSuccess: false 인 경우 에러로 처리
        if (result.isSuccess === false) {
          throw new HttpException(result.error, result.statusCode || 500);
        }

        // 성공적인 응답을 처리하여 필요한 형식으로 변환
        const successResponse = {
          isSuccess: result.isSuccess ? result.isSuccess : true,
          statusCode: statusCode,
          message: "Request successfully handled",
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
          data: result.value, // value를 data로 전달
        };

        return successResponse; // 성공적인 응답 반환
      }),
      catchError((error) => {
        // 에러 발생 시 처리
        const status = error instanceof HttpException ? error.getStatus() : 500;

        const errorResponse = {
          isSuccess: false,
          statusCode: status,
          message: error.message || "An error occurred",
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
        };

        response.status(status).json(errorResponse); // 실패 응답 반환
        return throwError(() => error); // 예외 다시 던지기
      })
    );

}
}

================================================
FILE: backend/src/common/middleware/ip-geolocation.middleware.ts
================================================
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import \* as geoip from "geoip-lite";
import { getClientIp } from "@/utils/httpUtil";
import { AppLogger } from "@/app.logger";
import { ConfigService } from "@nestjs/config"; // ConfigService import
import { ErrorResponse } from "@/types/response.interface";

@Injectable()
export class IpGeolocationMiddleware implements NestMiddleware {
private readonly allowedIPs: string[]; // 허용된 IP 목록을 환경 변수에서 가져옴

constructor(
private readonly logger: AppLogger,
private readonly configService: ConfigService // ConfigService 주입
) {
// 환경 변수에서 ALLOWED_IPS 값 읽어오기
const allowedIPsFromEnv = this.configService.get<string>("ALLOWED_IPS");
// 콤마로 구분된 IP들을 배열로 변환
this.allowedIPs = allowedIPsFromEnv ? allowedIPsFromEnv.split(",") : [];
}

use(req: Request, res: Response, next: NextFunction) {
const clientIp = getClientIp(req); // 클라이언트 IP 가져오기
const geo = geoip.lookup(clientIp); // IP의 국가 정보 확인
console.log(clientIp);
const { method, originalUrl: url } = req;

    // 화이트리스트에 있는 IP는 국가 검증 없이 통과
    if (this.isAllowedIP(clientIp)) {
      return next();
    }

    console.log(clientIp, "클라아이피");

    // // 화이트리스트에 없고, 한국이 아닌 경우 차단
    // if (!geo || geo.country !== "KR") {
    //   const errorResponse: ErrorResponse = {
    //     isSuccess: false,
    //     statusCode: 403,
    //     message: "Access denied: Only accessible from South Korea",
    //     timestamp: new Date().toISOString(),
    //     path: url,
    //     method: method,
    //   };

    //   // 로깅 처리
    //   this.logger.error(
    //     JSON.stringify({
    //       timestamp: errorResponse.timestamp,
    //       method,
    //       url,
    //       statusCode: errorResponse.statusCode,
    //       ip: clientIp,
    //       message: errorResponse.message,
    //     })
    //   );

    //   // 응답 객체로 클라이언트에게 반환
    //   return res.status(403).json(errorResponse);
    // }

    next(); // IP가 한국일 경우 계속 진행

}

// IP가 허용 목록에 있는지 확인하는 메소드
private isAllowedIP(clientIp: string): boolean {
return this.allowedIPs.includes(clientIp);
}
}

================================================
FILE: backend/src/common/middleware/logger.middleware.ts
================================================
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import axios from "axios"; // HTTP 클라이언트

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
use(req: Request, res: Response, next: NextFunction) {
const { method, originalUrl, headers, body } = req;

    // 로그 데이터 생성
    const log = {
      method,
      originalUrl,
      headers,
      body,
      timestamp: new Date().toISOString(),
    };

    // 데이터를 JSON 문자열로 직렬화
    const serializedLog = JSON.stringify(log);

    // Logstash로 HTTP 요청을 통해 로그 전송
    if (process.env.IS_DEV === "false") {
      axios
        .post(`http://127.0.0.1:${process.env.LOGSTASH_PORT}`, serializedLog, {
          headers: {
            "Content-Type": "application/json", // Content-Type을 JSON으로 설정
          },
          timeout: 100, // 타임아웃 설정
        })
        .catch((err) => {
          console.error("Logstash 전송 에러:", err);
        });
    } else {
      axios
        .post(`http://logstash:${process.env.LOGSTASH_PORT}`, serializedLog, {
          headers: {
            "Content-Type": "application/json", // Content-Type을 JSON으로 설정
          },
          timeout: 100, // 타임아웃 설정
        })
        .catch((err) => {
          console.error("Logstash 전송 에러:", err);
        });
    }

    next();

}
}

================================================
FILE: backend/src/common/redis/redis.client.ts
================================================
import IORedis, { Redis, Cluster } from "ioredis";
import { redisConfig } from "./redis.config";

let redisClient: Redis | Cluster;

if (redisConfig.nodes.length > 1) {
// 클러스터 모드
redisClient = new IORedis.Cluster(redisConfig.nodes);
} else {
// 단일 서버 모드
const node = redisConfig.nodes[0];
redisClient = new IORedis({
host: node.host,
port: node.port,
});
}

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

(async () => {
try {
await redisClient.ping();
console.log("Redis client connected");
} catch (error) {
console.error("Failed to connect to Redis:", error);
}
})();

export default redisClient;

================================================
FILE: backend/src/common/redis/redis.config.ts
================================================
// export const redisConfig = {
// host: process.env.REDIS_HOST || "localhost",
// port: parseInt(process.env.REDIS_PORT, 10) || 6379,
// };

export const redisConfig = {
nodes: [
{
host: process.env.REDIS_HOST || "localhost",
port: parseInt(process.env.REDIS_PORT, 10) || 6788,
},
],
};

================================================
FILE: backend/src/common/redis/redis.lock.ts
================================================
import { Redis, Cluster } from "ioredis";
import Redlock, { Lock } from "redlock";

type CompatibleRedisClient = (Redis | Cluster) & { [key: string]: any };

export class RedisLock {
private redlock: Redlock;

constructor(redisClients: CompatibleRedisClient[]) {
this.redlock = new Redlock(redisClients as any, {
retryCount: 3,
retryDelay: 200,
driftFactor: 0.01,
});
}

async acquireLock(key: string, ttl: number): Promise<Lock | null> {
try {
return await this.redlock.acquire([key], ttl);
} catch {
return null;
}
}

async releaseLock(lock: Lock): Promise<void> {
try {
await lock.release();
} catch (error) {
console.error("락 해제 실패:", error);
}
}
}

// Redis 클라이언트 배열 생성
import IORedis from "ioredis";

const redisClients: CompatibleRedisClient[] = [
new IORedis("redis://localhost:6788") as CompatibleRedisClient,
];

(async () => {
for (const client of redisClients) {
await client.ping();
}
})();

================================================
FILE: backend/src/common/redis/redis.module.ts
================================================
import { Module } from "@nestjs/common";
import { RedisService } from "./redis.service";

@Module({
providers: [RedisService],
exports: [RedisService],
})
export class RedisModule {}

================================================
FILE: backend/src/common/redis/redis.service.ts
================================================
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Redis } from "ioredis";
import Redlock, { Lock } from "redlock";
import redisClient from "./redis.client";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
private readonly client: Redis;
private readonly subscriber: Redis;
private readonly redlock: Redlock;

constructor() {
this.client = redisClient as Redis;
this.subscriber = this.client.duplicate();

    // Redlock 인스턴스 초기화
    this.redlock = new Redlock([this.client], {
      retryCount: 3, // 재시도 횟수
      retryDelay: 200, // 재시도 간격 (ms)
      driftFactor: 0.01, // 시간 보정
    });

}

onModuleInit(): void {
this.client.on("connect", () => console.log("Redis 연결 완료"));
this.client.on("error", (err) => console.error("Redis 연결 오류:", err));

    this.subscriber.on("connect", () =>
      console.log("Redis 구독 클라이언트 연결 완료")
    );
    this.subscriber.on("error", (err) =>
      console.error("Redis 구독 클라이언트 오류:", err)
    );

}

onModuleDestroy(): void {
this.client.quit();
this.subscriber.quit();
console.log("Redis 연결 종료");
}

// 기본 Redis 기능
async get(key: string): Promise<string | null> {
return this.client.get(key);
}

async set(key: string, value: string, ttl?: number): Promise<void> {
if (ttl) {
await this.client.set(key, value, "EX", ttl);
} else {
await this.client.set(key, value);
}
}

async del(key: string): Promise<void> {
await this.client.del(key);
}

// Redis 락 기능 추가
async acquireLock(key: string, ttl: number): Promise<Lock | null> {
try {
return await this.redlock.acquire([key], ttl);
} catch (error) {
console.error("Redis 락 획득 실패:", error);
return null;
}
}

async releaseLock(lock: Lock): Promise<void> {
try {
await lock.release();
} catch (error) {
console.error("Redis 락 해제 실패:", error);
}
}

async getTTL(key: string): Promise<number> {
const ttl = await this.client.ttl(key);
return ttl; // Redis TTL 결과값 반환
}
}

================================================
FILE: backend/src/enums/enum.ts
================================================
[Empty file]

================================================
FILE: backend/src/fingerprint/fingerprint.module.ts
================================================
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

================================================
FILE: backend/src/fingerprint/fingerprint.service.ts
================================================
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

================================================
FILE: backend/src/fingerprint/entities/browser-fingerprint.entity.ts
================================================
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

@CreateDateColumn()
createdAt: Date;
}

================================================
FILE: backend/src/formatters/ASCENDEX/ascendex-order.fomatter.ts
================================================
[Empty file]

================================================
FILE: backend/src/formatters/ASCENDEX/ascendex-orderbook.ts
================================================
import { OrderbookFormatter } from "src/interface/formatter.interface";
import { UnifiedOrderbook } from "src/interface/messege";
import { Exchange, MarketMessageType } from "src/interface/enum";

export class AscendexOrderbookFormatter implements OrderbookFormatter {
format(message: any): UnifiedOrderbook | null {
try {
// 예시: Ascendex 오더북 메시지 구조
// { m: "depth", symbol: "ETH-PERP", data: { asks: [...], bids: [...], ts: 1739803355646 } }
const data = message.data;
// best bid와 best ask는 각각 배열의 첫번째 값(가격, 수량)로 가정
const bestBid = data.bids?.[0];
const bestAsk = data.asks?.[0];
if (!bestBid || !bestAsk) return null;
const orderbook: UnifiedOrderbook = {
exchange: Exchange.ASCENDEX,
symbol: message.symbol,
type: MarketMessageType.ORDERBOOK,
bestBidPrice: parseFloat(bestBid[0]),
bestBidVolume: parseFloat(bestBid[1]),
bestAskPrice: parseFloat(bestAsk[0]),
bestAskVolume: parseFloat(bestAsk[1]),
currentPrice: (parseFloat(bestBid[0]) + parseFloat(bestAsk[0])) / 2,
timestamp: new Date(data.ts).toISOString(),
};
return orderbook;
} catch (error) {
console.error("AscendexOrderbookFormatter 오류:", error);
return null;
}
}
}

================================================
FILE: backend/src/formatters/ASCENDEX/ascendex-ticker.fomatter.ts
================================================
import { TickerFormatter } from "src/interface/formatter.interface";
import { UnifiedTicker } from "src/interface/messege";
import { Exchange, MarketMessageType } from "src/interface/enum";

export class AscendexTickerFormatter implements TickerFormatter {
format(message: any): UnifiedTicker | null {
try {
// 예시: Ascendex 티커 메시지 예시 구조
// { m: "ticker", symbol: "ETH-PERP", data: { last: "2806.66", ts: 1739803356123, ... } }
const data = message.data;
const ticker: UnifiedTicker = {
exchange: Exchange.ASCENDEX,
symbol: message.symbol,
type: MarketMessageType.TICKER,
currentPrice: parseFloat(data.last),
lastTradePrice: parseFloat(data.last),
timestamp: new Date(data.ts).toISOString(),
};
return ticker;
} catch (error) {
console.error("AscendexTickerFormatter 오류:", error);
return null;
}
}
}

================================================
FILE: backend/src/formatters/ASCENDEX/ascendex-trade.formatter.ts
================================================
import { TradeFormatter } from "src/interface/formatter.interface";
import { UnifiedTrade } from "src/interface/messege";
import { Exchange, MarketMessageType } from "src/interface/enum";

export class AscendexTradeFormatter implements TradeFormatter {
format(message: any): UnifiedTrade | null {
try {
// 예시: Ascendex 트레이드 메시지 구조
// { m: "trades", symbol: "ETH-PERP", data: [ { p: "2806.66", q: "86.65", ts: 1739803354859, bm: false, seqnum: ... }, ... ] }
const dataArray = message.data;
if (!Array.isArray(dataArray) || dataArray.length === 0) return null;
// 여기서는 가장 최근의 하나의 트레이드 데이터로 변환하는 예시
const tradeData = dataArray[0];
const unifiedTrade: UnifiedTrade = {
exchange: Exchange.ASCENDEX,
symbol: message.symbol,
type: MarketMessageType.TRADE,
tradePrice: parseFloat(tradeData.p),
tradeVolume: parseFloat(tradeData.q),
tradeSide: tradeData.bm ? "buy" : "sell", // bm=true이면 매수, false이면 매도로 가정
timestamp: new Date(tradeData.ts).toISOString(),
};
return unifiedTrade;
} catch (error) {
console.error("AscendexTradeFormatter 오류:", error);
return null;
}
}
}

================================================
FILE: backend/src/formatters/BITMART/bitmart-order.fomater.ts
================================================
[Empty file]

================================================
FILE: backend/src/formatters/BITMART/bitmart-orderbook.formatter.ts
================================================
import { UnifiedOrderbook } from "src/interface/messege";
import { Exchange, MarketMessageType } from "src/interface/enum";
import { OrderbookFormatter } from "src/interface/formatter.interface";

export class BitmartOrderbookFormatter implements OrderbookFormatter {
private readonly defaultSymbol = "BTCUSDT";

// bid(way=1)와 ask(way=2) 데이터를 내부에 저장하여 통합합니다.
private lastBids: {
depths: Array<{ price: number; vol: number }>;
ms_t: number;
} | null = null;
private lastAsks: {
depths: Array<{ price: number; vol: number }>;
ms_t: number;
} | null = null;

/\*\*

- Bitmart Order Book 메시지 예시 (bid side):
- {
- data: {
-     way: 1,
-     depths: [ { "price": "96999.7", "vol": "496" }, ... ]
- },
- group: "Depth:1",
- uuid: 3565685442,
- ms_t: 1739528825696
- }
-
- Bitmart Order Book 메시지 예시 (ask side):
- {
- data: {
-     way: 2,
-     depths: [ { "price": "97000.1", "vol": "210" }, ... ]
- },
- group: "Depth:1",
- uuid: 3565685428,
- ms_t: 1739528825695
- }
-
- 포매터는 bid와 ask 메시지가 모두 수신된 경우,
- 각각의 최고호가를 기준으로 중앙값(currentPrice)과 타임스탬프를 계산하여 UnifiedOrderbook으로 변환합니다.
  \*/
  format(message: any): UnifiedOrderbook | null {
  if (!message || !message.data || message.ms_t === undefined) {
  return null;
  }
  const data = message.data;
  const way = data.way;
  if (!data.depths || !Array.isArray(data.depths)) {
  return null;
  }
  // 문자열 데이터를 숫자로 변환
  const parsedDepths = data.depths.map((item: any) => ({
  price: parseFloat(item.price),
  vol: parseFloat(item.vol),
  }));

  if (way === 1) {
  // bid side: 내림차순 정렬 (최고가가 첫 번째)
  parsedDepths.sort((a, b) => b.price - a.price);
  this.lastBids = { depths: parsedDepths, ms_t: message.ms_t };
  } else if (way === 2) {
  // ask side: 오름차순 정렬 (최저가가 첫 번째)
  parsedDepths.sort((a, b) => a.price - b.price);
  this.lastAsks = { depths: parsedDepths, ms_t: message.ms_t };
  } else {
  return null;
  }

  // bid와 ask 데이터 모두 존재할 때 UnifiedOrderbook 객체 생성
  if (this.lastBids && this.lastAsks) {
  const bestBid = this.lastBids.depths[0];
  const bestAsk = this.lastAsks.depths[0];
  if (!bestBid || !bestAsk) return null;
  const currentPrice = (bestBid.price + bestAsk.price) / 2;
  // 두 메시지 중 최신 ms_t를 타임스탬프로 사용
  const timestamp = new Date(
  Math.max(this.lastBids.ms_t, this.lastAsks.ms_t)
  ).toISOString();

      return {
        exchange: Exchange.BITMART,
        symbol: this.defaultSymbol,
        type: MarketMessageType.ORDERBOOK,
        bestBidPrice: bestBid.price,
        bestBidVolume: bestBid.vol,
        bestAskPrice: bestAsk.price,
        bestAskVolume: bestAsk.vol,
        currentPrice,
        timestamp,
      };

  }

  return null;

}
}

================================================
FILE: backend/src/formatters/BITMART/bitmart-ticker.formmater.ts
================================================
import { Exchange, MarketMessageType } from "src/interface/enum";
import { TickerFormatter } from "src/interface/formatter.interface";
import { UnifiedTicker } from "src/interface/messege";

export class BitmartTickerFormatter implements TickerFormatter {
/\*\*

- Bitmart Ticker 메시지 예시:
- {
- data: {
-     last_price: "2709.07",
-     open: "2680.89",
-     close: "2709.07",
-     low: "2610.46",
-     high: "2720.49",
-     timestamp: 1739528825,
-     contract_name: "ETHUSDT",
-     ...
- },
- group: "ticker:2",
- uuid: 3565683762,
- ms_t: 1739528825651
- }
-
- 여기서는 contract_name을 심볼로, last_price를 현재가와 마지막 체결가로 사용합니다.
- timestamp는 epoch(초) 값을 밀리초로 변환하여 ISO8601 문자열로 만듭니다.
  _/
  format(message: any): UnifiedTicker | null {
  if (!message || !message.data) {
  return null;
  }
  const data = message.data;
  if (
  !data.contract_name ||
  !data.last_price ||
  data.timestamp === undefined
  ) {
  return null;
  }
  const symbol = data.contract_name.toUpperCase();
  const lastPrice = parseFloat(data.last_price);
  const timestamp = new Date(data.timestamp _ 1000).toISOString();
  return {
  exchange: Exchange.BITMART,
  symbol,
  type: MarketMessageType.TICKER,
  currentPrice: lastPrice,
  lastTradePrice: lastPrice,
  timestamp,
  };
  }
  }

================================================
FILE: backend/src/formatters/BITMART/bitmart-trade.formatter.ts
================================================
import { Exchange, MarketMessageType } from "src/interface/enum";
import { TradeFormatter } from "src/interface/formatter.interface";
import { UnifiedTrade } from "src/interface/messege";

export class BitmartTradeFormatter implements TradeFormatter {
/\*\*

- Bitmart 체결 메시지 예시:
- {
- data: [
-     {
-       trade_id: 3000000342872469,
-       contract_id: 1,
-       symbol: "BTCUSDT",
-       deal_price: "96999.9",
-       deal_vol: "3",
-       way: 6,
-       create_time: 1739528826,
-       create_time_mill: 1739528826209,
-       created_at: "2025-02-14T10:27:06.20997188Z"
-     }
- ],
- group: "Trade:1",
- uuid: 3565691440,
- ms_t: 1739528826259
- }
-
- 주의: Bitmart의 'way' 필드를 기준으로 매수/매도 매핑은 API 문서를 참고하여 확인해야 합니다.
- 아래 예시에서는 way가 6이면 "sell", 그 외는 "buy"로 처리합니다.
  \*/
  format(message: any): UnifiedTrade | null {
  if (
  !message ||
  !message.data ||
  !Array.isArray(message.data) ||
  message.data.length === 0
  ) {
  return null;
  }
  const tradeData = message.data[0];
  if (
  !tradeData.symbol ||
  !tradeData.deal_price ||
  !tradeData.deal_vol ||
  !tradeData.created_at
  ) {
  return null;
  }
  const symbol = tradeData.symbol.toUpperCase();
  const tradePrice = parseFloat(tradeData.deal_price);
  const tradeVolume = parseFloat(tradeData.deal_vol);
  let tradeSide: "buy" | "sell" | null = null;
  // 예시 매핑: way === 6이면 "sell", 그 외는 "buy"
  if (tradeData.way === 6) {
  tradeSide = "sell";
  } else {
  tradeSide = "buy";
  }
  // Bitmart는 created_at 필드에 ISO8601 포맷의 문자열을 제공합니다.
  const timestamp = tradeData.created_at;
  return {
  exchange: Exchange.BITMART,
  symbol,
  type: MarketMessageType.TRADE,
  tradePrice,
  tradeVolume,
  tradeSide,
  timestamp,
  };
  }
  }

================================================
FILE: backend/src/formatters/BLOFIN/blofin-order.formatter.ts
================================================
[Empty file]

================================================
FILE: backend/src/formatters/BLOFIN/blofin-orderbook.formatter.ts
================================================
[Empty file]

================================================
FILE: backend/src/formatters/BLOFIN/blofin-ticker.formatter.ts
================================================
[Empty file]

================================================
FILE: backend/src/formatters/BLOFIN/blofin-trade.formatter.ts
================================================
[Empty file]

================================================
FILE: backend/src/formatters/LBANK/lbank-order.fommater.ts
================================================
// src/formatters/LBANK/lbank-order.formatter.ts
import { Exchange, MarketMessageType } from "src/interface/enum";
import { UnifiedOrder } from "src/interface/messege";

export class LbankOrderFormatter {
public format(message: any): UnifiedOrder | null {
if (!message.data) return null;
const data = message.data;
// insertTime는 초 단위 UNIX 타임스탬프라고 가정합니다.
const timestamp = new Date(
parseInt(data.insertTime, 10) \* 1000
).toISOString();
// direction: "0"이면 매수(BUY), "1"이면 매도(SELL)
const orderSide = data.direction === "0" ? "BUY" : "SELL";
// posiDirection: "0"이면 롱(LONG), "1"이면 숏(SHORT)
const positionSide = data.posiDirection === "0" ? "LONG" : "SHORT";

    return {
      exchange: Exchange.LBANK,
      instrument: data.instrumentID,
      type: MarketMessageType.ORDER, // ✅ Enum 적용
      executedPrice: data.tradePrice,
      executedVolume: data.volumeTraded, // 또는 data.volume 사용 가능
      timestamp,
      orderSide,
      positionSide,
    };

}
}

================================================
FILE: backend/src/formatters/LBANK/lbank-orderbook.formatter.ts
================================================
import { UnifiedOrderbook } from "src/interface/messege";
import { Exchange, MarketMessageType } from "src/interface/enum";
import { OrderbookFormatter } from "src/interface/formatter.interface";

export class LbankOrderbookFormatter implements OrderbookFormatter {
// 필요에 따라 심볼은 채널 정보 등에서 주입할 수 있으나 여기서는 기본값 사용
private readonly defaultSymbol = "BTCUSDT";

/\*\*

- LBANK Order Book 메시지 예시:
- {
- b: [ ["101526.4","5.7374"], ... ], // 매수 호가 배열
- s: [ ["101527.8","5.441"], ... ], // 매도 호가 배열
- w: 1738628490812, // 타임스탬프 (epoch ms)
- x: 3,
- y: "3000000001",
- z: 3
- }
-
- 가장 상위 호가를 사용하여 중앙값을 산출하고, 각 호가의 거래량을 추출합니다.
  \*/
  format(message: any): UnifiedOrderbook | null {
  if (!message || !message.b || !message.s || message.w === undefined) {
  return null;
  }
  const bestBid = message.b[0];
  const bestAsk = message.s[0];
  if (!bestBid || !bestAsk) return null;

  const bestBidPrice = parseFloat(bestBid[0]);
  const bestBidVolume = parseFloat(bestBid[1]);
  const bestAskPrice = parseFloat(bestAsk[0]);
  const bestAskVolume = parseFloat(bestAsk[1]);
  const currentPrice = (bestBidPrice + bestAskPrice) / 2; // 중앙값 계산 (선택적)

  return {
  exchange: Exchange.LBANK, // ✅ Enum 적용
  symbol: this.defaultSymbol,
  type: MarketMessageType.ORDERBOOK, // ✅ Enum 적용
  bestBidPrice, // ✅ 최고 매수 가격
  bestBidVolume, // ✅ 최고 매수 가격에 걸린 주문량
  bestAskPrice, // ✅ 최저 매도 가격
  bestAskVolume, // ✅ 최저 매도 가격에 걸린 주문량
  currentPrice, // ✅ 중앙값 (선택적)
  timestamp: new Date(message.w).toISOString(),
  };

}
}

================================================
FILE: backend/src/formatters/LBANK/lbank-ticker.formatter.ts
================================================
import { Exchange, MarketMessageType } from "src/interface/enum";
import { TickerFormatter } from "src/interface/formatter.interface";
import { UnifiedTicker } from "src/interface/messege";

export class LbankTickerFormatter implements TickerFormatter {
/\*\*

- LBANK Ticker 메시지 예시 (d 배열 형식):
- {
- d: [
-     {
-       a: "BTCUSDT",
-       b: "102565",
-       c: "100534",
-       d: "101599.602",
-       e: "101549.5",
-       f: "0.000025",
-       g: "101618.9",
-       h: "101293.6",
-       i: "101527",          // 여기서 마지막 체결가로 판단
-       j: "60.5168",
-       ...,
-       u: 1738628490         // 타임스탬프 (epoch seconds)
-     }
- ],
- w: 1738628490812,
- x: 1,
- y: "1000000001",
- z: 3
- }
  _/
  format(message: any): UnifiedTicker | null {
  if (
  !message ||
  !message.d ||
  !Array.isArray(message.d) ||
  message.d.length === 0
  ) {
  return null;
  }
  const data = message.d[0];
  if (!data.a || !data.i || data.u === undefined) return null;
  const symbol = data.a.toUpperCase();
  const lastPrice = parseFloat(data.i);
  return {
  exchange: Exchange.LBANK,
  symbol,
  type: MarketMessageType.TICKER,
  currentPrice: lastPrice,
  lastTradePrice: lastPrice,
  // u는 epoch(초)인 경우 → 밀리초로 변환
  timestamp: new Date(data.u _ 1000).toISOString(),
  };
  }
  }

================================================
FILE: backend/src/formatters/LBANK/lbank-trade.formatter.ts
================================================
import { Exchange, MarketMessageType } from "src/interface/enum";
import { TradeFormatter } from "src/interface/formatter.interface";
import { UnifiedTrade } from "src/interface/messege";

export class LbankTradeFormatter implements TradeFormatter {
/\*\*

- LBANK 체결 메시지 예시 (d가 객체로 주어짐):
- {
- d: {
-     a: "BTCUSDT",
-     b: "0.0078",         // 거래량
-     c: "101527.7",        // 체결가 (거래 가격)
-     d: "1",              // 거래 타입 (예: "1"이면 매수, "0"이면 매도)
-     e: "1738628490",     // 타임스탬프 (epoch seconds)
-     f: "1000153669261600"
- },
- w: ...,
- x: ...,
- y: ...,
- z: ...
- }
  \*/
  format(message: any): UnifiedTrade | null {
  if (
  !message ||
  !message.d ||
  typeof message.d !== "object" ||
  Array.isArray(message.d)
  ) {
  return null;
  }
  const data = message.d;
  if (!data.a || !data.c || !data.b || !data.e) return null;

  const symbol = data.a.toUpperCase();
  const tradePrice = parseFloat(data.c); // ✅ 체결 가격
  const tradeVolume = parseFloat(data.b); // ✅ 체결량

  // ✅ 매수/매도 타입 결정
  const tradeSide = data.d === "1" ? "buy" : data.d === "0" ? "sell" : null;
  if (!tradeSide) return null;

  return {
  exchange: Exchange.LBANK,
  symbol,
  type: MarketMessageType.TRADE,
  tradePrice, // ✅ 필수 데이터 추가
  tradeVolume, // ✅ 필수 데이터 추가
  tradeSide, // ✅ "buy" 또는 "sell"
  timestamp: new Date(parseInt(data.e, 10) \* 1000).toISOString(),
  };

}
}

================================================
FILE: backend/src/formatters/XT/xt-orderbook.formatter.ts
================================================
import { Exchange, MarketMessageType } from "src/interface/enum";
import { OrderbookFormatter } from "src/interface/formatter.interface";
import { UnifiedOrderbook } from "src/interface/messege";

export class XTOrderbookFormatter implements OrderbookFormatter {
/\*\*

- XT Depth Update 메시지 예시:
- {
- topic: "depth_update",
- event: "depth_update@btc_usdt,100ms",
- data: {
-     s: "btc_usdt",
-     pu: "1062665699362",
-     fu: "1062665699363",
-     u: "1062665699490",
-     a: [ ["94943.5","24239"], ... ],  // asks 배열 (매도 호가)
-     b: [ ["94947.1","0"], ... ],       // bids 배열 (매수 호가)
-     t: 1738584148634                 // 타임스탬프
- }
- }
-
- 여기서는 매도/매수 각각의 최우선 호가 정보를 사용하여 bestBidPrice, bestBidVolume, bestAskPrice, bestAskVolume 값을 설정하고,
- 중앙값(currentPrice)을 산출합니다.
  \*/
  format(message: any): UnifiedOrderbook | null {
  if (!message || !message.data) return null;
  const data = message.data;
  if (!data.s || !data.a || !data.b || !data.t) return null;

  // asks: 매도 호가 배열, bids: 매수 호가 배열
  const bestAsk =
  Array.isArray(data.a) && data.a.length > 0 ? data.a[0] : null;
  const bestBid =
  Array.isArray(data.b) && data.b.length > 0 ? data.b[0] : null;
  if (!bestAsk && !bestBid) return null;

  // 각각의 최우선 호가 정보를 파싱 (없으면 0으로 대체)
  const bestBidPrice = bestBid ? parseFloat(bestBid[0]) : 0;
  const bestBidVolume = bestBid ? parseFloat(bestBid[1]) : 0;
  const bestAskPrice = bestAsk ? parseFloat(bestAsk[0]) : 0;
  const bestAskVolume = bestAsk ? parseFloat(bestAsk[1]) : 0;

  // 중앙값(currentPrice) 계산: 매수와 매도 호가가 모두 있을 경우 평균값 사용,
  // 하나만 존재하면 해당 값을 사용합니다.
  let currentPrice = 0;
  if (bestAsk && bestBid) {
  currentPrice = (bestAskPrice + bestBidPrice) / 2;
  } else if (bestAsk) {
  currentPrice = bestAskPrice;
  } else if (bestBid) {
  currentPrice = bestBidPrice;
  }

  return {
  exchange: Exchange.XT,
  symbol: data.s.replace("\_", "").toUpperCase(),
  type: MarketMessageType.ORDERBOOK,
  bestBidPrice,
  bestBidVolume,
  bestAskPrice,
  bestAskVolume,
  currentPrice,
  timestamp: new Date(data.t).toISOString(),
  };

}
}

================================================
FILE: backend/src/formatters/XT/xt-ticker.formatter.ts
================================================
import { Exchange, MarketMessageType } from "src/interface/enum";
import { TickerFormatter } from "src/interface/formatter.interface";
import { UnifiedTicker } from "src/interface/messege";

export class XTTickerFormatter implements TickerFormatter {
/\*\*

- XT Ticker 메시지 예시:
- {
- topic: "ticker",
- event: "ticker@btc_usdt",
- data: {
-     s: "btc_usdt",
-     o: "98765.5",
-     c: "94942.5",      // 현재 체결가 및 현재가로 사용
-     h: "99385.1",
-     l: "91157.7",
-     a: "1990795300",
-     v: "19056426599.92261",
-     r: "-0.0387",
-     t: 1738584148681  // 타임스탬프 (epoch ms)
- }
- }
  \*/
  format(message: any): UnifiedTicker | null {
  if (!message || !message.data) return null;
  const data = message.data;
  if (data.s === undefined || data.c === undefined || data.t === undefined) {
  return null;
  }
  // 예: "btc*usdt" → "BTCUSDT"
  const symbol = data.s.replace("*", "").toUpperCase();
  const price = parseFloat(data.c);

  return {
  exchange: Exchange.XT,
  symbol,
  type: MarketMessageType.TICKER,
  currentPrice: price,
  lastTradePrice: price,
  timestamp: new Date(data.t).toISOString(),
  };

}
}

================================================
FILE: backend/src/interface/elementParse.interface.ts
================================================
export interface TradeOrderData {
entryPrice: string;
marketPrice: string;
pnl: string;
}

================================================
FILE: backend/src/interface/enum.ts
================================================
export enum MarketMessageType {
TICKER = "ticker",
ORDERBOOK = "orderbook",
TRADE = "trade", // 체결 데이터 (Depth라고 명명할 수도 있음)
ORDER = "order", // 실제 사용자 주문 데이터
}

export enum Exchange {
LBANK = "LBANK",
BINANCE = "BINANCE",
COINBASE = "COINBASE",
OKX = "OKX",
XT = "XT",
BITMART = "BITMART",
ASCENDEX = "ASCENDEX",
// 필요하면 다른 거래소도 추가 가능
}

================================================
FILE: backend/src/interface/formatter.interface.ts
================================================
import { UnifiedOrder, UnifiedOrderbook } from "./messege";
import { UnifiedTrade } from "./messege";
import { UnifiedTicker } from "./messege";
/\*\*

- 모든 거래소의 Orderbook 데이터를 통일된 형식으로 변환하는 포맷터 인터페이스
  \*/
  export interface OrderbookFormatter {
  /\*\*
  - Orderbook 데이터를 UnifiedOrderbook 형식으로 변환하는 메서드
  - @param message 원본 Orderbook 데이터 (각 거래소에서 받은 원본 데이터)
  - @returns UnifiedOrderbook 객체 또는 변환 실패 시 null
    \*/
    format(message: any): UnifiedOrderbook | null;
    }

/\*\*

- 모든 거래소의 Trade 데이터를 통일된 형식으로 변환하는 포맷터 인터페이스
  \*/
  export interface TradeFormatter {
  /\*\*
  - Trade 데이터를 UnifiedTrade 형식으로 변환하는 메서드
  - @param message 원본 Trade 데이터 (각 거래소에서 받은 원본 데이터)
  - @returns UnifiedTrade 객체 또는 변환 실패 시 null
    \*/
    format(message: any): UnifiedTrade | null;
    }

export interface TickerFormatter {
/\*\*

- Trade 데이터를 UnifiedTicker 형식으로 변환하는 메서드
- @param message 원본 Ticker 데이터 (각 거래소에서 받은 원본 데이터)
- @returns UnifiedTicker 객체 또는 변환 실패 시 null
  \*/
  format(message: any): UnifiedTicker | null;
  }

export interface OrderFormatter {
/\*\*

- Trade 데이터를 UnifiedTicker 형식으로 변환하는 메서드
- @param message 원본 Ticker 데이터 (각 거래소에서 받은 원본 데이터)
- @returns UnifiedTicker 객체 또는 변환 실패 시 null
  \*/
  format(message: any): UnifiedOrder | null;
  }

================================================
FILE: backend/src/interface/messege.ts
================================================
import { Exchange, MarketMessageType } from "./enum";

/\*\*

- 통합 메시지 형식 (예시)
  \*/
  export interface AggregatedWSMessage {
  exchange: "XT" | "LBANK" | "BINANCE"; // 거래소 식별
  symbol: string; // 예: 'BTCUSDT'
  dataType: "orderbook" | "trade" | "ticker" | "kline";
  // ---- 실질적인 데이터 payload ----
  payload: {
  // orderbook일 경우
  bids?: Array<[number, number]>; // [[price, size], ...]
  asks?: Array<[number, number]>;
  // trade일 경우
  trades?: Array<{
  price: number;
  volume: number;
  side: "buy" | "sell"; // 매수 or 매도
  timestamp: number; //거래 시각
  }>;
  // ticker일 경우
  close?: number; // 종가 or 현재가
  high?: number; // 24h 고가
  low?: number; // 24h 저가
  volume?: number; // 24h 거래량
  // kline일 경우
  open?: number;
  closeTime?: number;
  // ...
  };
  // 메시지 수신 시점 (거래소 서버 시간)
  localTimestamp: number;
  }

export interface UnifiedTicker {
exchange: Exchange;
symbol: string;
type: MarketMessageType.TICKER; // 고정값
currentPrice: number;
lastTradePrice: number;
timestamp: string;
}

export interface UnifiedTrade {
exchange: Exchange; // ✅ 거래소 (LBANK, BINANCE 등)
symbol: string; // ✅ BTCUSDT, ETHUSDT 등
type: MarketMessageType.TRADE; // ✅ "trade" 고정값
tradePrice: number; // ✅ 체결된 가격 (101527.7)
tradeVolume: number; // ✅ 체결된 거래량 (0.0078)
tradeSide: "buy" | "sell"; // ✅ 매수 or 매도
timestamp: string; // ✅ 체결 시간 (ISO8601 포맷)
}

export interface UnifiedOrderbook {
exchange: Exchange;
symbol: string;
type: MarketMessageType.ORDERBOOK; // 고정값
bestBidPrice: number;
bestBidVolume: number;
bestAskPrice: number;
// lastTradePrice: number;
bestAskVolume: number;
currentPrice: number; // 예를 들어 중앙값 등
timestamp: string;
}

export interface UnifiedOrder {
/** 어느 거래소에서 체결되었는지 (예: "LBANK") \*/
exchange: Exchange;
/** 거래 종목 (예: "BTCUSDT") _/
instrument: string;
/\*\* 체결 가격 (응답의 tradePrice 사용) _/
executedPrice: string;
/** 체결량 (응답의 volume 또는 volumeTraded 사용) \*/
executedVolume: string;
/** 체결 시각 (insertTime 값을 ISO 8601 문자열로 변환) \*/
timestamp: string;

type: MarketMessageType.ORDER;
/\*\*

- 주문 방향: 매수(BUY) 또는 매도(SELL)
- 응답의 direction 필드가 "0"이면 매수, "1"이면 매도로 처리
  \*/
  orderSide: "BUY" | "SELL";
  /\*\*
- 포지션 방향: 롱(LONG) 또는 숏(SHORT)
- 응답의 posiDirection 필드가 "0"이면 롱, "1"이면 숏으로 처리
  \*/
  positionSide: "LONG" | "SHORT";
  }

================================================
FILE: backend/src/puppeteer/puppeteer.controller.ts
================================================
// src/puppeteer-test/puppeteer.controller.ts
import { Controller, Post, Body, Get } from "@nestjs/common";
import { PuppeteerService } from "./puppeteer.service";
import { failure, success } from "@/utils/functionalUtil";

@Controller("puppeteer")
export class PuppeteerController {
constructor(private readonly puppeteerService: PuppeteerService) {}

@Post("launch")
async launchBrowser(@Body("url") url: string) {
const browser = await this.puppeteerService.createBrowser(url);

    const pages = await browser.browser.pages();
    const page = pages[0]; // 첫 번째 탭

    // await page.goto(url, { waitUntil: "networkidle2", timeout: 10000 });
    const title = await page.title();
    // await page.close();
    return success({ title, uuid: browser.uuid });

}

@Post("reopen")
async reopenBrowser(@Body("uuid") uuid: string) {
try {
if (!uuid) {
return failure({ message: "UUID가 비어 있습니다." });
}

      const browser = await this.puppeteerService.reopenBrowser(uuid);

      const pages = await browser.pages();
      const page = pages[0];
      const title = await page.title();

      return success({ title });
    } catch (err) {
      console.error("reopen error:", err);
      return failure(err.message ?? { message: err.message });
    }

}

@Get("status")
async browserStatus() {
const statuses = await this.puppeteerService.getBrowserStatuses();
return success({ count: statuses.length, statuses });
}
}

================================================
FILE: backend/src/puppeteer/puppeteer.gateway.ts
================================================
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({ cors: true })
export class PuppeteerGateway {
@WebSocketServer()
server: Server;

emit(event: string, data: any) {
this.server.emit(event, data);
}
}

================================================
FILE: backend/src/puppeteer/puppeteer.module.ts
================================================
// src/puppeteer/puppeteer.module.ts
import { Module, Global } from "@nestjs/common";
import { PuppeteerService } from "./puppeteer.service";
import { PuppeteerController } from "./puppeteer.controller";
import { FingerprintService } from "@/fingerprint/fingerprint.service";
import { FingerprintModule } from "@/fingerprint/fingerprint.module";
import { PuppeteerGateway } from "./puppeteer.gateway";

@Global()
@Module({
imports: [
FingerprintModule, // 👈 반드시 import
// TypeOrmModule.forFeature([...]) // 필요시 추가
],
providers: [PuppeteerService, PuppeteerGateway],
controllers: [PuppeteerController],
exports: [PuppeteerService],
})
export class PuppeteerModule {}

================================================
FILE: backend/src/puppeteer/puppeteer.service.spec.ts
================================================
[Empty file]

================================================
FILE: backend/src/puppeteer/puppeteer.service.ts
================================================
// src/puppeteer/puppeteer.service.ts
import { Injectable, OnModuleDestroy, Logger } from "@nestjs/common";
import { Browser, Page, CDPSession } from "puppeteer-core";
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
import {
generateRandomFingerprintForKorea,
applyFingerprint,
} from "../utils/fingerprintGenerator";
import { FingerprintService } from "@/fingerprint/fingerprint.service";
import _ as fs from "fs";
import _ as path from "path";
import { Buffer } from "buffer";

import { XTTickerFormatter } from "../formatters/XT/xt-ticker.formatter";
import { XTOrderbookFormatter } from "src/formatters/XT/xt-orderbook.formatter";
import { LbankTickerFormatter } from "../formatters/LBANK/lbank-ticker.formatter";
import { LbankOrderbookFormatter } from "../formatters/LBANK/lbank-orderbook.formatter";
import { LbankTradeFormatter } from "../formatters/LBANK/lbank-trade.formatter";
import { BitmartOrderbookFormatter } from "src/formatters/BITMART/bitmart-orderbook.formatter";
import { BitmartTradeFormatter } from "src/formatters/BITMART/bitmart-trade.formatter";
import { BitmartTickerFormatter } from "src/formatters/BITMART/bitmart-ticker.formmater";
// Unified 메시지 인터페이스 및 Enum 임포트
import { Exchange, MarketMessageType } from "src/interface/enum";
import { LbankOrderFormatter } from "src/formatters/LBANK/lbank-order.fommater";

import _ as LbankExchange from "./exchange/lbank";
import _ as BitmartExchange from "./exchange/bitmart";

import { AscendexTickerFormatter } from "src/formatters/ASCENDEX/ascendex-ticker.fomatter";
import { AscendexOrderbookFormatter } from "src/formatters/ASCENDEX/ascendex-orderbook";
import { AscendexTradeFormatter } from "src/formatters/ASCENDEX/ascendex-trade.formatter";
import { TradeOrderData } from "src/interface/elementParse.interface";
import { PuppeteerGateway } from "./puppeteer.gateway";

interface WebSocketMessage {
topic?: string;
[key: string]: unknown;
}
export interface PuppeteerInstance {
browser: Browser;
uuid: string;
}

@Injectable()
export class PuppeteerService implements OnModuleDestroy {
constructor(
private readonly fingerprintService: FingerprintService,
private readonly puppeteerGateway: PuppeteerGateway
) {}

private latestMessages: { [key: string]: string } = {}; // 최신 로그 메시지 저장
private xtTickerFormatter = new XTTickerFormatter();
private xtOderbookFormatter = new XTOrderbookFormatter();
// 2. Lbank 포매터 인스턴스 생성
private lbankTickerFormatter = new LbankTickerFormatter();
private lbankOrderbookFormatter = new LbankOrderbookFormatter();
private lbankTradeFormatter = new LbankTradeFormatter();
private lbankOrderFormatter = new LbankOrderFormatter();
//3. Bitmart 포매터 인스턴스 생성
private bitmartTickerFormatter = new BitmartOrderbookFormatter();
private bitmartOrderbookFormatter = new BitmartOrderbookFormatter();
private bitmartTradeFormatter = new BitmartTradeFormatter();
// 4. Ascendex 포매터 인스턴스 생성
private ascendexTickerFormatter = new AscendexTickerFormatter();
private ascendexOrderbookFormatter = new AscendexOrderbookFormatter();
private ascendexTradeFormatter = new AscendexTradeFormatter();

private readonly logger = new Logger(PuppeteerService.name);
private readonly browsers = new Map<string, Browser>();

private getRawLogFilePath(
exchange: "LBANK" | "BITMART" | "ASCENDEX" | "OTHER" | "ORANGEX" | "BYDFI"
): string {
switch (exchange) {
case "LBANK":
return path.resolve(**dirname, "../../logs/LBANK/raw.txt");
case "BITMART":
return path.resolve(**dirname, "../../logs/BITMART/raw.txt");
case "ASCENDEX":
return path.resolve(**dirname, "../../logs/ASCENDEX/raw.txt");
case "ORANGEX":
return path.resolve(**dirname, "../../logs/ORANGEX/raw.txt");
case "BYDFI":
return path.resolve(**dirname, "../../logs/BYDFI/raw.txt");
default:
return path.resolve(**dirname, "../../logs/OTHER/raw.txt");
}
}

// 각 거래소별, 메시지 타입별 로그 파일 경로 설정
private readonly logFilePaths: Partial<
Record<Exchange, Record<MarketMessageType, string>>

> = {

    [Exchange.XT]: {
      [MarketMessageType.TICKER]: path.resolve(
        __dirname,
        "../../logs/XT/xt_ticker.txt"
      ),
      [MarketMessageType.TRADE]: path.resolve(
        __dirname,
        "../../logs/XT/xt_trade.txt"
      ),
      [MarketMessageType.ORDERBOOK]: path.resolve(
        __dirname,
        "../../logs/XT/xt_orderbook.txt"
      ),
      [MarketMessageType.ORDER]: path.resolve(
        __dirname,
        "../../logs/XT/xt_orderbook.txt"
      ),
    },
    [Exchange.LBANK]: {
      [MarketMessageType.TICKER]: path.resolve(
        __dirname,
        "../../logs/LBANK/lbank_ticker.txt"
      ),
      [MarketMessageType.TRADE]: path.resolve(
        __dirname,
        "../../logs/LBANK/lbank_trade.txt"
      ),
      [MarketMessageType.ORDERBOOK]: path.resolve(
        __dirname,
        "../../logs/LBANK/lbank_orderbook.txt"
      ),
      [MarketMessageType.ORDER]: path.resolve(
        __dirname,
        "../../logs/LBANK/lbank_order.txt"
      ),
    },
    [Exchange.BITMART]: {
      [MarketMessageType.TICKER]: path.resolve(
        __dirname,
        "../../logs/BITMART/bitmart_ticker.txt"
      ),
      [MarketMessageType.TRADE]: path.resolve(
        __dirname,
        "../../logs/BITMART/bitmart_trade.txt"
      ),
      [MarketMessageType.ORDERBOOK]: path.resolve(
        __dirname,
        "../../logs/BITMART/bitmart_orderbook.txt"
      ),
      [MarketMessageType.ORDER]: path.resolve(
        __dirname,
        "../../logs/BITMART/bitmart_order.txt"
      ),
    },
    [Exchange.ASCENDEX]: {
      [MarketMessageType.TICKER]: path.resolve(
        __dirname,
        "../../logs/ASCENDEX/ascendex_ticker.txt"
      ),
      [MarketMessageType.TRADE]: path.resolve(
        __dirname,
        "../../logs/ASCENDEX/ascendex_trade.txt"
      ),
      [MarketMessageType.ORDERBOOK]: path.resolve(
        __dirname,
        "../../logs/ASCENDEX/ascendex_orderbook.txt"
      ),
      [MarketMessageType.ORDER]: path.resolve(
        __dirname,
        "../../logs/ASCENDEX/ascendex_order.txt"
      ),
    },

};

private logUnifiedMessage(message: any): void {
const exchange = message.exchange;
const messageType = message.type;
const filePath =
this.logFilePaths[exchange] && this.logFilePaths[exchange][messageType];
if (!filePath) {
console.warn(
`로그 파일 경로 미정의: exchange=${exchange}, type=${messageType}`
);
return;
}

    let logMessage = "";
    switch (messageType) {
      case MarketMessageType.TICKER: {
        const ticker = message as any;
        logMessage = `[${ticker.timestamp}] ${ticker.exchange} TICKER | Symbol: ${ticker.symbol} | CurrentPrice: ${ticker.currentPrice} | LastTradePrice: ${ticker.lastTradePrice}\n`;
        break;
      }
      case MarketMessageType.TRADE: {
        const trade = message as any;
        logMessage = `[${trade.timestamp}] ${trade.exchange} TRADE | Symbol: ${trade.symbol} | TradePrice: ${trade.tradePrice} | TradeVolume: ${trade.tradeVolume} | TradeSide: ${trade.tradeSide}\n`;
        break;
      }
      case MarketMessageType.ORDERBOOK: {
        const orderbook = message as any;
        logMessage = `[${orderbook.timestamp}] ${orderbook.exchange} ORDERBOOK | Symbol: ${orderbook.symbol} | BestBid: ${orderbook.bestBidPrice} (${orderbook.bestBidVolume}) | BestAsk: ${orderbook.bestAskPrice} (${orderbook.bestAskVolume}) | CurrentPrice: ${orderbook.currentPrice}\n`;
        break;
      }
      case MarketMessageType.ORDER: {
        const order = message as any;
        logMessage = `[${order.timestamp}] ${order.exchange} ORDER | Symbol: ${order.instrument} | ExecutedPrice: ${order.executedPrice} | ExecutedVolume: ${order.executedVolume} | OrderSide: ${order.orderSide} | PositionSide: ${order.positionSide}\n`;
        break;
      }

      default:
        console.warn(`알 수 없는 메시지 타입: ${messageType}`);
        return;
    }

    // exchange와 messageType을 키로 하여 최신 로그 메시지를 메모리에 저장합니다.
    const key = `${exchange}-${messageType}`;
    this.latestMessages[key] = logMessage;

    try {
      fs.appendFileSync(filePath, logMessage, "utf8");
    } catch (error) {
      console.error(`로그 기록 실패 (파일: ${filePath}):`, error);
    }

}

public getLatestMessages(): { [key: string]: string } {
return this.latestMessages;
}

private async handleFetchResponse(
cdp: CDPSession,
params: any,
siteUrl: string
): Promise<void> {
const { response, requestId } = params;

    // JSON 응답만 처리 (필요에 따라 조건 확장 가능)
    if (response.mimeType && response.mimeType.includes("application/json")) {
      try {
        const responseBody = await cdp.send("Network.getResponseBody", {
          requestId,
        });
        const rawData = responseBody.body;
        if (!rawData) return;

        let parsed: any;
        try {
          parsed = JSON.parse(rawData);
        } catch (err) {
          // JSON 파싱 실패 시 무시
          return;
        }

        // 기타 fetch 응답 처리 (필요 시 추가)
        const unifiedMessage = this.formatMessage(parsed, siteUrl);
        if (unifiedMessage) {
          // this.logUnifiedMessage(unifiedMessage);
          // this.server.emit("tradeData", unifiedMessage);
        }
      } catch (err) {
        // console.error("Fetch response 처리 중 에러 발생:", err);
      }
    }

}

private appendRawLog(
exchange: "LBANK" | "BITMART" | "OTHER" | "ASCENDEX" | "ORANGEX" | "BYDFI",
logMessage: string
): void {
const filePath = this.getRawLogFilePath(exchange);
// 디렉토리 없으면 생성 (이미 ensureLogFileAt가 있다면 재활용 가능)
const logDir = path.dirname(filePath);
if (!fs.existsSync(logDir)) {
fs.mkdirSync(logDir, { recursive: true });
}
// 로그 파일에 문자열 추가
fs.appendFileSync(filePath, logMessage + "\n", "utf8");
}

private formatMessage(message: any, siteUrl: string): any | null {
if (siteUrl.includes("lbank.com")) {
if (message.name === "SendOrderInsert") {
console.log(message, "message name sendorderinsert");
return this.lbankOrderFormatter.format(message);
}

      if (message.d) {
        // 만약 d가 배열이면 기존 로직대로 처리
        if (Array.isArray(message.d)) {
          const ticker = this.lbankTickerFormatter.format(message);
          if (ticker) return ticker;
        }
        // d가 객체인 경우 ticker에 필요한 키가 있는지 확인 후 배열로 감싸서 전달
        else if (typeof message.d === "object") {
          const { a, i, u, k } = message.d;
          if (a && i && (u || k)) {
            const ticker = this.lbankTickerFormatter.format({
              ...message,
              d: [message.d],
            });
            if (ticker) return ticker;
          }
        }
      }
      // Orderbook 메시지 (예: message.b와 message.s가 존재하는 경우)
      if (message.b && message.s) {
        return this.lbankOrderbookFormatter.format(message);
      }
      // Trade 메시지 (추가 조건이 있다면 Trade 포매터를 호출)
      if (message.d && typeof message.d === "object") {
        return this.lbankTradeFormatter.format(message);
      }
    } else if (siteUrl.includes("ascendex.com")) {
      // Ascendex의 경우, 메시지의 "m" 필드를 기준으로 처리합니다.
      switch (message.m) {
        case "ticker":
          return this.ascendexTickerFormatter.format(message);
        case "depth":
          return this.ascendexOrderbookFormatter.format(message);
        case "trades":
          return this.ascendexTradeFormatter.format(message);
        // case "order":
        //   return this.ascendexOrderFormatter.format(message);
        default:
          //  console.warn("Ascendex: 알 수 없는 메시지 타입", message.m);
          return null;
      }
    } else if (siteUrl.includes("bitmart.com")) {
      if (message.group) {
        if (message.group.startsWith("Ticker")) {
          return this.bitmartTickerFormatter.format(message);
        } else if (message.group.startsWith("Depth")) {
          return this.bitmartOrderbookFormatter.format(message);
        } else if (message.group.startsWith("Trade")) {
          return this.bitmartTradeFormatter.format(message);
        }
      }
      return;
    } else if (siteUrl.includes("xt.com")) {
      if (message.topic === "ticker") {
        return this.xtTickerFormatter.format(message);
      } else if (message.topic === "depth_update") {
        return this.xtOderbookFormatter.format(message);
      }
    }

    return null;

}

async createBrowser(siteUrl: string): Promise<PuppeteerInstance> {
const { connect } = require("puppeteer-real-browser");

    const { browser, page }: { browser: Browser; page: Page } = await connect({
      headless: false,
      executablePath: process.env.CHROME_PATH,
      args: [],
      customConfig: {
        defaultViewport: null,
      },
      turnstile: false,
      connectOption: {
        defaultViewport: {
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
        },
      },
      disableXvfb: false,
      ignoreAllFlags: false,
    });

    // ✅ 브라우저 지문 랜덤 설정
    const publicIp = await this.getPublicIp();
    const fingerprint = await generateRandomFingerprintForKorea(publicIp);
    const uuid = await this.fingerprintService.saveFingerprint(
      fingerprint,
      siteUrl
    );
    this.logger.log(`📦 브라우저 Fingerprint 저장됨: ${uuid}`);

    await applyFingerprint(page, fingerprint);

    // ✅ 입력받은 siteUrl로 이동
    await page.goto(siteUrl, { waitUntil: "domcontentloaded" });

    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();

        if (window.indexedDB && indexedDB.databases) {
          indexedDB.databases().then((dbs) => {
            dbs.forEach((db) => {
              if (db.name) indexedDB.deleteDatabase(db.name);
            });
          });
        }

        if (typeof caches !== "undefined" && caches.keys) {
          caches.keys().then((keys) => {
            keys.forEach((key) => caches.delete(key));
          });
        }
      } catch (e) {
        console.warn("스토리지 정리 중 오류:", e);
      }
    });

    // ✅ 네트워크 추적 활성화
    await this.enableCDPNetwork(page, siteUrl);

    this.browsers.set(uuid, browser);

    // 10초마다 저장
    setInterval(async () => {
      try {
        // ✅ 반드시 유효 페이지 로드 후에만 실행
        const url = page.url();
        if (url.startsWith("http")) {
          const cookies = await page.cookies();
          const localStorage = await page.evaluate(() =>
            JSON.stringify(window.localStorage)
          );
          const sessionStorage = await page.evaluate(() =>
            JSON.stringify(window.sessionStorage)
          );

          await this.fingerprintService.updateSession(uuid, {
            cookies,
            localStorage,
            sessionStorage,
          });

          this.logger.debug(`🧩 세션 저장 완료 (UUID: ${uuid})`);
        }
      } catch (err) {
        this.logger.warn(`세션 저장 실패: ${err}`);
      }
    }, 10_000);

    return { browser, uuid };

}

async reopenBrowser(uuid: string): Promise<Browser> {
const { connect } = require("puppeteer-real-browser");

    // 1. DB에서 fingerprint 불러오기
    const fingerprint = await this.fingerprintService.getFingerprint(uuid);
    if (!fingerprint) {
      throw new Error(`해당 UUID에 대한 Fingerprint 없음: ${uuid}`);
    }

    // 2. 브라우저 실행
    const { browser, page }: { browser: Browser; page: Page } = await connect({
      headless: false,
      executablePath: process.env.CHROME_PATH,
      args: [],
      customConfig: {
        defaultViewport: null,
      },
      turnstile: false,
      connectOption: {
        defaultViewport: {
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
        },
      },
      disableXvfb: false,
      ignoreAllFlags: false,
    });

    // 3. applyFingerprint 적용
    await applyFingerprint(page, fingerprint);

    if (fingerprint.cookies?.length) {
      await page.setCookie(...fingerprint.cookies);
      this.logger.log(`🍪 쿠키 복원 완료`);
    }

    // 🧭 페이지 이동
    await page.goto(fingerprint.siteUrl, { waitUntil: "domcontentloaded" });

    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();

        if (window.indexedDB && indexedDB.databases) {
          indexedDB.databases().then((dbs) => {
            dbs.forEach((db) => {
              if (db.name) indexedDB.deleteDatabase(db.name);
            });
          });
        }

        if (typeof caches !== "undefined" && caches.keys) {
          caches.keys().then((keys) => {
            keys.forEach((key) => caches.delete(key));
          });
        }
      } catch (e) {
        console.warn("스토리지 정리 중 오류:", e);
      }
    });

    // 🧩 Storage 복원 (이제 접근 가능)
    await page.evaluate(
      (local, session) => {
        try {
          const l = JSON.parse(local || "{}");
          for (const k in l) localStorage.setItem(k, l[k]);
        } catch {}
        try {
          const s = JSON.parse(session || "{}");
          for (const k in s) sessionStorage.setItem(k, s[k]);
        } catch {}
      },
      fingerprint.localStorage,
      fingerprint.sessionStorage
    );

    this.logger.log(`♻️ Fingerprint 재적용 브라우저 실행됨 (UUID: ${uuid})`);
    this.browsers.set(uuid, browser);
    const status = await this.getBrowserStatus("uuid");
    console.log(status);
    await this.enableCDPNetwork(page, fingerprint.siteUrl);

    setInterval(async () => {
      try {
        // ✅ 반드시 유효 페이지 로드 후에만 실행
        const url = page.url();
        if (url.startsWith("http")) {
          const cookies = await page.cookies();
          const localStorage = await page.evaluate(() =>
            JSON.stringify(window.localStorage)
          );
          const sessionStorage = await page.evaluate(() =>
            JSON.stringify(window.sessionStorage)
          );

          await this.fingerprintService.updateSession(uuid, {
            cookies,
            localStorage,
            sessionStorage,
          });

          this.logger.debug(`🧩 세션 저장 완료 (UUID: ${uuid})`);
        }
      } catch (err) {
        this.logger.warn(`세션 저장 실패: ${err}`);
      }
    }, 10_000);

    return browser;

}

async getBrowserStatuses(): Promise<
{ uuid: string; isConnected: boolean; tabs: string[] }[]

> {

    const statuses: { uuid: string; isConnected: boolean; tabs: string[] }[] =
      [];

    for (const [uuid, browser] of this.browsers.entries()) {
      const isConnected = browser.isConnected();
      let tabs: string[] = [];

      try {
        const pages = await browser.pages();
        tabs = await Promise.all(pages.map((p) => p.url()));
      } catch (e) {
        tabs = ["탭 정보를 가져올 수 없음"];
      }

      statuses.push({ uuid, isConnected, tabs });
    }

    return statuses;

}

private async getPublicIp(): Promise<string> {
try {
const response = await fetch("https://api.ipify.org?format=json");
const data = await response.json();
return data.ip;
} catch (e) {
this.logger.error("공인 IP 가져오기 실패, 기본 IP 사용", e);
return "1.1.1.1"; // fallback
}
}

async onModuleDestroy() {
this.logger.log("모듈 종료, 브라우저 모두 종료");

    // Map의 values를 배열로 변환 후 map 사용
    const closeTasks = Array.from(this.browsers.values()).map((browser) =>
      browser.close()
    );

    await Promise.all(closeTasks);
    this.browsers.clear();

}

private async enableCDPNetwork(
page: Page,
siteUrl: string
): Promise<CDPSession> {
const cdp = await page.target().createCDPSession();
await cdp.send("Network.enable");

    // 1) 모든 요청(Request)에 대한 이벤트
    cdp.on("Network.requestWillBeSent", (params) => {
      const { request } = params;
      const url = request.url || "";

      if (url.includes("bitmart.com")) {
        console.log(`[BITMART Request] ${url}`);
        this.appendRawLog("BITMART", `[Request] ${url}`);
      } else if (url.includes("lbank.com")) {
        console.log(`[LBANK Request] ${url}`);
        this.appendRawLog("LBANK", `[Request] ${url}`);
      } else if (url.includes("ascendex.com")) {
        console.log(`[ASCENDEX Request] ${url}`);
        this.appendRawLog("ASCENDEX", `[Request] ${url}`);
      } else if (url.includes("orangex.com")) {
        console.log(`[ORANGEX Request] ${url}`);
        this.appendRawLog("ORANGEX", `[Request] ${url}`);
      } else if (url.includes("bydfi.com")) {
        console.log(`[bydfi Request] ${url}`);
        this.appendRawLog("BYDFI", `[Request] ${url}`);
      } else {
        console.log(`[OTHER Request] ${url}`);
        this.appendRawLog("OTHER", `[Request] ${url}`);
      }
    });

    // 2) 모든 응답(Response)에 대한 이벤트
    cdp.on("Network.responseReceived", async (params) => {
      const { response } = params;
      const { url, status, mimeType } = response;

      let exchange:
        | "LBANK"
        | "BITMART"
        | "ASCENDEX"
        | "ORANGEX"
        | "BYDFI"
        | "OTHER" = "OTHER";
      if (url.includes("bitmart.com")) {
        exchange = "BITMART";
      } else if (url.includes("lbank.com")) {
        exchange = "LBANK";
      } else if (url.includes("ascendex.com")) {
        exchange = "ASCENDEX";
      } else if (url.includes("orangex.com")) {
        exchange = "ORANGEX";
      } else if (url.includes("bydfi.com")) {
        exchange = "BYDFI";
      }
      this.appendRawLog(
        exchange,
        `[Response] url: ${url}, status: ${status}, mimeType: ${mimeType}`
      );

      // JSON 응답이면 바디도 저장
      try {
        if (mimeType.includes("application/json")) {
          const responseBody = await cdp.send("Network.getResponseBody", {
            requestId: params.requestId,
          });
          const rawData = responseBody.body || "";
          // 필요하다면 파일에 Raw Body 로깅
          this.appendRawLog(exchange, `[Response Body] ${rawData}`);
        }
      } catch (error) {
        // console.error("응답 바디 조회 중 에러:", error);
      }
    });

    cdp.on("Network.webSocketCreated", (params) => {
      // 필요시 추가 로직 구현
    });

    cdp.on("Network.webSocketFrameReceived", (params) => {
      const { opcode, payloadData } = params.response;
      let rawData = payloadData;
      if (opcode === 2) {
        try {
          rawData = Buffer.from(payloadData, "base64").toString("utf-8");
        } catch (err) {
          console.error("Base64 디코딩 실패:", err);
          return;
        }
      }

      let parsed: WebSocketMessage;
      try {
        parsed = JSON.parse(rawData);
        console.log(parsed);
      } catch {
        // console.log(`JSON 파싱 불가 데이터: ${rawData}`);
        return;
      }

      if (siteUrl.includes("xt.com")) {
        if (parsed.topic !== "ticker" && parsed.topic !== "depth_update") {
          return;
        }
      }
      const unifiedMessage = this.formatMessage(parsed, siteUrl);
      if (unifiedMessage) {
        // this.monitorAndClosePositions();
        this.puppeteerGateway.emit("socketData", unifiedMessage);
      } else {
        // console.log("포맷팅 실패 또는 처리 대상 메시지가 아님:", rawData);
      }
    });

    // fetch 응답 수신 이벤트 등록
    cdp.on("Network.responseReceived", async (params) => {
      await this.handleFetchResponse(cdp, params, siteUrl);
    });

    return cdp;

}

async getBrowserStatus(uuid: string): Promise<{
uuid: string;
isConnected: boolean;
tabs: string[];
} | null> {
const browser = this.browsers.get(uuid);
if (!browser) {
this.logger.warn(
`UUID ${uuid}에 해당하는 브라우저 인스턴스를 찾을 수 없습니다.`
);
return null;
}

    const isConnected = browser.isConnected();
    let tabs: string[] = [];

    try {
      const pages = await browser.pages();
      tabs = await Promise.all(pages.map((p) => p.url()));
    } catch (error) {
      this.logger.error(
        `탭 정보를 가져오는 중 오류 발생 (UUID: ${uuid})`,
        error
      );
      tabs = ["탭 정보를 가져올 수 없음"];
    }

    return { uuid, isConnected, tabs };

}
}

================================================
FILE: backend/src/puppeteer/exchange/bitmart.ts
================================================
import { Page } from "puppeteer-core";
import { TradeOrderData } from "src/interface/elementParse.interface";

export async function clickBitmartOrderButton(
page: Page,
positionSide: "short" | "long"
): Promise<void> {
// 1. Open Long / Open Short 버튼 클릭
const clicked = await page.evaluate((positionSide: string) => {
let expectedText = "";
if (positionSide.toLowerCase() === "long") {
expectedText = "Open Long";
} else if (positionSide.toLowerCase() === "short") {
expectedText = "Open Short";
} else {
throw new Error("Invalid positionSide value");
}

    // 페이지 내 모든 button > span 요소를 검색
    const elements = Array.from(document.querySelectorAll("button span"));
    const targetSpan = elements.find(
      (el) => el.textContent && el.textContent.trim() === expectedText
    );
    if (targetSpan) {
      const parentButton = targetSpan.closest("button");
      if (parentButton) {
        (parentButton as HTMLElement).click();
        return true;
      }
    }
    return false;

}, positionSide);

if (!clicked) {
throw new Error(
`Button with text "${
        positionSide.toLowerCase() === "long" ? "Open Long" : "Open Short"
      }" not found.`
);
}
console.log(`Bitmart ${positionSide.toUpperCase()} 버튼 클릭 완료`);

await page.waitForSelector("div.el-dialog\_\_wrapper[style*='z-index:']", {
visible: true,
timeout: 3000,
});

// 2. 모달 내부에서 Confirm 버튼을 찾아 클릭
const confirmClicked = await page.evaluate(() => {
// 모달 래퍼 선택 (동적 z-index가 설정된 요소)
const modalWrapper = document.querySelector(
"div.el-dialog\_\_wrapper[style*='z-index:']"
);
if (!modalWrapper) return false;

    // 모달 내부의 footer 영역에서 "Confirm" 텍스트가 포함된 primary 버튼을 찾음
    const confirmButton = modalWrapper.querySelector(
      "div.el-dialog__footer button.el-button--primary span"
    );
    if (confirmButton) {
      // 부모 버튼 요소를 찾아 클릭
      const parentButton = confirmButton.closest("button");
      if (parentButton) {
        parentButton.click();
        return true;
      }
    }
    return false;

});

if (!confirmClicked) {
throw new Error("Confirm 버튼을 찾을 수 없습니다.");
}
console.log("Bitmart Confirm 버튼 클릭 완료");
}

export async function bitmartCloseAllPositionsConfirm(
page: Page
): Promise<void> {
// 1. "Close All Positions" 버튼 클릭
const closePositionsClicked = await page.evaluate(() => {
// 모든 button 요소를 가져온 후, 텍스트가 "Close All Positions"인 버튼을 찾음
const buttons: HTMLButtonElement[] = Array.from(
document.querySelectorAll("button")
);
const targetButton = buttons.find(
(btn) => btn.textContent?.trim() === "Close All Positions"
);
if (targetButton) {
targetButton.click();
return true;
}
return false;
});

if (!closePositionsClicked) {
throw new Error("Close All Positions 버튼을 찾을 수 없습니다.");
}
console.log("Close All Positions 버튼 클릭 완료");

// 2. 모달 래퍼(클래스: el-dialog**wrapper, style 속성에 --confirm-modal-width 와 z-index 포함)가 나타날 때까지 대기 (최대 3초)
await page.waitForSelector(
"div.el-dialog**wrapper[style\*='--confirm-modal-width'][style*='z-index:']",
{
visible: true,
timeout: 3000,
}
);
console.log("모달 나타남");

// 3. 모달 내부에서 Confirm 버튼 클릭
const confirmClicked = await page.evaluate(() => {
// 모달 래퍼 선택: 클래스가 el-dialog**wrapper이며, style 속성에 --confirm-modal-width와 z-index가 포함된 요소
const modalWrapper = document.querySelector(
"div.el-dialog**wrapper[style\*='--confirm-modal-width'][style*='z-index:']"
);
if (!modalWrapper) return false;

    // 모달 래퍼 내부의 el-dialog 요소 선택 (동적 클래스 포함)
    const modalDialog = modalWrapper.querySelector("div.el-dialog");
    if (!modalDialog) return false;

    // el-dialog 내부의 모달 본문 선택 (클래스: el-dialog__body)
    const modalBody = modalDialog.querySelector("div.el-dialog__body");
    if (!modalBody) return false;

    // 모달 본문 내의 모든 button 요소 검색
    const buttons: HTMLButtonElement[] = Array.from(
      modalBody.querySelectorAll("button")
    );

    // 각 버튼의 텍스트 또는 자식 span의 텍스트가 "Confirm"인 버튼 찾기
    const confirmButton = buttons.find((btn) => {
      if (btn.textContent?.trim() === "Confirm") {
        return true;
      }
      const spanElement = btn.querySelector("span");
      return spanElement?.textContent?.trim() === "Confirm";
    });

    if (confirmButton) {
      confirmButton.click();
      return true;
    }
    return false;

});

if (!confirmClicked) {
throw new Error("모달 내 Confirm 버튼을 찾을 수 없습니다.");
}
console.log("Confirm 버튼 클릭 완료");
}

/\*\*

- Bitmart의 거래내용을 보여주는 요소(클래스에 "contractOrders" 포함) 내에서
- "숫자/숫자" 형식(예: "2.5756 / 2.5745")의 문자열들을 추출합니다.
-
- @param page Puppeteer의 Page 인스턴스
- @returns Promise<string[]> 추출된 문자열 배열
  _/
  export async function extractNumberSlashNumber(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
  // 클래스 이름에 "contractOrders"가 포함된 첫번째 div 요소를 찾습니다.
  const container = document.querySelector('div[class_="contractOrders"]');
  if (!container) return [];
  const text = (container as HTMLElement).innerText;
  // 숫자(소수점 포함) / 숫자(소수점 포함) 형식을 찾는 정규식 (콤마도 허용)
  const regex = /([\d.,]+)\s*\/\s*([\d.,]+)/g;
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
  // match[0]는 전체 매칭 결과입니다.
  matches.push(match[0].trim());
  }
  return matches;
  });
  }

/\*\*

- Bitmart의 거래내용을 보여주는 요소(클래스에 "contractOrders" 포함) 내에서
- "(정수%)" 형식(예: "(2%)")의 문자열들을 추출합니다.
-
- @param page Puppeteer의 Page 인스턴스
- @returns Promise<string[]> 추출된 문자열 배열
  _/
  export async function extractIntegerPercent(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
  const container = document.querySelector('div[class_="contractOrders"]');
  if (!container) return [];
  const text = (container as HTMLElement).innerText;
  // 여는 괄호, 공백, 선택적 음수 부호, 숫자 및 소수점 숫자, %, 닫는 괄호 패턴
  const regex = /\(\s*(-?[\d]+(?:\.[\d]+)?)%\s*\)/g;
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
  matches.push(match[0].trim());
  }
  return matches;
  });
  }

/\*\*

- Bitmart 페이지에서 진입가, 마켓프라이스, PnL 데이터를 추출합니다.
-
- Bitmart는 거래내용 컨테이너에서 "숫자/숫자" 및 "(정수%)" 형식으로 데이터를 보여주므로,
- 해당 정규식을 사용하여 데이터를 추출합니다.
-
- @param page Puppeteer의 Page 인스턴스
- @returns Promise<PositionData>
  _/
  export async function extractBitmartPositionData(
  page: Page
  ): Promise<TradeOrderData> {
  return await page.evaluate(() => {
  const container = document.querySelector('div[class_="contractOrders"]');
  if (!container) {
  throw new Error("contractOrders 컨테이너를 찾을 수 없습니다.");
  }
  const text = (container as HTMLElement).innerText;

      // "숫자/숫자" 형식에서 진입가와 마켓프라이스 추출
      const priceRegex = /([\d.,]+)\s*\/\s*([\d.,]+)/;
      const priceMatch = priceRegex.exec(text);
      let entryPrice = "";
      let marketPrice = "";
      if (priceMatch) {
        entryPrice = priceMatch[1].trim();
        marketPrice = priceMatch[2].trim();
      }

      // "(정수%)" 형식에서 PnL 추출
      const percentRegex = /\(\s*(-?[\d]+(?:\.[\d]+)?)%\s*\)/;
      const pnlMatch = percentRegex.exec(text);
      const pnl = pnlMatch ? pnlMatch[0].trim() : "";

      return { entryPrice, marketPrice, pnl };

  });
  }

/\*\*

- 주어진 페이지에서 로그인 상태를 확인합니다.
-
- 동적 클래스(예: "opreation-wrapper-next {EDE29V} {BtdnAj} {}")를 가진 div 내부에
- "Get Started" 버튼이 존재하면 비로그인 상태로 판단합니다.
-
- @param page Puppeteer의 Page 인스턴스
- @returns Promise<boolean> 로그인 상태 (true: 로그인 상태, false: 비로그인 상태)
  _/
  export async function isLoggedIn(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
  // 동적 클래스가 포함된 div를 부분 매칭하여 선택합니다.
  const container = document.querySelector(
  'div[class_="opreation-wrapper-next"]'
  );
  if (!container) {
  // 해당 컨테이너가 없으면 로그인 상태로 간주합니다.
  return true;
  }
  // 컨테이너 내부의 모든 버튼을 찾습니다.
  const buttons = container.querySelectorAll("button");
  for (const btn of buttons) {
  if (btn.textContent && btn.textContent.trim() === "Get Started") {
  // "Get Started" 버튼이 있다면 비로그인 상태입니다.
  return false;
  }
  }
  // "Get Started" 버튼이 없으면 로그인 상태입니다.
  return true;
  });
  }

================================================
FILE: backend/src/puppeteer/exchange/lbank.ts
================================================
// src/puppeteer/exchange/lbank.ts
import { Page } from "puppeteer-core";
import { TradeOrderData } from "src/interface/elementParse.interface";

export async function clickOrderboardButton(
page: Page,
positionSide: "short" | "long"
): Promise<void> {
// 1. 주문보드 버튼 클릭
const clicked = await page.evaluate((positionSide: string) => {
let selector = "";
let expectedText = "";

    if (positionSide.toLowerCase() === "long") {
      selector = ".btnOpen span.text";
      expectedText = "Open Long";
    } else if (positionSide.toLowerCase() === "short") {
      selector = ".btnClose span.text";
      expectedText = "Open Short";
    } else {
      throw new Error("Invalid positionSide value");
    }

    const elements = Array.from(document.querySelectorAll(selector));
    const targetElement = elements.find(
      (el) => el.textContent && el.textContent.trim() === expectedText
    );

    if (targetElement) {
      (targetElement as HTMLElement).click();
      return true;
    }
    return false;

}, positionSide);

if (!clicked) {
throw new Error(
`Button with text "${
        positionSide.toLowerCase() === "long" ? "Open Long" : "Open Short"
      }" not found.`
);
}
console.log(`lbank ${positionSide.toUpperCase()} 버튼 클릭 완료`);

// 2. confirm 모달이 생성되는지 대기 (최대 5초)
try {
await page.waitForFunction(
() => {
return document.body.innerText.includes("Order Confirmation");
},
{ timeout: 1000 }
);
console.log("Confirm 모달이 감지되었습니다.");

    // 3. 모달 내 Confirm 버튼 클릭
    const confirmClicked = await page.evaluate(() => {
      const modal = document.querySelector("[class*='lbank-modal-content']");
      if (modal) {
        const confirmBtn = Array.from(modal.querySelectorAll("button")).find(
          (btn) => btn.textContent && btn.textContent.trim() === "Confirm"
        );
        if (confirmBtn) {
          (confirmBtn as HTMLElement).click();
          return true;
        }
      }
      return false;
    });
    if (!confirmClicked) {
      throw new Error("Confirm 버튼을 찾을 수 없습니다.");
    }
    console.log("lbank Confirm 버튼 클릭 완료");

} catch (error) {
// 타임아웃이나 모달이 나타나지 않은 경우 별도 처리 (여기서는 그냥 로그를 남김)
console.warn(
"Confirm 모달이 나타나지 않았습니다. (에러:",
error.message,
")"
);
}
}

/\*\*

- lbank 페이지에서 매도 주문을 실행합니다.
- 순서:
- 1.  ".futures-orders-tabs-toolbar" 내부에서 "MKT close" 버튼 클릭
- 2.  모달이 나타나면 "Confirm" 버튼 클릭
      \*/
      export async function lbankSell(page: Page): Promise<void> {
      // 1. futures-orders-tabs-toolbar 요소 대기
      await page.waitForSelector(".futures-orders-tabs-toolbar", { visible: true });

// "MKT close" 버튼 클릭 (toolbar 내의 span 요소)
const mktCloseClicked = await page.evaluate(() => {
const toolbar = document.querySelector(".futures-orders-tabs-toolbar");
if (toolbar) {
const targetSpan = Array.from(toolbar.querySelectorAll("span")).find(
(span) =>
span.textContent &&
span.textContent.trim().toLowerCase().includes("mkt close")
);
if (targetSpan) {
(targetSpan as HTMLElement).click();
return true;
}
}
return false;
});

if (!mktCloseClicked) {
throw new Error("MKT close 버튼을 찾을 수 없습니다.");
}
console.log("lbank MKT close 버튼 클릭 완료");

// 2. 모달 대기 후 Confirm 버튼 클릭
await page.waitForSelector("[class*='lbank-modal-content']", {
visible: true,
});
console.log("lbank 모달이 나타남");

const confirmClicked = await page.evaluate(() => {
const modal = document.querySelector("[class*='lbank-modal-content']");
if (modal) {
const confirmBtn = Array.from(modal.querySelectorAll("button")).find(
(btn) => btn.textContent && btn.textContent.trim() === "Confirm"
);
if (confirmBtn) {
(confirmBtn as HTMLElement).click();
return true;
}
}
return false;
});

if (!confirmClicked) {
throw new Error("Confirm 버튼을 찾을 수 없습니다.");
}
console.log("lbank Confirm 버튼 클릭 완료");
}

/\*\*

- lbank 페이지에서 롱/숏 레버리지 값을 가져옵니다.
  \*/
  export async function getLeverageValues(
  page: Page
  ): Promise<{ longLeverage: number; shortLeverage: number }> {
  return await page.evaluate(() => {
  const longElement = document.querySelector(
  "div.btn_lever.lever_long span.lbk_up_down_tag.up"
  );
  const shortElement = document.querySelector(
  "div.btn_lever.lever_long span.lbk_up_down_tag.down"
  );

      const parseLeverage = (text: string | null): number => {
        if (!text) return 0;
        const numericString = text.replace(/[^0-9.]/g, "");
        return parseFloat(numericString);
      };

      const longText = longElement
        ? (longElement.textContent?.trim() ?? null)
        : null;
      const shortText = shortElement
        ? (shortElement.textContent?.trim() ?? null)
        : null;

      return {
        longLeverage: parseLeverage(longText),
        shortLeverage: parseLeverage(shortText),
      };

  });
  }

/\*\*

- table-container 클래스를 가진 테이블의 첫번째 table-body-row에서
- Entry Price(3번째 td), Market Price(4번째 td) 및 8번째 td 내부에서 괄호로 시작하는(PnL) 텍스트를 추출합니다.
-
- @param page Puppeteer의 Page 인스턴스
- @returns Promise<{ entryPrice: string; marketPrice: string; pnl: string }>
  \*/
  export async function extractPositionData(
  page: Page
  ): Promise<{ entryPrice: string; marketPrice: string; pnl: string }> {
  return await page.evaluate(() => {
  // table-body-row를 찾습니다.
  const row = document.querySelector("tr.table-body-row");
  if (!row) {
  throw new Error("table-body-row를 찾을 수 없습니다.");
  }
  const cells = Array.from(row.querySelectorAll("td"));
  if (cells.length < 8) {
  throw new Error("필요한 td 셀의 개수가 부족합니다.");
  }

      // Entry Price: 3번째 td (0-based index 2)
      const entryPrice = cells[2].innerText.trim();
      // Market Price: 4번째 td (0-based index 3)
      const marketPrice = cells[3].innerText.trim();

      // 8번째 td (0-based index 7) 내부에서 괄호로 시작하는 텍스트(예: PnL)를 찾습니다.
      let pnl = "";
      const pnlContainer = cells[7];
      // pnlContainer 내의 모든 자식 요소를 순회하면서, 텍스트가 "("로 시작하는 요소를 찾습니다.
      const potentialEls = pnlContainer.querySelectorAll("div, span");
      potentialEls.forEach((el) => {
        const txt = el.textContent?.trim() || "";
        if (txt.startsWith("(")) {
          pnl = txt;
        }
      });

      return { entryPrice, marketPrice, pnl };

  });
  }

/\*\*

- Lbank 페이지에서 진입가, 마켓프라이스, PnL 데이터를 추출합니다.
-
- @param page Puppeteer의 Page 인스턴스
- @returns Promise<PositionData>
  \*/
  export async function extractLbankPositionData(
  page: Page
  ): Promise<TradeOrderData> {
  return await page.evaluate(() => {
  const row = document.querySelector("tr.table-body-row");
  if (!row) {
  throw new Error("table-body-row를 찾을 수 없습니다.");
  }
  const cells = Array.from(row.querySelectorAll("td"));
  if (cells.length < 8) {
  throw new Error("필요한 td 셀의 개수가 부족합니다.");
  }

      const entryPrice = cells[2].innerText.trim(); // 3번째 td
      const marketPrice = cells[3].innerText.trim(); // 4번째 td

      let pnl = "";
      const pnlContainer = cells[7]; // 8번째 td
      const potentialEls = pnlContainer.querySelectorAll("div, span");
      potentialEls.forEach((el) => {
        const txt = el.textContent?.trim() || "";
        if (txt.startsWith("(")) {
          pnl = txt;
        }
      });

      return { entryPrice, marketPrice, pnl };

  });
  }

/\*\*

- Lbank 페이지의 futures_orderboard_content 영역 내에 "Log In / Register" 텍스트를 가진 요소가 있는지 확인하여
- 로그인 상태를 판단합니다.
-
- @param page Puppeteer의 Page 인스턴스
- @returns Promise<boolean> 로그인 상태 (true: 로그인 상태, false: 비로그인 상태)
  _/
  export async function isLbankLoggedIn(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
  // futures_orderboard_content 클래스를 포함하는 컨테이너를 찾습니다.
  const container = document.querySelector(
  'div[class_="futures_orderboard_content"]'
  );
  if (!container) {
  // 컨테이너가 없으면 페이지 구조가 변경된 것으로 간주하고 false 반환
  return false;
  }
  // 컨테이너 내부에서 "Log In / Register" 텍스트를 가진 div 요소를 찾습니다.
  const loginElement = Array.from(container.querySelectorAll("div")).find(
  (el) => el.textContent?.trim() === "Log In / Register"
  );
  // 해당 요소가 있다면 비로그인 상태, 없으면 로그인 상태입니다.
  return loginElement ? false : true;
  });
  }

================================================
FILE: backend/src/puppeteer/interfaces/browser-factory.interface.ts
================================================
/\*
디렉터리 구조

src/
├── puppeteer/
│ ├── dto/
│ ├── interfaces/
│ │ └── browser-factory.interface.ts
│ ├── puppeteer.module.ts
│ ├── puppeteer.service.ts
│ └── puppeteer.service.spec.ts
├── puppeteer-test/
│ └── puppeteer.controller.ts
\*/

// src/puppeteer/interfaces/browser-factory.interface.ts
// export interface BrowserFactory {
// createBrowser(options?: any): Promise<import("puppeteer-core").Browser>;
// }

// // src/app.module.ts (예시)
// import { Module } from "@nestjs/common";
// import { ConfigModule } from "@nestjs/config";
// import { PuppeteerModule } from "./puppeteer/puppeteer.module";
// import { PuppeteerController } from "./puppeteer-test/puppeteer.controller";

// @Module({
// imports: [ConfigModule.forRoot(), PuppeteerModule],
// controllers: [PuppeteerController],
// })
// export class AppModule {}

================================================
FILE: backend/src/types/enumList.ts
================================================
// src/enumList.ts

export enum UserRole {
ADMIN = "admin",
USER = "user",
// 추후 추가할 수 있는 역할들:
// MODERATOR = 'moderator',
// GUEST = 'guest',
}

================================================
FILE: backend/src/types/response.interface.ts
================================================
export interface ErrorResponse {
isSuccess: boolean;
statusCode: number;
message: string | null;
timestamp: string;
path: string;
method: string;
}

export interface SuccessResponse {
isSuccess: boolean;
statusCode: number;
message: string;
timestamp: string;
path: string;
method: string;
data?: any; // 성공 시 반환할 데이터 (옵션)
}

================================================
FILE: backend/src/user/user.controller.spec.ts
================================================
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
let controller: UserController;

beforeEach(async () => {
const module: TestingModule = await Test.createTestingModule({
controllers: [UserController],
providers: [UserService],
}).compile();

    controller = module.get<UserController>(UserController);

});

it('should be defined', () => {
expect(controller).toBeDefined();
});
});

================================================
FILE: backend/src/user/user.controller.ts
================================================
import { Controller, Get, UseGuards, Body, Post } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("user")
export class UserController {
constructor(private userService: UserService) {}

@Get("profile")
@UseGuards(AuthGuard("jwt")) // JWT 인증이 필요함을 설정
async getProfile(@Body("username") username: string) {
return this.userService.findByUsername(username);
}

@Post("/signup")
async signUp(@Body() createUserDto: CreateUserDto) {
return this.userService.signUp(createUserDto);
}
}

================================================
FILE: backend/src/user/user.module.ts
================================================
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

@Module({
imports: [TypeOrmModule.forFeature([User])], // User 엔티티를 리포지토리로 주입 가능하게 설정
controllers: [UserController],
providers: [UserService],
exports: [UserService],
})
export class UserModule {}

================================================
FILE: backend/src/user/user.service.spec.ts
================================================
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
let service: UserService;

beforeEach(async () => {
const module: TestingModule = await Test.createTestingModule({
providers: [UserService],
}).compile();

    service = module.get<UserService>(UserService);

});

it('should be defined', () => {
expect(service).toBeDefined();
});
});

================================================
FILE: backend/src/user/user.service.ts
================================================
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import \* as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
constructor(
@InjectRepository(User)
private readonly userRepository: Repository<User> // InjectRepository를 사용하여 주입
) {}

async signUp(createUserDto: CreateUserDto): Promise<User> {
const { email, password, role } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role: role || "user", // role이 없을 경우 기본값은 'user'
    });

    return await this.userRepository.save(user);

}

async validateUserPassword(
username: string,
password: string
): Promise<User | null> {
const user = await this.findByUsername(username);

    // 사용자 존재 여부 확인
    if (!user) {
      throw new NotFoundException("login fail");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      return user;
    }

    throw new NotFoundException("login fail");

}

async findByUsername(email: string): Promise<User | undefined> {
return await this.userRepository.findOne({ where: { email } });
}

// ID로 사용자 찾기
async findUserById(userId: number): Promise<User> {
const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;

}
}

================================================
FILE: backend/src/user/domain/userDomain.dummy.ts
================================================
[Empty file]

================================================
FILE: backend/src/user/dto/create-user.dto.ts
================================================
import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";

export class CreateUserDto {
@IsString()
@MinLength(3)
username: string;

@IsEmail()
email: string;

@IsString()
@MinLength(6)
password: string;

@IsOptional()
@IsString()
role?: string;
}

================================================
FILE: backend/src/user/dto/update-user.dto.ts
================================================
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {}

================================================
FILE: backend/src/user/entities/user.entity.ts
================================================
import {
Entity,
PrimaryGeneratedColumn,
Column,
CreateDateColumn,
UpdateDateColumn,
BeforeInsert,
} from "typeorm";
import \* as bcrypt from "bcryptjs";
import { UserRole } from "@/types/enumList";

@Entity("users") // 테이블 이름을 'users'로 정의
export class User {
@PrimaryGeneratedColumn()
id: number;

@Column({ unique: true })
email: string;

@Column()
password: string;

@Column({ default: UserRole.USER })
role: string; // 사용자의 역할 (예: 'admin', 'user')

@CreateDateColumn({ name: "created_at", comment: "생성날짜" })
createdAt: Date;

@UpdateDateColumn({ name: "updated_at", comment: "수정날짜" })
updatedAt: Date;
}

================================================
FILE: backend/src/utils/cryptoUtil.ts
================================================
import _ as bcrypt from "bcryptjs";
import _ as jwt from "jsonwebtoken";

export const hashPassword = async (password: string): Promise<string> => {
const salt = await bcrypt.genSalt(10);
return bcrypt.hash(password, salt);
};

export const comparePassword = async (
password: string,
hashedPassword: string
): Promise<boolean> => {
return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (
payload: any,
secret: string,
expiresIn: string = "1h"
): string => {
return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string): any => {
try {
return jwt.verify(token, secret);
} catch (error) {
return null;
}
};

================================================
FILE: backend/src/utils/dateUtil.ts
================================================
import { format } from "date-fns";
import { differenceInDays } from "date-fns";

//현재 날짜 포맷팅
export const formatDate = (
date: Date = new Date(),
dateFormat: string = "yyyy-MM-dd HH:mm:ss"
): string => {
return format(date, dateFormat);
};

export const calculateDateDifference = (date1: Date, date2: Date): number => {
return differenceInDays(date1, date2);
};

================================================
FILE: backend/src/utils/deepClone.ts
================================================
export const deepClone = <T>(obj: T): T => {
return JSON.parse(JSON.stringify(obj));
};

================================================
FILE: backend/src/utils/errorUtil.ts
================================================
//Promise 기반의 함수 실행 시 에러를 핸들링하는 함수입니다.

export const handleAsync = async <T>(
promise: Promise<T>
): Promise<[T | null, any | null]> => {
try {
const result = await promise;
return [result, null];
} catch (error) {
return [null, error];
}
};

//로그 메시지를 포맷팅하는 함수입니다.
export const formatLog = (
message: string,
level: "INFO" | "ERROR" | "DEBUG",
timestamp: Date = new Date()
): string => {
return `[${level}] - ${timestamp.toISOString()}: ${message}`;
};

export const safeExecute =
(fn: Function) =>
(...args: any[]) => {
try {
return fn(...args);
} catch (error) {
console.error("Error:", error);
return null;
}
};

================================================
FILE: backend/src/utils/fileUtil.ts
================================================
import _ as crypto from "crypto";
import _ as fs from "fs";

// 크기 반환
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
if (bytes === 0) return "0 Bytes";
const k = 1024;
const dm = decimals < 0 ? 0 : decimals;
const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
const i = Math.floor(Math.log(bytes) / Math.log(k));
return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

// 확장자 추출
export const getFileExtension = (fileName: string): string => {
return fileName.split(".").pop() || "";
};

// 파일 해시 계산
export const hashFile = (
filePath: string,
algorithm: string = "sha256"
): Promise<string> => {
return new Promise((resolve, reject) => {
const hash = crypto.createHash(algorithm);
const stream = fs.createReadStream(filePath);

    stream.on("data", (data) => hash.update(data));

    stream.on("end", () => resolve(hash.digest("hex")));

    stream.on("error", (err) => reject(err));

});
};

// 해시 검증
export const verifyFileHash = async (
filePath: string,
expectedHash: string,
algorithm: string = "sha256"
): Promise<boolean> => {
const fileHash = await hashFile(filePath, algorithm);
return fileHash === expectedHash;
};

// MIME 타입으로 PDF 여부 확인
export const isPdfByMimeType = (mimeType: string): boolean => {
return mimeType === "application/pdf";
};

// 매직 넘버로 PDF 여부 확인
export const isPdfByMagicNumber = (filePath: string): Promise<boolean> => {
return new Promise((resolve, reject) => {
const stream = fs.createReadStream(filePath, { start: 0, end: 4 });
const pdfSignature = Buffer.from([0x25, 0x50, 0x44, 0x46]); // '%PDF'

    stream.on("data", (chunk) => {
      if (Buffer.isBuffer(chunk) && chunk.slice(0, 4).equals(pdfSignature)) {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    stream.on("error", (err) => reject(err));

});
};

// PDF 파싱 함수 (pdf-parse 사용)
// const pdfParse = require("pdf-parse"); // pdf-parse는 require로 불러오기

// export async function parsePdfToText(pdfBuffer: Buffer): Promise<any> {
// try {
// const data = await pdfParse(pdfBuffer);

// const text = data.text;

// // 등기부등본의 고유번호와 소유지분현황을 파싱하는 로직
// return text;
// } catch (error) {
// throw new Error(`PDF 파싱 실패: ${error.message}`);
// }
// }

// 파싱된 텍스트에서 필요한 데이터 추출

================================================
FILE: backend/src/utils/fingerprintGenerator.ts
================================================
// src/utils/fingerprintGenerator.ts

import { Page } from "puppeteer-core";
import axios from "axios";

interface GeolocationCoordinates {
latitude: number;
longitude: number;
accuracy: number;
altitude: number | null;
altitudeAccuracy: number | null;
heading: number | null;
speed: number | null;
toJSON(): any;
}

interface GeolocationPosition {
coords: GeolocationCoordinates;
timestamp: number;
toJSON(): any;
}

const GPU_DATABASE = {
"Google Inc. (Intel)": [
"ANGLE (Intel, Intel(R) HD Graphics 630 (0x00005912) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (Intel, Intel(R) HD Graphics 630 (0x00005912) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (Intel, Intel(R) UHD Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (Intel, Intel(R) HD Graphics 630 (0x00005912) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (Intel, Intel(R) HD Graphics 630 (0x00005912) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (Intel, Intel(R) HD Graphics 630 (0x00005912) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (Intel, Intel(R) HD Graphics Direct3D11 vs_5_0 ps_5_0)",
"ANGLE (Intel, Intel(R) HD Graphics 530 (0x0000191B) Direct3D11 vs_5_0 ps_5_0, D3D11)",
],
"Google Inc. (NVIDIA)": [
"ANGLE (NVIDIA, NVIDIA GeForce GTX 980 Direct3D11 vs_5_0 ps_5_0)",
"ANGLE (NVIDIA, NVIDIA GeForce GTX 980 Direct3D11 vs_5_0 ps_5_0), or similar",
"ANGLE (NVIDIA, NVIDIA GeForce GTX 750 Ti Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (NVIDIA, NVIDIA GeForce 8800 GTX Direct3D11 vs_4_1 ps_4_1)",
"ANGLE (NVIDIA, NVIDIA GeForce GTX 480 Direct3D11 vs_5_0 ps_5_0)",
"ANGLE (NVIDIA, NVIDIA GeForce GTX 1050 Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (NVIDIA, NVIDIA GeForce GTX 1050 Ti (0x00001C82) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (NVIDIA, NVIDIA GeForce GTX 1060 6GB (0x00001C03) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (NVIDIA, NVIDIA GeForce GTX 1070 (0x00001B81) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (NVIDIA, NVIDIA GeForce RTX 2060 SUPER Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 (0x00002206) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (NVIDIA, NVIDIA GeForce RTX 3080 (0x00002206) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Laptop GPU (0x000028A0) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 (0x00002882) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Ti (0x00002803) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 (0x00002882) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 (0x00002882) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 (0x00002882) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Direct3D11 vs_5_0 ps_5_0, D3D11-32.0.15.5585)",
"ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Direct3D11 vs_5_0 ps_5_0, D3D11-32.0.15.6109)",
"ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Direct3D11 vs_5_0 ps_5_0, D3D11-32.0.15.5599)",
"ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Direct3D11 vs_5_0 ps_5_0, D3D11-32.0.15.6636)",
],
"Google Inc. (AMD)": [
"ANGLE (AMD, ASUS Radeon RX 560 Series (0x000067EF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, Radeon RX 560 Series (0x000067EF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, Radeon RX 560 Series (0x000067EF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, ASUS Radeon RX 560 Series (0x000067EF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001638) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon(TM) Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, Radeon R9 200 Series Direct3D11 vs_5_0 ps_5_0)",
"ANGLE (AMD, Radeon RX 560 Series (0x000067EF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon RX 6500 XT Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon RX 6600 (0x000073FF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon RX 6600 XT (0x000073FF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon RX 6650 XT (navi23 LLVM 15.0.7 DRM 3.54 6.5.0-35-generic), OpenGL 4.6)",
"ANGLE (AMD, AMD Radeon RX 6700 XT (0x000073DF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon RX 6750 XT (0x000073DF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon RX 6800 (0x000073BF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon RX 7700 XT (0x0000747E) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon RX 7900 XT (0x0000744C) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon RX590 GME (0x00006FDF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon Vega 3 Graphics (raven2 LLVM 15.0.7), OpenGL 4.6)",
"ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001506) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001636) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001638) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon(TM) Graphics (0x0000164C) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon(TM) Graphics (0x0000164E) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon(TM) Graphics (0x00001681) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon(TM) Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon(TM) R4 Graphics (0x0000131B) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon(TM) RX 560 Series (0x000067EF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon(TM) RX 560 Series Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, AMD Radeon(TM) Vega 3 Graphics (0x000015D8) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, NAVI24 (navi24 LLVM 15.0.7 DRM 3.54 6.6.26-1-MANJARO), OpenGL 4.6)",
"ANGLE (AMD, Radeon (TM) RX 470 Graphics (0x000067DF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, Radeon HD 3200 Graphics Direct3D11 vs_5_0 ps_5_0), or similar",
"ANGLE (AMD, Radeon HD 5850 Direct3D11 vs_5_0 ps_5_0), or similar",
"ANGLE (AMD, Radeon Instinct MI25 MxGPU (0x0000686C) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, Radeon R9 200 Series Direct3D11 vs_5_0 ps_5_0)",
"ANGLE (AMD, Radeon R9 200 Series Direct3D11 vs_5_0 ps_5_0), or similar",
"ANGLE (AMD, Radeon RX 560 Series (0x000067FF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, Radeon RX 570 Series (0x000067DF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, Radeon RX 580 Series (0x000067DF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, Radeon RX 590 Series (0x000067DF) Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, Radeon RX(TM) RX 460 Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)",
"ANGLE (AMD, Radeon RX550/550 Series Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.14501.18003)",
],
"Google Inc. (Microsoft)": [
"ANGLE (Microsoft, Microsoft Basic Render Driver Direct3D11 vs_5_0 ps_5_0)",
],
};

const USER_AGENTS = [
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6829.66 Safari/537.36",
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.6826.74 Safari/537.36",
//"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.6784.85 Safari/537.36",
//"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 QuarkPC/4.2.5.446",
"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 AVG Secure Browser/120.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.225 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.127 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.2420.81",
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 OPR/109.0.0.0",
// // 추가된 Win32 기반 User-Agent 목록 (Cloudflare 우회 검증됨)
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.92 Safari/537.36",
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.110 Safari/537.36",
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6312.86 Safari/537.36",
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.6481.77 Safari/537.36",
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6532.30 Safari/537.36",
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.6836.78 Safari/537.36",
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.6876.20 Safari/537.36",
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.6962.62 Safari/537.36",
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.6996.101 Safari/537.36",
];

const getRandomCoordinate = (min: number, max: number) => {
return Math.random() \* (max - min) + min;
};

const getRandomSouthKoreaLocation = () => {
return {
latitude: getRandomCoordinate(33.0, 38.6),
longitude: getRandomCoordinate(124.6, 131.9),
};
};

const getLocationFromIP = async (ip: string) => {
try {
const response = await axios.get(`https://ipapi.co/${ip}/json/`);
if (response.status !== 200 || !response.data)
throw new Error("No location data");
return {
latitude: response.data.latitude,
longitude: response.data.longitude,
};
} catch {
return null;
}
};

const getRandomNearbyLocation = (lat: number, lon: number, radiusKm = 3) => {
const R = 6371;
const r = Math.random() _ radiusKm;
const angle = Math.random() _ 2 _ Math.PI;
const dLat = (r / R) _ (180 / Math.PI);
const dLon = ((r / R) _ (180 / Math.PI)) / Math.cos((lat _ Math.PI) / 180);
return {
latitude: lat + dLat _ Math.cos(angle),
longitude: lon + dLon _ Math.sin(angle),
};
};

const getSmartRandomLocation = async (ip: string) => {
const location = await getLocationFromIP(ip);
if (!location) return getRandomSouthKoreaLocation();
return getRandomNearbyLocation(location.latitude, location.longitude);
};

function getRandomGpuVendorAndModel() {
const vendors = Object.keys(GPU_DATABASE);
const vendor = vendors[Math.floor(Math.random() * vendors.length)];
const models = GPU_DATABASE[vendor];
const model = models[Math.floor(Math.random() * models.length)];
return { vendor, model };
}

export async function generateRandomFingerprintForKorea(publicIp: string) {
const { latitude, longitude } = await getSmartRandomLocation(publicIp);
const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
const { vendor, model } = getRandomGpuVendorAndModel();

return {
userAgent,
language: "ko-KR",
languages: ["ko-KR", "ko"],
timezone: "Asia/Seoul",
platform: "Win32",
hardwareConcurrency: [2, 4, 8][Math.floor(Math.random() * 3)],
colorDepth: [24, 30][Math.floor(Math.random() * 2)],
screenResolution: [
{ width: 1920, height: 1080 },
{ width: 1600, height: 900 },
{ width: 1366, height: 768 },
][Math.floor(Math.random() * 3)],
gpuVendor: vendor,
gpuModel: model,
webdriver: false,
latitude,
longitude,
publicIp,
};
}

export async function applyFingerprint(
page: Page,
fingerprint: Awaited<ReturnType<typeof generateRandomFingerprintForKorea>>
) {
await page.setUserAgent(fingerprint.userAgent); // 통과 탈락
await page.setGeolocation({
latitude: fingerprint.latitude,
longitude: fingerprint.longitude,
accuracy: 50,
});
await page.evaluateOnNewDocument((fp) => {
Object.defineProperty(navigator, "language", { get: () => fp.language });
// Object.defineProperty(navigator, "languages", { get: () => fp.languages });
Object.defineProperty(navigator, "platform", { get: () => fp.platform });
Object.defineProperty(navigator, "hardwareConcurrency", {
get: () => fp.hardwareConcurrency,
});
Object.defineProperty(navigator, "webdriver", { get: () => fp.webdriver });
Object.defineProperty(screen, "colorDepth", { get: () => fp.colorDepth });
Object.defineProperty(screen, "width", {
get: () => fp.screenResolution.width,
});
Object.defineProperty(screen, "height", {
get: () => fp.screenResolution.height,
});
const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
WebGLRenderingContext.prototype.getParameter = function (param) {
if (param === 37445) return fp.gpuVendor;
if (param === 37446) return fp.gpuModel;
return originalGetParameter.call(this, param);
};
const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
HTMLCanvasElement.prototype.toDataURL = function (...args) {
const ctx = this.getContext("2d");
ctx.fillStyle = "#f00";
ctx.fillRect(0, 0, 10, 10);
return originalToDataURL.apply(this, args);
};
Object.defineProperty(Intl.DateTimeFormat.prototype, "resolvedOptions", {
value: function () {
return { timeZone: fp.timezone };
},
});
const coords = {
latitude: fp.latitude,
longitude: fp.longitude,
accuracy: 50,
altitude: null,
altitudeAccuracy: null,
heading: null,
speed: null,
toJSON: () => ({
latitude: fp.latitude,
longitude: fp.longitude,
accuracy: 50,
altitude: null,
altitudeAccuracy: null,
heading: null,
speed: null,
}),
};
const position = {
coords,
timestamp: Date.now(),
toJSON: () => ({
coords: coords.toJSON(),
timestamp: Date.now(),
}),
};
const getCurrentPosition = (
success: PositionCallback,
error?: PositionErrorCallback
) => {
success(position as GeolocationPosition);
};
const watchPosition = (
success: PositionCallback,
error?: PositionErrorCallback
) => {
const watchId = Math.floor(Math.random() \* 10000);
success(position as GeolocationPosition);
return watchId;
};

    navigator.geolocation.getCurrentPosition = getCurrentPosition;
    navigator.geolocation.watchPosition = watchPosition;

}, fingerprint);
const cookies = await page.cookies();
if (cookies.length) {
await page.deleteCookie(...cookies);
}
}

================================================
FILE: backend/src/utils/functionalUtil.ts
================================================
import { HttpStatus } from "@nestjs/common";

export type Result<T, E> =
| { isSuccess: true; value: T }
| { isSuccess: false; error: E; statusCode: HttpStatus };

/_
// 사용 예시
const add = (a: number, b: number) => a + b;
const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)); // 3
console.log(curriedAdd(1, 2)); // 3
_/

export const curry = (fn: Function) => {
return (...args: any[]) =>
args.length >= fn.length
? fn(...args)
: (...more: any[]) => curry(fn)(...args, ...more);
};

/_
// 사용 예시
const add1 = (x: number) => x + 1;
const mul2 = (x: number) => x _ 2;

const process = pipe(add1, mul2);
console.log(process(5)); // 12 (5 + 1) _ 2
_/

export const pipe =
(...fns: Function[]) =>
(value: any) =>
fns.reduce((acc, fn) => fn(acc), value);

/_
// 사용 예시
const add1 = (x: number) => x + 1;
const mul2 = (x: number) => x _ 2;

const process = compose(mul2, add1);
console.log(process(5)); // 12 (5 + 1) _ 2
_/

export const compose =
(...fns: Function[]) =>
(value: any) =>
fns.reduceRight((acc, fn) => fn(acc), value);

/_
// 사용 예시
const numbers = [1, 2, 3];
const double = map((x: number) => x _ 2);
console.log(double(numbers)); // [2, 4, 6]
\*/

export const map =
<T, U>(fn: (value: T, index: number, array: T[]) => U) =>
(arr: T[]): U[] =>
arr.map(fn);

/_
// 사용 예시
const numbers = [1, 2, 3, 4, 5];
const isEven = filter((x: number) => x % 2 === 0);
console.log(isEven(numbers)); // [2, 4]
_/

export const filter =
<T>(fn: (value: T, index: number, array: T[]) => boolean) =>
(arr: T[]): T[] =>
arr.filter(fn);

/_
// 사용 예시
const numbers = [1, 2, 3, 4, 5];
const sum = reduce((acc: number, value: number) => acc + value, 0);
console.log(sum(numbers)); // 15
_/

export const reduce =
<T, U>(
fn: (acc: U, value: T, index: number, array: T[]) => U,
initialValue: U
) =>
(arr: T[]): U =>
arr.reduce(fn, initialValue);

/_
// 사용 예시
const slowFunction = (num: number) => {
console.log('Computing...');
return num _ 2;
};

const memoizedFunction = memoize(slowFunction);
console.log(memoizedFunction(5)); // 'Computing...' 출력 후 10
console.log(memoizedFunction(5)); // 10 (캐시 사용)
\*/

export const memoize = (fn: Function) => {
const cache = new Map();
return (...args: any[]) => {
const key = JSON.stringify(args);
if (cache.has(key)) {
return cache.get(key);
}
const result = fn(...args);
cache.set(key, result);
return result;
};
};

/_
// 사용 예시
const numbers = [1, 2, 3, 4, 5, 6];
const [evens, odds] = partition(numbers, (x) => x % 2 === 0);
console.log(evens); // [2, 4, 6]
console.log(odds); // [1, 3, 5]
_/

export const partition = <T>(
arr: T[],
fn: (value: T) => boolean
): [T[], T[]] => {
return arr.reduce(
([pass, fail], elem) => {
return fn(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
},
[[], []] as [T[], T[]]
);
};

/_
// 사용 예시
const users = [{ name: 'John', age: 25 }, { name: 'Jane', age: 30 }];
const names = pluck(users, 'name');
console.log(names); // ['John', 'Jane']
_/

export const pluck = <T, K extends keyof T>(arr: T[], key: K): T[K][] => {
return arr.map((item) => item[key]);
};

/_
// 사용 예시
const logValue = tap((x: number) => console.log(`Logging: ${x}`));
console.log(logValue(5)); // 'Logging: 5' 출력 후 5 반환
_/

export const tap =
<T>(fn: (value: T) => void) =>
(value: T): T => {
fn(value);
return value;
};

/\*
// 사용 예시
const fetchData = async () => {
if (Math.random() > 0.5) throw new Error('Failed');
return 'Success';
};

retry(fetchData, 3)
.then((result) => console.log(result)) // 'Success' 출력
.catch((err) => console.log(err.message)); // 'Failed' 출력
\*/

export const retry = (fn: () => Promise<any>, retries: number) => {
return fn().catch((err) => {
if (retries > 0) {
return retry(fn, retries - 1);
} else {
throw err;
}
});
};

/\*
// 사용 예시
const fetchDataWithDelay = async () => {
await delay(1000);
return 'Data after delay';
};

fetchDataWithDelay().then(console.log); // 1초 후 'Data after delay' 출력
\*/

export const delay = (ms: number) =>
new Promise((resolve) => setTimeout(resolve, ms));

/\*
// 사용 예시
const data = [
{ category: 'fruit', name: 'apple' },
{ category: 'fruit', name: 'banana' },
{ category: 'vegetable', name: 'carrot' },
];

const groupedData = groupBy(data, (item) => item.category);
console.log(groupedData);
// {
// fruit: [{ category: 'fruit', name: 'apple' }, { category: 'fruit', name: 'banana' }],
// vegetable: [{ category: 'vegetable', name: 'carrot' }]
// }
\*/

export const groupBy = <T, K extends keyof any>(
arr: T[],
key: (item: T) => K
): Record<K, T[]> =>
arr.reduce(
(acc, item) => {
const groupKey = key(item);
acc[groupKey] = acc[groupKey] || [];
acc[groupKey].push(item);
return acc;
},
{} as Record<K, T[]>
);

/\*
// 사용 예시
const fetchData1 = async (value: number) => {
await delay(100);
return value + 1;
};

const fetchData2 = async (value: number) => {
await delay(100);
return value \* 2;
};

pipeAsync(fetchData1, fetchData2)(5).then(console.log); // 12 (5 + 1) _ 2
_/

export const pipeAsync =
(...fns: Array<(value: any) => Promise<any>>) =>
(value: any) =>
fns.reduce((acc, fn) => acc.then(fn), Promise.resolve(value));

/\*
// 사용 예시
const fetchData1 = async (value: number) => {
await delay(100);
return value + 1;
};

const fetchData2 = async (value: number) => {
await delay(100);
return value \* 2;
};

composeAsync(fetchData2, fetchData1)(5).then(console.log); // 12 (5 + 1) _ 2
_/

export const composeAsync =
(...fns: Array<(value: any) => Promise<any>>) =>
(value: any) =>
fns.reduceRight((acc, fn) => acc.then(fn), Promise.resolve(value));

export const success = <T>(value: T): Result<T, never> => {
return { isSuccess: true, value };
};

export function failure<E>({
message,
status,
}: {
message: E;
status?: HttpStatus;
}): Result<never, E> {
return {
isSuccess: false,
error: message,
statusCode: status ?? HttpStatus.INTERNAL_SERVER_ERROR,
};
}

================================================
FILE: backend/src/utils/httpUtil.ts
================================================
//URL파라미터 추출
export const getQueryParam = (url: string, param: string): string | null => {
const urlParams = new URLSearchParams(url);
return urlParams.get(param);
};

import { Request } from "express";

export function getClientIp(request: Request): string {
const forwarded = request.headers["x-forwarded-for"] as string;

// 1. x-forwarded-for 헤더에서 IP 추출 (프록시를 거친 경우)
let clientIp = forwarded ? forwarded.split(",")[0].trim() : request.ip;

// 2. IPv4-mapped IPv6 주소 처리 (IPv4 주소가 IPv6 형식으로 전달되는 경우)
if (clientIp.startsWith("::ffff:")) {
clientIp = clientIp.substring(7);
}

// 3. 기본 IP 가져오기 (IPv4 또는 IPv6)
if (!clientIp) {
clientIp = request.connection.remoteAddress || "";
}

// 4. IPv6 주소에서 인터페이스 정보를 제거 (IPv6 주소에 %가 포함된 경우)
const ipv6Index = clientIp.indexOf("%");
if (ipv6Index !== -1) {
clientIp = clientIp.substring(0, ipv6Index);
}

return clientIp;
}

================================================
FILE: backend/src/utils/logUtil.ts
================================================
import { createLogger, format, transports } from "winston";
const DailyRotateFile = require("winston-daily-rotate-file");
const { LogstashTransport } = require("winston-logstash-transport");

export const formatLog = (
message: string,
level: "INFO" | "ERROR" | "DEBUG",
timestamp: Date = new Date()
): string => {
return `[${level}] - ${timestamp.toISOString()}: ${message}`;
};

// 개발 환경 여부 확인
const isDev = process.env.IS_DEV;
const logstashHost = isDev ? "127.0.0.1" : process.env.LOGSTASH_HOST;
const logstashPort = isDev ? process.env.LOGSTASH_PORT : 5044;

// 'isSuccess'가 포함된 메시지를 필터링하는 custom format
const filterIsSuccessLogs = format((info) => {
if (info.message.includes("method") && info.message.includes("url")) {
return false; // 필터링하여 이 로그는 출력하지 않음
}
return info; // 필터링되지 않은 경우, 계속해서 처리
});

// Winston 로그 설정
export const logger = createLogger({
level: "info", // 기본 로그 레벨 설정
format: format.combine(
format.timestamp(),
format.json() // JSON 형식으로 로그 기록
),
transports: [
// 일반 로그 파일 (날짜별 회전)
new DailyRotateFile({
filename: "logs/application-%DATE%.log", // 날짜별 파일 생성
datePattern: "YYYY-MM-DD",
maxSize: "20m",
maxFiles: "14d",
level: "info", // info 이상의 로그를 파일에 저장
}),
// 에러 로그 파일 (에러 전용)
new transports.File({
filename: "logs/error.log",
level: "error", // error 레벨 이상의 로그만 기록
}),
// 콘솔 출력 (명시적 console.log 및 error 로그 처리)
new transports.Console({
level: "error", // error 레벨 이상의 로그만 출력
format: format.combine(
format.colorize(),
format.simple() // 간단한 포맷으로 출력
),
}),
// info 로그 처리 (isSuccess 필터링 이후 출력)
new transports.Console({
level: "info", // info 레벨 이상의 로그만 출력
format: format.combine(
filterIsSuccessLogs(),
format.timestamp(),
format.json() // JSON 형식으로 로그 기록
),
silent: true, // 터미널에 출력하지 않도록 설정
// format: format.combine(
// format.colorize(),
// format.printf(({ level, message, timestamp }) => {
// // 터미널에 출력할 로그 포맷 설정
// return `[${level}] ${timestamp}: ${message} (from console.log)`;
// })
// ),
}),
// Logstash 연동 (개발 환경과 배포 환경 모두)
// new LogstashTransport({
// host: logstashHost,
// port: logstashPort,
// protocol: "tcp",
// level: "info", // info 레벨 이상의 로그는 Logstash로 전송
// handleExceptions: true, // 예외 처리
// onError: (err) => console.error("LogstashTransport error:", err),
// }),
],
});
export function getCallerFunctionName(): string {
const stack = new Error().stack; // 호출 스택 가져오기
if (!stack) return "unknown_function";

const stackLines = stack.split("\n");

// 스택에서 3번째 라인이 호출된 함수의 위치를 나타냄 (Node.js 환경 기준)
// 브라우저 환경에서는 이 인덱스를 조정해야 할 수도 있음
const callerLine = stackLines[3];

if (!callerLine) {
return "unknown_function";
}

// 함수 이름을 추출 (일반적으로 형식은 'at 함수명 (파일 경로)')
const match = callerLine.match(/at\s+(.\*)\s+\(/);

return match ? match[1] : "unknown_function";
}

================================================
FILE: backend/src/utils/objectUtil.ts
================================================
export const deepClone = <T>(obj: T): T => {
return JSON.parse(JSON.stringify(obj));
};

export const removeDuplicates = <T>(arr: T[]): T[] => {
return [...new Set(arr)];
};

export const sortObjectKeys = (
obj: Record<string, any>
): Record<string, any> => {
return Object.keys(obj)
.sort()
.reduce((result: Record<string, any>, key: string) => {
result[key] = obj[key];
return result;
}, {});
};

export const isNullOrUndefined = (value: any): boolean => {
return value === null || value === undefined;
};

================================================
FILE: backend/test/app.e2e-spec.ts
================================================
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import \* as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
let app: INestApplication;

beforeEach(async () => {
const moduleFixture: TestingModule = await Test.createTestingModule({
imports: [AppModule],
}).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

});

it("/ (GET)", () => {
return request(app.getHttpServer())
.get("/")
.expect(200)
.expect("Hello World!");
});
});

================================================
FILE: backend/test/jest-e2e.json
================================================
{
"moduleFileExtensions": ["js", "json", "ts"],
"rootDir": ".",
"testEnvironment": "node",
"testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
}
}
