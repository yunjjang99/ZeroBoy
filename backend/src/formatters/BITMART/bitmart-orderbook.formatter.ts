import { UnifiedOrderbook } from "src/interface/messege";
import { Exchange, MarketMessageType } from "src/interface/enum";
import { OrderbookFormatter } from "src/interface/formatter.interface";

export class BitmartOrderbookFormatter implements OrderbookFormatter {
  private readonly defaultSymbol = "BTCUSDT";

  // bid(way=1)와 ask(way=2) 데이터를 내부에 저장하여 통합합니다.
  private lastBids: {
    depths: Array<{ price: number; vol: number }>;
    ms_t: number;
  } | null = null;
  private lastAsks: {
    depths: Array<{ price: number; vol: number }>;
    ms_t: number;
  } | null = null;

  /**
   * Bitmart Order Book 메시지 예시 (bid side):
   * {
   *   data: {
   *     way: 1,
   *     depths: [ { "price": "96999.7", "vol": "496" }, ... ]
   *   },
   *   group: "Depth:1",
   *   uuid: 3565685442,
   *   ms_t: 1739528825696
   * }
   *
   * Bitmart Order Book 메시지 예시 (ask side):
   * {
   *   data: {
   *     way: 2,
   *     depths: [ { "price": "97000.1", "vol": "210" }, ... ]
   *   },
   *   group: "Depth:1",
   *   uuid: 3565685428,
   *   ms_t: 1739528825695
   * }
   *
   * 포매터는 bid와 ask 메시지가 모두 수신된 경우,
   * 각각의 최고호가를 기준으로 중앙값(currentPrice)과 타임스탬프를 계산하여 UnifiedOrderbook으로 변환합니다.
   */
  format(message: any): UnifiedOrderbook | null {
    if (!message || !message.data || message.ms_t === undefined) {
      return null;
    }
    const data = message.data;
    const way = data.way;
    if (!data.depths || !Array.isArray(data.depths)) {
      return null;
    }
    // 문자열 데이터를 숫자로 변환
    const parsedDepths = data.depths.map((item: any) => ({
      price: parseFloat(item.price),
      vol: parseFloat(item.vol),
    }));

    if (way === 1) {
      // bid side: 내림차순 정렬 (최고가가 첫 번째)
      parsedDepths.sort((a, b) => b.price - a.price);
      this.lastBids = { depths: parsedDepths, ms_t: message.ms_t };
    } else if (way === 2) {
      // ask side: 오름차순 정렬 (최저가가 첫 번째)
      parsedDepths.sort((a, b) => a.price - b.price);
      this.lastAsks = { depths: parsedDepths, ms_t: message.ms_t };
    } else {
      return null;
    }

    // bid와 ask 데이터 모두 존재할 때 UnifiedOrderbook 객체 생성
    if (this.lastBids && this.lastAsks) {
      const bestBid = this.lastBids.depths[0];
      const bestAsk = this.lastAsks.depths[0];
      if (!bestBid || !bestAsk) return null;
      const currentPrice = (bestBid.price + bestAsk.price) / 2;
      // 두 메시지 중 최신 ms_t를 타임스탬프로 사용
      const timestamp = new Date(
        Math.max(this.lastBids.ms_t, this.lastAsks.ms_t)
      ).toISOString();

      return {
        exchange: Exchange.BITMART,
        symbol: this.defaultSymbol,
        type: MarketMessageType.ORDERBOOK,
        bestBidPrice: bestBid.price,
        bestBidVolume: bestBid.vol,
        bestAskPrice: bestAsk.price,
        bestAskVolume: bestAsk.vol,
        currentPrice,
        timestamp,
      };
    }

    return null;
  }
}
