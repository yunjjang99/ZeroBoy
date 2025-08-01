import { Exchange, MarketMessageType } from "src/interface/enum";
import { OrderbookFormatter } from "src/interface/formatter.interface";
import { UnifiedOrderbook } from "src/interface/messege";

export class XTOrderbookFormatter implements OrderbookFormatter {
  /**
   * XT Depth Update 메시지 예시:
   * {
   *   topic: "depth_update",
   *   event: "depth_update@btc_usdt,100ms",
   *   data: {
   *     s: "btc_usdt",
   *     pu: "1062665699362",
   *     fu: "1062665699363",
   *     u: "1062665699490",
   *     a: [ ["94943.5","24239"], ... ],  // asks 배열 (매도 호가)
   *     b: [ ["94947.1","0"], ... ],       // bids 배열 (매수 호가)
   *     t: 1738584148634                 // 타임스탬프
   *   }
   * }
   *
   * 여기서는 매도/매수 각각의 최우선 호가 정보를 사용하여 bestBidPrice, bestBidVolume, bestAskPrice, bestAskVolume 값을 설정하고,
   * 중앙값(currentPrice)을 산출합니다.
   */
  format(message: any): UnifiedOrderbook | null {
    if (!message || !message.data) return null;
    const data = message.data;
    if (!data.s || !data.a || !data.b || !data.t) return null;

    // asks: 매도 호가 배열, bids: 매수 호가 배열
    const bestAsk =
      Array.isArray(data.a) && data.a.length > 0 ? data.a[0] : null;
    const bestBid =
      Array.isArray(data.b) && data.b.length > 0 ? data.b[0] : null;
    if (!bestAsk && !bestBid) return null;

    // 각각의 최우선 호가 정보를 파싱 (없으면 0으로 대체)
    const bestBidPrice = bestBid ? parseFloat(bestBid[0]) : 0;
    const bestBidVolume = bestBid ? parseFloat(bestBid[1]) : 0;
    const bestAskPrice = bestAsk ? parseFloat(bestAsk[0]) : 0;
    const bestAskVolume = bestAsk ? parseFloat(bestAsk[1]) : 0;

    // 중앙값(currentPrice) 계산: 매수와 매도 호가가 모두 있을 경우 평균값 사용,
    // 하나만 존재하면 해당 값을 사용합니다.
    let currentPrice = 0;
    if (bestAsk && bestBid) {
      currentPrice = (bestAskPrice + bestBidPrice) / 2;
    } else if (bestAsk) {
      currentPrice = bestAskPrice;
    } else if (bestBid) {
      currentPrice = bestBidPrice;
    }

    return {
      exchange: Exchange.XT,
      symbol: data.s.replace("_", "").toUpperCase(),
      type: MarketMessageType.ORDERBOOK,
      bestBidPrice,
      bestBidVolume,
      bestAskPrice,
      bestAskVolume,
      currentPrice,
      timestamp: new Date(data.t).toISOString(),
    };
  }
}
