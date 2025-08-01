import { TickerFormatter } from "src/interface/formatter.interface";
import { UnifiedTicker } from "src/interface/messege";
import { Exchange, MarketMessageType } from "src/interface/enum";

export class AscendexTickerFormatter implements TickerFormatter {
  format(message: any): UnifiedTicker | null {
    try {
      // 예시: Ascendex 티커 메시지 예시 구조
      // { m: "ticker", symbol: "ETH-PERP", data: { last: "2806.66", ts: 1739803356123, ... } }
      const data = message.data;
      const ticker: UnifiedTicker = {
        exchange: Exchange.ASCENDEX,
        symbol: message.symbol,
        type: MarketMessageType.TICKER,
        currentPrice: parseFloat(data.last),
        lastTradePrice: parseFloat(data.last),
        timestamp: new Date(data.ts).toISOString(),
      };
      return ticker;
    } catch (error) {
      console.error("AscendexTickerFormatter 오류:", error);
      return null;
    }
  }
}
