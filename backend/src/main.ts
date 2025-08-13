import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import { ExpressAdapter } from "@nestjs/platform-express";
import * as express from "express";
import { INestApplication } from "@nestjs/common";
import { AppLogger } from "./app.logger";
import { ResponseInterceptor } from "./common/interceptor/response.interceprot";
async function bootstrap() {
  dotenv.config();

  // 환경 변수 로깅
  console.log("🔧 Environment Configuration:");
  console.log(`   - NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(
    `   - ELECTRON_IS_DEV: ${process.env.ELECTRON_IS_DEV || "false"}`
  );
  console.log(`   - BACKEND_PORT: ${process.env.BACKEND_PORT}`);
  console.log(`   - DB_PATH: ${process.env.DB_PATH}`);
  console.log(`   - NODE_PATH: ${process.env.NODE_PATH}`);
  console.log(
    `   - Resources Path: ${(process as any).resourcesPath || "not set"}`
  );

  const server = express();
  const app = (await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: new AppLogger(), // Winston 커스텀 로거 적용
  })) as INestApplication & express.Application;
  app.use(cookieParser());
  app.enableCors();
  app.set("trust proxy", 1);
  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = process.env.BACKEND_PORT || 7777;
  await app.listen(port);

  console.log(`✅ Application is running on: http://localhost:${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  if ((process as any).resourcesPath) {
    console.log(
      `⚡ Running in Electron environment. Resources path: ${(process as any).resourcesPath}`
    );
  }

  // 시그널 핸들링으로 정상 종료 보장
  const gracefulShutdown = async (signal: string) => {
    console.log(`🔄 Received ${signal}. Starting graceful shutdown...`);

    try {
      await app.close();
      console.log("✅ Application closed successfully");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error during graceful shutdown:", error);
      process.exit(1);
    }
  };

  // 시그널 핸들러 등록
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGUSR2", () => gracefulShutdown("SIGUSR2")); // nodemon용
}

bootstrap();
