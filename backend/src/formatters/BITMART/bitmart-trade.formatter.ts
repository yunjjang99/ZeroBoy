import { Exchange, MarketMessageType } from "src/interface/enum";
import { TradeFormatter } from "src/interface/formatter.interface";
import { UnifiedTrade } from "src/interface/messege";

export class BitmartTradeFormatter implements TradeFormatter {
  /**
   * Bitmart 체결 메시지 예시:
   * {
   *   data: [
   *     {
   *       trade_id: 3000000342872469,
   *       contract_id: 1,
   *       symbol: "BTCUSDT",
   *       deal_price: "96999.9",
   *       deal_vol: "3",
   *       way: 6,
   *       create_time: 1739528826,
   *       create_time_mill: 1739528826209,
   *       created_at: "2025-02-14T10:27:06.20997188Z"
   *     }
   *   ],
   *   group: "Trade:1",
   *   uuid: 3565691440,
   *   ms_t: 1739528826259
   * }
   *
   * 주의: Bitmart의 'way' 필드를 기준으로 매수/매도 매핑은 API 문서를 참고하여 확인해야 합니다.
   * 아래 예시에서는 way가 6이면 "sell", 그 외는 "buy"로 처리합니다.
   */
  format(message: any): UnifiedTrade | null {
    if (
      !message ||
      !message.data ||
      !Array.isArray(message.data) ||
      message.data.length === 0
    ) {
      return null;
    }
    const tradeData = message.data[0];
    if (
      !tradeData.symbol ||
      !tradeData.deal_price ||
      !tradeData.deal_vol ||
      !tradeData.created_at
    ) {
      return null;
    }
    const symbol = tradeData.symbol.toUpperCase();
    const tradePrice = parseFloat(tradeData.deal_price);
    const tradeVolume = parseFloat(tradeData.deal_vol);
    let tradeSide: "buy" | "sell" | null = null;
    // 예시 매핑: way === 6이면 "sell", 그 외는 "buy"
    if (tradeData.way === 6) {
      tradeSide = "sell";
    } else {
      tradeSide = "buy";
    }
    // Bitmart는 created_at 필드에 ISO8601 포맷의 문자열을 제공합니다.
    const timestamp = tradeData.created_at;
    return {
      exchange: Exchange.BITMART,
      symbol,
      type: MarketMessageType.TRADE,
      tradePrice,
      tradeVolume,
      tradeSide,
      timestamp,
    };
  }
}
