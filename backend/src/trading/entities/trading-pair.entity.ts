import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { TradingCoin } from "./trading-coin.entity";

export enum PairStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ERROR = "error",
  WAITING = "waiting",
}

@Entity("trading_pairs")
export class TradingPair {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50, unique: true })
  name: string;

  @Column({ type: "varchar", length: 100 })
  description: string;

  @Column({ type: "varchar", length: 50 })
  exchangeA: string;

  @Column({ type: "varchar", length: 50 })
  exchangeB: string;

  @Column({ type: "varchar", length: 36, nullable: true })
  browserAUuid: string;

  @Column({ type: "varchar", length: 36, nullable: true })
  browserBUuid: string;

  @Column({ type: "varchar", length: 20, default: PairStatus.INACTIVE })
  status: PairStatus;

  @Column({ type: "boolean", default: false })
  isActive: boolean;

  @Column({ type: "datetime", nullable: true })
  lastActiveAt: Date;

  @Column({ type: "json", nullable: true })
  settings: Record<string, any>;



  @OneToMany(() => TradingCoin, (coin) => coin.tradingPair, { cascade: true })
  tradingCoins: TradingCoin[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
