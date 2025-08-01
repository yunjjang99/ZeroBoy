import { Exchange, MarketMessageType } from "src/interface/enum";
import { TickerFormatter } from "src/interface/formatter.interface";
import { UnifiedTicker } from "src/interface/messege";

export class LbankTickerFormatter implements TickerFormatter {
  /**
   * LBANK Ticker 메시지 예시 (d 배열 형식):
   * {
   *   d: [
   *     {
   *       a: "BTCUSDT",
   *       b: "102565",
   *       c: "100534",
   *       d: "101599.602",
   *       e: "101549.5",
   *       f: "0.000025",
   *       g: "101618.9",
   *       h: "101293.6",
   *       i: "101527",          // 여기서 마지막 체결가로 판단
   *       j: "60.5168",
   *       ...,
   *       u: 1738628490         // 타임스탬프 (epoch seconds)
   *     }
   *   ],
   *   w: 1738628490812,
   *   x: 1,
   *   y: "1000000001",
   *   z: 3
   * }
   */
  format(message: any): UnifiedTicker | null {
    if (
      !message ||
      !message.d ||
      !Array.isArray(message.d) ||
      message.d.length === 0
    ) {
      return null;
    }
    const data = message.d[0];
    if (!data.a || !data.i || data.u === undefined) return null;
    const symbol = data.a.toUpperCase();
    const lastPrice = parseFloat(data.i);
    return {
      exchange: Exchange.LBANK,
      symbol,
      type: MarketMessageType.TICKER,
      currentPrice: lastPrice,
      lastTradePrice: lastPrice,
      // u는 epoch(초)인 경우 → 밀리초로 변환
      timestamp: new Date(data.u * 1000).toISOString(),
    };
  }
}
