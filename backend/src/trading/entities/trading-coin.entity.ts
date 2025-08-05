import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { TradingPair } from "./trading-pair.entity";

export enum PositionType {
  LONG = "long",
  SHORT = "short",
}

@Entity("trading_coins")
export class TradingCoin {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 36 })
  tradingPairId: string;

  @ManyToOne(() => TradingPair, (pair) => pair.tradingCoins, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "tradingPairId" })
  tradingPair: TradingPair;

  @Column({ type: "varchar", length: 20 })
  symbol: string;

  @Column({ type: "varchar", length: 50 })
  exchange: string;

  @Column({ type: "varchar", length: 10 })
  positionType: PositionType;

  @Column({ type: "decimal", precision: 20, scale: 8 })
  entryPrice: number;

  @Column({ type: "decimal", precision: 20, scale: 8 })
  currentPrice: number;

  @Column({ type: "decimal", precision: 20, scale: 8 })
  quantity: number;

  @Column({ type: "int" })
  leverage: number;

  @Column({ type: "decimal", precision: 10, scale: 4, default: 0 })
  roi: number;

  @Column({ type: "decimal", precision: 20, scale: 8, default: 0 })
  unrealizedPnl: number;

  @Column({ type: "datetime" })
  priceUpdatedAt: Date;

  @Column({ type: "boolean", default: false })
  isActive: boolean;

  @Column({ type: "json", nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
