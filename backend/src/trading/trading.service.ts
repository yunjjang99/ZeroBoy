import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TradingPair, PairStatus } from "./entities/trading-pair.entity";
import { TradingCoin, PositionType } from "./entities/trading-coin.entity";
import { CreateTradingPairDto } from "./dto/create-trading-pair.dto";
import { CreateTradingCoinDto } from "./dto/create-trading-coin.dto";
import { PuppeteerService } from "../puppeteer/puppeteer.service";
import { Exchange } from "../enums/enum";

@Injectable()
export class TradingService {
  constructor(
    @InjectRepository(TradingPair)
    private tradingPairRepository: Repository<TradingPair>,
    @InjectRepository(TradingCoin)
    private tradingCoinRepository: Repository<TradingCoin>,
    private puppeteerService: PuppeteerService
  ) {}

  // 거래 페어 생성
  async createTradingPair(
    createDto: CreateTradingPairDto
  ): Promise<TradingPair> {
    const tradingPair = this.tradingPairRepository.create(createDto);
    return await this.tradingPairRepository.save(tradingPair);
  }

  // 모든 거래 페어 조회
  async getAllTradingPairs(): Promise<TradingPair[]> {
    return await this.tradingPairRepository.find({
      relations: ["tradingCoins"],
      order: { createdAt: "DESC" },
    });
  }

  // 거래 페어 ID로 조회
  async getTradingPairById(id: string): Promise<TradingPair> {
    const tradingPair = await this.tradingPairRepository.findOne({
      where: { id },
      relations: ["tradingCoins"],
    });

    if (!tradingPair) {
      throw new NotFoundException(`Trading pair with ID ${id} not found`);
    }

    return tradingPair;
  }

  // 거래 페어 업데이트
  async updateTradingPair(
    id: string,
    updateData: Partial<TradingPair>
  ): Promise<TradingPair> {
    await this.tradingPairRepository.update(id, updateData);
    return await this.getTradingPairById(id);
  }

  // 거래 페어 삭제
  async deleteTradingPair(id: string): Promise<void> {
    const result = await this.tradingPairRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Trading pair with ID ${id} not found`);
    }
  }

  // 거래 코인 생성
  async createTradingCoin(
    createDto: CreateTradingCoinDto
  ): Promise<TradingCoin> {
    const tradingCoin = this.tradingCoinRepository.create({
      ...createDto,
      priceUpdatedAt: new Date(),
    });
    return await this.tradingCoinRepository.save(tradingCoin);
  }

  // 거래 페어의 모든 코인 조회
  async getTradingCoinsByPairId(pairId: string): Promise<TradingCoin[]> {
    return await this.tradingCoinRepository.find({
      where: { tradingPairId: pairId },
      order: { createdAt: "DESC" },
    });
  }

  // 거래 코인 업데이트
  async updateTradingCoin(
    id: string,
    updateData: Partial<TradingCoin>
  ): Promise<TradingCoin> {
    await this.tradingCoinRepository.update(id, {
      ...updateData,
      priceUpdatedAt: new Date(),
    });

    const tradingCoin = await this.tradingCoinRepository.findOne({
      where: { id },
    });
    if (!tradingCoin) {
      throw new NotFoundException(`Trading coin with ID ${id} not found`);
    }

    return tradingCoin;
  }

  // 거래 코인 삭제
  async deleteTradingCoin(id: string): Promise<void> {
    const result = await this.tradingCoinRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Trading coin with ID ${id} not found`);
    }
  }

  // 브라우저 쌍으로 거래 페어 복구
  async recoverTradingPairs(): Promise<TradingPair[]> {
    const pairs = await this.tradingPairRepository.find({
      where: { isActive: true },
      relations: ["tradingCoins"],
    });

    const recoveredPairs: TradingPair[] = [];

    for (const pair of pairs) {
      try {
        // 브라우저 A 복구
        if (pair.browserAUuid) {
          const browserA = await this.puppeteerService.reopenBrowser(
            pair.browserAUuid
          );
          if (browserA) {
            console.log(
              `Recovered browser A for pair ${pair.id}: ${pair.browserAUuid}`
            );
          }
        }

        // 브라우저 B 복구
        if (pair.browserBUuid) {
          const browserB = await this.puppeteerService.reopenBrowser(
            pair.browserBUuid
          );
          if (browserB) {
            console.log(
              `Recovered browser B for pair ${pair.id}: ${pair.browserBUuid}`
            );
          }
        }

        // 페어 상태 업데이트
        await this.updateTradingPair(pair.id, {
          status: PairStatus.ACTIVE,
          lastActiveAt: new Date(),
        });

        recoveredPairs.push(pair);
      } catch (error) {
        console.error(`Failed to recover trading pair ${pair.id}:`, error);

        // 복구 실패 시 상태를 ERROR로 변경
        await this.updateTradingPair(pair.id, {
          status: PairStatus.ERROR,
        });
      }
    }

    return recoveredPairs;
  }

  // 거래 페어 활성화 (브라우저 쌍 생성)
  async activateTradingPair(
    id: string,
    exchangeAUrl: string,
    exchangeBUrl: string,
    accountInfo?: Record<string, { accountId: string; memo: string }>
  ): Promise<TradingPair> {
    const tradingPair = await this.getTradingPairById(id);

    try {
      // 기존 활성 페어들을 모두 비활성화
      await this.deactivateAllActivePairs();

      // accountInfo 키 매핑 (거래소 이름 -> Exchange enum)
      const exchangeNameMapping: Record<string, string> = {
        OrangeX: "orangex",
        Bydfi: "bydfi",
        Binance: "binance",
        ORANGEX: "orangex",
        BYDFI: "bydfi",
        BINANCE: "binance",
      };

      // 브라우저 A 생성 (계정 정보 포함)
      const browserA = await this.puppeteerService.createBrowser(
        exchangeAUrl,
        accountInfo?.[
          exchangeNameMapping[tradingPair.exchangeA] || tradingPair.exchangeA
        ],
        tradingPair.exchangeA
      );

      // 브라우저 B 생성 (계정 정보 포함)
      const browserB = await this.puppeteerService.createBrowser(
        exchangeBUrl,
        accountInfo?.[
          exchangeNameMapping[tradingPair.exchangeB] || tradingPair.exchangeB
        ],
        tradingPair.exchangeB
      );

      // 거래 페어 업데이트
      const updatedPair = await this.updateTradingPair(id, {
        browserAUuid: browserA.uuid,
        browserBUuid: browserB.uuid,
        status: PairStatus.ACTIVE,
        isActive: true,
        lastActiveAt: new Date(),
      });

      return updatedPair;
    } catch (error) {
      // 실패 시 상태를 ERROR로 변경
      await this.updateTradingPair(id, {
        status: PairStatus.ERROR,
      });
      throw error;
    }
  }

  // 거래 페어 비활성화 (브라우저 쌍 종료)
  async deactivateTradingPair(id: string): Promise<TradingPair> {
    const tradingPair = await this.getTradingPairById(id);

    try {
      // 브라우저 A 종료
      if (tradingPair.browserAUuid) {
        const browserA = this.puppeteerService["browsers"].get(
          tradingPair.browserAUuid
        );
        if (browserA) {
          await browserA.close();
          this.puppeteerService["browsers"].delete(tradingPair.browserAUuid);
        }
      }

      // 브라우저 B 종료
      if (tradingPair.browserBUuid) {
        const browserB = this.puppeteerService["browsers"].get(
          tradingPair.browserBUuid
        );
        if (browserB) {
          await browserB.close();
          this.puppeteerService["browsers"].delete(tradingPair.browserBUuid);
        }
      }

      // 거래 페어 업데이트
      const updatedPair = await this.updateTradingPair(id, {
        browserAUuid: null,
        browserBUuid: null,
        status: PairStatus.INACTIVE,
        isActive: false,
      });

      return updatedPair;
    } catch (error) {
      console.error(`Failed to deactivate trading pair ${id}:`, error);
      throw error;
    }
  }

  // 가격 업데이트 (실시간 데이터)
  async updateCoinPrice(
    coinId: string,
    currentPrice: number
  ): Promise<TradingCoin> {
    const coin = await this.tradingCoinRepository.findOne({
      where: { id: coinId },
    });
    if (!coin) {
      throw new NotFoundException(`Trading coin with ID ${coinId} not found`);
    }

    // ROI 계산
    const roi = ((currentPrice - coin.entryPrice) / coin.entryPrice) * 100;

    // 미실현 손익 계산
    const priceDiff = currentPrice - coin.entryPrice;
    const unrealizedPnl =
      coin.positionType === PositionType.LONG
        ? priceDiff * coin.quantity * coin.leverage
        : -priceDiff * coin.quantity * coin.leverage;

    return await this.updateTradingCoin(coinId, {
      currentPrice,
      roi,
      unrealizedPnl,
    });
  }

  // 브라우저 쌍과 거래 페어를 한 번에 생성
  async createTradingPairWithBrowsers(
    createDto: CreateTradingPairDto,
    exchangeAUrl: string,
    exchangeBUrl: string,
    accountInfo?: Record<string, { accountId: string; memo: string }>
  ): Promise<TradingPair> {
    try {
      // 기존 활성 페어들을 모두 비활성화
      await this.deactivateAllActivePairs();

      // accountInfo 키 매핑 (거래소 이름 -> Exchange enum)
      const exchangeNameMapping: Record<string, string> = {
        OrangeX: "orangex",
        Bydfi: "bydfi",
        Binance: "binance",
        ORANGEX: "orangex",
        BYDFI: "bydfi",
        BINANCE: "binance",
      };

      // 브라우저 A 생성 (계정 정보 포함)
      const browserA = await this.puppeteerService.createBrowser(
        exchangeAUrl,
        accountInfo?.[
          exchangeNameMapping[createDto.exchangeA] || createDto.exchangeA
        ],
        createDto.exchangeA
      );

      // 브라우저 B 생성 (계정 정보 포함)
      const browserB = await this.puppeteerService.createBrowser(
        exchangeBUrl,
        accountInfo?.[
          exchangeNameMapping[createDto.exchangeB] || createDto.exchangeB
        ],
        createDto.exchangeB
      );

      // 거래 페어 데이터 생성
      const tradingPairData = {
        ...createDto,
        browserAUuid: browserA.uuid,
        browserBUuid: browserB.uuid,
        status: PairStatus.ACTIVE,
        isActive: true,
        lastActiveAt: new Date(),
      };

      const tradingPair = this.tradingPairRepository.create(tradingPairData);
      return await this.tradingPairRepository.save(tradingPair);
    } catch (error) {
      // 실패 시 생성된 브라우저들을 정리
      console.error(
        `Failed to create trading pair with browsers: ${error.message}`
      );
      throw error;
    }
  }

  // pair 정보와 함께 브라우저 프로필 조회
  async getTradingPairsWithBrowserProfiles(): Promise<
    {
      pairId: string;
      pairName: string;
      exchangeA: Exchange;
      exchangeB: Exchange;
      status: string;
      createdAt: string;
      browserA?: {
        uuid: string;
        siteUrl: string;
        exchange: string;
        accountInfo?: { accountId: string; memo: string };
        isActive: boolean;
        lastActiveAt?: string;
      };
      browserB?: {
        uuid: string;
        siteUrl: string;
        exchange: string;
        accountInfo?: { accountId: string; memo: string };
        isActive: boolean;
        lastActiveAt?: string;
      };
    }[]
  > {
    const pairs = await this.tradingPairRepository.find({
      where: { isActive: true },
      order: { createdAt: "DESC" },
    });

    const result = [];

    for (const pair of pairs) {
      let browserA = null;
      let browserB = null;

      // 브라우저 A 정보 조회
      if (pair.browserAUuid) {
        const fingerprintA = await this.puppeteerService[
          "fingerprintService"
        ].getFingerprint(pair.browserAUuid);
        if (fingerprintA) {
          browserA = {
            uuid: fingerprintA.uuid,
            siteUrl: fingerprintA.siteUrl,
            exchange: fingerprintA.exchange || pair.exchangeA,
            accountInfo: fingerprintA.accountInfo,
            isActive: fingerprintA.isActive,
            lastActiveAt: fingerprintA.lastActiveAt?.toISOString(),
          };
        }
      }

      // 브라우저 B 정보 조회
      if (pair.browserBUuid) {
        const fingerprintB = await this.puppeteerService[
          "fingerprintService"
        ].getFingerprint(pair.browserBUuid);
        if (fingerprintB) {
          browserB = {
            uuid: fingerprintB.uuid,
            siteUrl: fingerprintB.siteUrl,
            exchange: fingerprintB.exchange || pair.exchangeB,
            accountInfo: fingerprintB.accountInfo,
            isActive: fingerprintB.isActive,
            lastActiveAt: fingerprintB.lastActiveAt?.toISOString(),
          };
        }
      }

      result.push({
        pairId: pair.id,
        pairName: pair.name,
        exchangeA: pair.exchangeA,
        exchangeB: pair.exchangeB,
        status: pair.status,
        createdAt: pair.createdAt.toISOString(),
        browserA,
        browserB,
      });
    }

    return result;
  }

  // 기존 활성 페어들을 모두 비활성화
  async deactivateAllActivePairs(): Promise<void> {
    const activePairs = await this.tradingPairRepository.find({
      where: { isActive: true, status: PairStatus.ACTIVE },
    });

    for (const pair of activePairs) {
      try {
        // 브라우저 A 종료
        if (pair.browserAUuid) {
          const browserA = this.puppeteerService["browsers"].get(
            pair.browserAUuid
          );
          if (browserA) {
            await browserA.close();
            this.puppeteerService["browsers"].delete(pair.browserAUuid);
          }
        }

        // 브라우저 B 종료
        if (pair.browserBUuid) {
          const browserB = this.puppeteerService["browsers"].get(
            pair.browserBUuid
          );
          if (browserB) {
            await browserB.close();
            this.puppeteerService["browsers"].delete(pair.browserBUuid);
          }
        }

        // 페어 상태 업데이트
        await this.updateTradingPair(pair.id, {
          browserAUuid: null,
          browserBUuid: null,
          status: PairStatus.INACTIVE,
          isActive: false,
        });
      } catch (error) {
        console.error(`Failed to deactivate pair ${pair.id}:`, error);
      }
    }
  }

  // 앱 시작 시 활성화된 페어 자동 복구
  async autoRecoverActivePairs(): Promise<{
    recoveredPairs: TradingPair[];
    totalActivePairs: number;
  }> {
    const activePairs = await this.tradingPairRepository.find({
      where: {
        isActive: true,
        status: PairStatus.ACTIVE,
      },
      order: { createdAt: "DESC" },
    });

    const recoveredPairs: TradingPair[] = [];

    for (const pair of activePairs) {
      try {
        // 브라우저 A 복구
        if (pair.browserAUuid) {
          const browserA = await this.puppeteerService.reopenBrowser(
            pair.browserAUuid
          );
          if (!browserA.isAlreadyRunning) {
            console.log(
              `Browser A reopened for pair ${pair.id}: ${browserA.title}`
            );
          }
        }

        // 브라우저 B 복구
        if (pair.browserBUuid) {
          const browserB = await this.puppeteerService.reopenBrowser(
            pair.browserBUuid
          );
          if (!browserB.isAlreadyRunning) {
            console.log(
              `Browser B reopened for pair ${pair.id}: ${browserB.title}`
            );
          }
        }

        // 페어 상태 업데이트
        await this.updateTradingPair(pair.id, {
          status: PairStatus.ACTIVE,
          lastActiveAt: new Date(),
        });

        recoveredPairs.push(pair);
      } catch (error) {
        console.error(`Failed to recover trading pair ${pair.id}:`, error);

        // 복구 실패 시 상태를 ERROR로 변경
        await this.updateTradingPair(pair.id, {
          status: PairStatus.ERROR,
        });
      }
    }

    return {
      recoveredPairs,
      totalActivePairs: activePairs.length,
    };
  }
}
