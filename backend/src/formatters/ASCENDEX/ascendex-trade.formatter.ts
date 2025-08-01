import { TradeFormatter } from "src/interface/formatter.interface";
import { UnifiedTrade } from "src/interface/messege";
import { Exchange, MarketMessageType } from "src/interface/enum";

export class AscendexTradeFormatter implements TradeFormatter {
  format(message: any): UnifiedTrade | null {
    try {
      // 예시: Ascendex 트레이드 메시지 구조
      // { m: "trades", symbol: "ETH-PERP", data: [ { p: "2806.66", q: "86.65", ts: 1739803354859, bm: false, seqnum: ... }, ... ] }
      const dataArray = message.data;
      if (!Array.isArray(dataArray) || dataArray.length === 0) return null;
      // 여기서는 가장 최근의 하나의 트레이드 데이터로 변환하는 예시
      const tradeData = dataArray[0];
      const unifiedTrade: UnifiedTrade = {
        exchange: Exchange.ASCENDEX,
        symbol: message.symbol,
        type: MarketMessageType.TRADE,
        tradePrice: parseFloat(tradeData.p),
        tradeVolume: parseFloat(tradeData.q),
        tradeSide: tradeData.bm ? "buy" : "sell", // bm=true이면 매수, false이면 매도로 가정
        timestamp: new Date(tradeData.ts).toISOString(),
      };
      return unifiedTrade;
    } catch (error) {
      console.error("AscendexTradeFormatter 오류:", error);
      return null;
    }
  }
}
