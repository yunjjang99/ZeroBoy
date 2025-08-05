import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TradingController } from "./trading.controller";
import { TradingService } from "./trading.service";
import { TradingPair } from "./entities/trading-pair.entity";
import { TradingCoin } from "./entities/trading-coin.entity";
import { PuppeteerModule } from "../puppeteer/puppeteer.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([TradingPair, TradingCoin]),
    PuppeteerModule,
  ],
  controllers: [TradingController],
  providers: [TradingService],
  exports: [TradingService],
})
export class TradingModule {}
