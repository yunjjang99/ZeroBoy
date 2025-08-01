import { UnifiedOrderbook } from "src/interface/messege";
import { Exchange, MarketMessageType } from "src/interface/enum";
import { OrderbookFormatter } from "src/interface/formatter.interface";

export class LbankOrderbookFormatter implements OrderbookFormatter {
  // 필요에 따라 심볼은 채널 정보 등에서 주입할 수 있으나 여기서는 기본값 사용
  private readonly defaultSymbol = "BTCUSDT";

  /**
   * LBANK Order Book 메시지 예시:
   * {
   *   b: [ ["101526.4","5.7374"], ... ],  // 매수 호가 배열
   *   s: [ ["101527.8","5.441"], ... ],     // 매도 호가 배열
   *   w: 1738628490812,                    // 타임스탬프 (epoch ms)
   *   x: 3,
   *   y: "3000000001",
   *   z: 3
   * }
   *
   * 가장 상위 호가를 사용하여 중앙값을 산출하고, 각 호가의 거래량을 추출합니다.
   */
  format(message: any): UnifiedOrderbook | null {
    if (!message || !message.b || !message.s || message.w === undefined) {
      return null;
    }
    const bestBid = message.b[0];
    const bestAsk = message.s[0];
    if (!bestBid || !bestAsk) return null;

    const bestBidPrice = parseFloat(bestBid[0]);
    const bestBidVolume = parseFloat(bestBid[1]);
    const bestAskPrice = parseFloat(bestAsk[0]);
    const bestAskVolume = parseFloat(bestAsk[1]);
    const currentPrice = (bestBidPrice + bestAskPrice) / 2; // 중앙값 계산 (선택적)

    return {
      exchange: Exchange.LBANK, // ✅ Enum 적용
      symbol: this.defaultSymbol,
      type: MarketMessageType.ORDERBOOK, // ✅ Enum 적용
      bestBidPrice, // ✅ 최고 매수 가격
      bestBidVolume, // ✅ 최고 매수 가격에 걸린 주문량
      bestAskPrice, // ✅ 최저 매도 가격
      bestAskVolume, // ✅ 최저 매도 가격에 걸린 주문량
      currentPrice, // ✅ 중앙값 (선택적)
      timestamp: new Date(message.w).toISOString(),
    };
  }
}
