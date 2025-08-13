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
  ACTIVE = "active", // 활성되어 코인을 거래중이며 해당 페어의 브라우저가 활성화 되어 있음
  INACTIVE = "inactive", // 코인 거래가 정상적으로 종료되어 비활성되어 코인을 거래중이지 않음
  ERROR = "error", // 비정상적인 오류가 발생하여 거래중지
  WAITING = "waiting", // 두개의 브라우저가 활성화되어 거래소 로그인등의 이유로 코인 거래를 대기중
}

@Entity("trading_pairs")
export class TradingPair {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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

  @Column({ type: "json", nullable: true })
  accountInfoA: { accountId: string; memo: string };

  @Column({ type: "json", nullable: true })
  accountInfoB: { accountId: string; memo: string };

  @OneToMany(() => TradingCoin, (coin) => coin.tradingPair, { cascade: true })
  tradingCoins: TradingCoin[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
