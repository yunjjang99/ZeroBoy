import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
} from "class-validator";
import { PositionType } from "../entities/trading-coin.entity";
import { Exchange } from "../../enums/enum";

export class CreateTradingCoinDto {
  @IsString()
  @IsNotEmpty()
  tradingPairId: string;

  @IsString()
  @IsNotEmpty()
  symbol: string;

  @IsEnum(Exchange)
  @IsNotEmpty()
  exchange: Exchange;

  @IsEnum(PositionType)
  positionType: PositionType;

  @IsNumber()
  entryPrice: number;

  @IsNumber()
  currentPrice: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  leverage: number;

  @IsOptional()
  @IsNumber()
  roi?: number;

  @IsOptional()
  @IsNumber()
  unrealizedPnl?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  metadata?: Record<string, any>;
}
