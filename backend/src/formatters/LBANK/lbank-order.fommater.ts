// src/formatters/LBANK/lbank-order.formatter.ts
import { Exchange, MarketMessageType } from "src/interface/enum";
import { UnifiedOrder } from "src/interface/messege";

export class LbankOrderFormatter {
  public format(message: any): UnifiedOrder | null {
    if (!message.data) return null;
    const data = message.data;
    // insertTime는 초 단위 UNIX 타임스탬프라고 가정합니다.
    const timestamp = new Date(
      parseInt(data.insertTime, 10) * 1000
    ).toISOString();
    // direction: "0"이면 매수(BUY), "1"이면 매도(SELL)
    const orderSide = data.direction === "0" ? "BUY" : "SELL";
    // posiDirection: "0"이면 롱(LONG), "1"이면 숏(SHORT)
    const positionSide = data.posiDirection === "0" ? "LONG" : "SHORT";

    return {
      exchange: Exchange.LBANK,
      instrument: data.instrumentID,
      type: MarketMessageType.ORDER, // ✅ Enum 적용
      executedPrice: data.tradePrice,
      executedVolume: data.volumeTraded, // 또는 data.volume 사용 가능
      timestamp,
      orderSide,
      positionSide,
    };
  }
}
