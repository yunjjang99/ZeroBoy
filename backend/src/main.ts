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

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  if ((process as any).resourcesPath) {
    console.log(
      `Running in Electron environment. Resources path: ${(process as any).resourcesPath}`
    );
  }
}

bootstrap();
