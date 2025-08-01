import { Exchange, MarketMessageType } from "src/interface/enum";
import { TickerFormatter } from "src/interface/formatter.interface";
import { UnifiedTicker } from "src/interface/messege";

export class BitmartTickerFormatter implements TickerFormatter {
  /**
   * Bitmart Ticker 메시지 예시:
   * {
   *   data: {
   *     last_price: "2709.07",
   *     open: "2680.89",
   *     close: "2709.07",
   *     low: "2610.46",
   *     high: "2720.49",
   *     timestamp: 1739528825,
   *     contract_name: "ETHUSDT",
   *     ...
   *   },
   *   group: "ticker:2",
   *   uuid: 3565683762,
   *   ms_t: 1739528825651
   * }
   *
   * 여기서는 contract_name을 심볼로, last_price를 현재가와 마지막 체결가로 사용합니다.
   * timestamp는 epoch(초) 값을 밀리초로 변환하여 ISO8601 문자열로 만듭니다.
   */
  format(message: any): UnifiedTicker | null {
    if (!message || !message.data) {
      return null;
    }
    const data = message.data;
    if (
      !data.contract_name ||
      !data.last_price ||
      data.timestamp === undefined
    ) {
      return null;
    }
    const symbol = data.contract_name.toUpperCase();
    const lastPrice = parseFloat(data.last_price);
    const timestamp = new Date(data.timestamp * 1000).toISOString();
    return {
      exchange: Exchange.BITMART,
      symbol,
      type: MarketMessageType.TICKER,
      currentPrice: lastPrice,
      lastTradePrice: lastPrice,
      timestamp,
    };
  }
}
