/*
디렉터리 구조

src/
├── puppeteer/
│   ├── dto/
│   ├── interfaces/
│   │   └── browser-factory.interface.ts
│   ├── puppeteer.module.ts
│   ├── puppeteer.service.ts
│   └── puppeteer.service.spec.ts
├── puppeteer-test/
│   └── puppeteer.controller.ts
*/

// src/puppeteer/interfaces/browser-factory.interface.ts
// export interface BrowserFactory {
//   createBrowser(options?: any): Promise<import("puppeteer-core").Browser>;
// }

// // src/app.module.ts (예시)
// import { Module } from "@nestjs/common";
// import { ConfigModule } from "@nestjs/config";
// import { PuppeteerModule } from "./puppeteer/puppeteer.module";
// import { PuppeteerController } from "./puppeteer-test/puppeteer.controller";

// @Module({
//   imports: [ConfigModule.forRoot(), PuppeteerModule],
//   controllers: [PuppeteerController],
// })
// export class AppModule {}
