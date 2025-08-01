import { OrderbookFormatter } from "src/interface/formatter.interface";
import { UnifiedOrderbook } from "src/interface/messege";
import { Exchange, MarketMessageType } from "src/interface/enum";

export class AscendexOrderbookFormatter implements OrderbookFormatter {
  format(message: any): UnifiedOrderbook | null {
    try {
      // 예시: Ascendex 오더북 메시지 구조
      // { m: "depth", symbol: "ETH-PERP", data: { asks: [...], bids: [...], ts: 1739803355646 } }
      const data = message.data;
      // best bid와 best ask는 각각 배열의 첫번째 값(가격, 수량)로 가정
      const bestBid = data.bids?.[0];
      const bestAsk = data.asks?.[0];
      if (!bestBid || !bestAsk) return null;
      const orderbook: UnifiedOrderbook = {
        exchange: Exchange.ASCENDEX,
        symbol: message.symbol,
        type: MarketMessageType.ORDERBOOK,
        bestBidPrice: parseFloat(bestBid[0]),
        bestBidVolume: parseFloat(bestBid[1]),
        bestAskPrice: parseFloat(bestAsk[0]),
        bestAskVolume: parseFloat(bestAsk[1]),
        currentPrice: (parseFloat(bestBid[0]) + parseFloat(bestAsk[0])) / 2,
        timestamp: new Date(data.ts).toISOString(),
      };
      return orderbook;
    } catch (error) {
      console.error("AscendexOrderbookFormatter 오류:", error);
      return null;
    }
  }
}
