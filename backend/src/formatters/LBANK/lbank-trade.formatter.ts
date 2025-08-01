import { Exchange, MarketMessageType } from "src/interface/enum";
import { TradeFormatter } from "src/interface/formatter.interface";
import { UnifiedTrade } from "src/interface/messege";

export class LbankTradeFormatter implements TradeFormatter {
  /**
   * LBANK 체결 메시지 예시 (d가 객체로 주어짐):
   * {
   *   d: {
   *     a: "BTCUSDT",
   *     b: "0.0078",         // 거래량
   *     c: "101527.7",        // 체결가 (거래 가격)
   *     d: "1",              // 거래 타입 (예: "1"이면 매수, "0"이면 매도)
   *     e: "1738628490",     // 타임스탬프 (epoch seconds)
   *     f: "1000153669261600"
   *   },
   *   w: ...,
   *   x: ...,
   *   y: ...,
   *   z: ...
   * }
   */
  format(message: any): UnifiedTrade | null {
    if (
      !message ||
      !message.d ||
      typeof message.d !== "object" ||
      Array.isArray(message.d)
    ) {
      return null;
    }
    const data = message.d;
    if (!data.a || !data.c || !data.b || !data.e) return null;

    const symbol = data.a.toUpperCase();
    const tradePrice = parseFloat(data.c); // ✅ 체결 가격
    const tradeVolume = parseFloat(data.b); // ✅ 체결량

    // ✅ 매수/매도 타입 결정
    const tradeSide = data.d === "1" ? "buy" : data.d === "0" ? "sell" : null;
    if (!tradeSide) return null;

    return {
      exchange: Exchange.LBANK,
      symbol,
      type: MarketMessageType.TRADE,
      tradePrice, // ✅ 필수 데이터 추가
      tradeVolume, // ✅ 필수 데이터 추가
      tradeSide, // ✅ "buy" 또는 "sell"
      timestamp: new Date(parseInt(data.e, 10) * 1000).toISOString(),
    };
  }
}
