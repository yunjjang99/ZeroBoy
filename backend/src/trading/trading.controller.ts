import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { TradingService } from "./trading.service";
import { CreateTradingPairDto } from "./dto/create-trading-pair.dto";
import { CreateTradingCoinDto } from "./dto/create-trading-coin.dto";
import { TradingPair } from "./entities/trading-pair.entity";
import { TradingCoin } from "./entities/trading-coin.entity";
import { success } from "@/utils/functionalUtil";

@Controller("trading")
export class TradingController {
  constructor(private readonly tradingService: TradingService) {}

  // 거래 페어 생성
  @Post("pairs")
  async createTradingPair(
    @Body() createDto: CreateTradingPairDto
  ): Promise<TradingPair> {
    return await this.tradingService.createTradingPair(createDto);
  }

  // 모든 거래 페어 조회
  @Get("pairs")
  async getAllTradingPairs(): Promise<TradingPair[]> {
    return await this.tradingService.getAllTradingPairs();
  }

  // pair 정보와 함께 브라우저 프로필 조회
  @Get("pairs/with-browser-profiles")
  async getTradingPairsWithBrowserProfiles() {
    const data = await this.tradingService.getTradingPairsWithBrowserProfiles();
    return success(data);
  }

  // 거래 페어 복구
  @Post("pairs/recover")
  async recoverTradingPairs(): Promise<TradingPair[]> {
    return await this.tradingService.recoverTradingPairs();
  }

  // 브라우저 쌍과 거래 페어를 한 번에 생성
  @Post("pairs/with-browsers")
  async createTradingPairWithBrowsers(
    @Body()
    body: {
      createDto: CreateTradingPairDto;
      exchangeAUrl: string;
      exchangeBUrl: string;
      accountInfo?: Record<string, { accountId: string; memo: string }>;
    }
  ): Promise<TradingPair> {
    return await this.tradingService.createTradingPairWithBrowsers(
      body.createDto,
      body.exchangeAUrl,
      body.exchangeBUrl,
      body.accountInfo
    );
  }

  // 거래 페어 ID로 조회
  @Get("pairs/:id")
  async getTradingPairById(@Param("id") id: string): Promise<TradingPair> {
    return await this.tradingService.getTradingPairById(id);
  }

  // 거래 페어 업데이트
  @Put("pairs/:id")
  async updateTradingPair(
    @Param("id") id: string,
    @Body() updateData: Partial<TradingPair>
  ): Promise<TradingPair> {
    return await this.tradingService.updateTradingPair(id, updateData);
  }

  // 거래 페어 삭제
  @Delete("pairs/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTradingPair(@Param("id") id: string): Promise<void> {
    return await this.tradingService.deleteTradingPair(id);
  }

  // 거래 페어 활성화 (브라우저 쌍 생성)
  @Post("pairs/:id/activate")
  async activateTradingPair(
    @Param("id") id: string,
    @Body()
    body: {
      exchangeAUrl: string;
      exchangeBUrl: string;
      accountInfo?: Record<string, { accountId: string; memo: string }>;
    }
  ): Promise<TradingPair> {
    return await this.tradingService.activateTradingPair(
      id,
      body.exchangeAUrl,
      body.exchangeBUrl,
      body.accountInfo
    );
  }

  // 거래 페어 비활성화 (브라우저 쌍 종료)
  @Post("pairs/:id/deactivate")
  async deactivateTradingPair(@Param("id") id: string): Promise<TradingPair> {
    return await this.tradingService.deactivateTradingPair(id);
  }

  // 거래 코인 생성
  @Post("coins")
  async createTradingCoin(
    @Body() createDto: CreateTradingCoinDto
  ): Promise<TradingCoin> {
    return await this.tradingService.createTradingCoin(createDto);
  }

  // 거래 페어의 모든 코인 조회
  @Get("pairs/:pairId/coins")
  async getTradingCoinsByPairId(
    @Param("pairId") pairId: string
  ): Promise<TradingCoin[]> {
    return await this.tradingService.getTradingCoinsByPairId(pairId);
  }

  // 거래 코인 업데이트
  @Put("coins/:id")
  async updateTradingCoin(
    @Param("id") id: string,
    @Body() updateData: Partial<TradingCoin>
  ): Promise<TradingCoin> {
    return await this.tradingService.updateTradingCoin(id, updateData);
  }

  // 거래 코인 삭제
  @Delete("coins/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTradingCoin(@Param("id") id: string): Promise<void> {
    return await this.tradingService.deleteTradingCoin(id);
  }

  // 가격 업데이트
  @Put("coins/:id/price")
  async updateCoinPrice(
    @Param("id") id: string,
    @Body() body: { currentPrice: number }
  ): Promise<TradingCoin> {
    return await this.tradingService.updateCoinPrice(id, body.currentPrice);
  }

  // 앱 시작 시 활성화된 페어 자동 복구
  @Post("pairs/auto-recover")
  async autoRecoverActivePairs() {
    const result = await this.tradingService.autoRecoverActivePairs();
    return success(result);
  }
}
