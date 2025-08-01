import { Exchange, MarketMessageType } from "src/interface/enum";
import { TickerFormatter } from "src/interface/formatter.interface";
import { UnifiedTicker } from "src/interface/messege";

export class XTTickerFormatter implements TickerFormatter {
  /**
   * XT Ticker 메시지 예시:
   * {
   *   topic: "ticker",
   *   event: "ticker@btc_usdt",
   *   data: {
   *     s: "btc_usdt",
   *     o: "98765.5",
   *     c: "94942.5",      // 현재 체결가 및 현재가로 사용
   *     h: "99385.1",
   *     l: "91157.7",
   *     a: "1990795300",
   *     v: "19056426599.92261",
   *     r: "-0.0387",
   *     t: 1738584148681  // 타임스탬프 (epoch ms)
   *   }
   * }
   */
  format(message: any): UnifiedTicker | null {
    if (!message || !message.data) return null;
    const data = message.data;
    if (data.s === undefined || data.c === undefined || data.t === undefined) {
      return null;
    }
    // 예: "btc_usdt" → "BTCUSDT"
    const symbol = data.s.replace("_", "").toUpperCase();
    const price = parseFloat(data.c);

    return {
      exchange: Exchange.XT,
      symbol,
      type: MarketMessageType.TICKER,
      currentPrice: price,
      lastTradePrice: price,
      timestamp: new Date(data.t).toISOString(),
    };
  }
}
