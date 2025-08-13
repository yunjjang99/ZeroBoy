import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsObject,
} from "class-validator";
import { PairStatus } from "../entities/trading-pair.entity";
import { Exchange } from "../../enums/enum";

export class CreateTradingPairDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Exchange)
  @IsNotEmpty()
  exchangeA: Exchange;

  @IsEnum(Exchange)
  @IsNotEmpty()
  exchangeB: Exchange;

  @IsOptional()
  @IsString()
  browserAUuid?: string;

  @IsOptional()
  @IsString()
  browserBUuid?: string;

  @IsOptional()
  @IsEnum(PairStatus)
  status?: PairStatus;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  settings?: Record<string, any>;

  @IsOptional()
  @IsObject()
  accountInfoA?: { accountId: string; memo: string };

  @IsOptional()
  @IsObject()
  accountInfoB?: { accountId: string; memo: string };
}
