import { Exchange, MarketMessageType } from "./enum";

/**
 * 통합 메시지 형식 (예시)
 */
export interface AggregatedWSMessage {
  exchange: "XT" | "LBANK" | "BINANCE"; // 거래소 식별
  symbol: string; // 예: 'BTCUSDT'
  dataType: "orderbook" | "trade" | "ticker" | "kline";
  // ---- 실질적인 데이터 payload ----
  payload: {
    // orderbook일 경우
    bids?: Array<[number, number]>; // [[price, size], ...]
    asks?: Array<[number, number]>;
    // trade일 경우
    trades?: Array<{
      price: number;
      volume: number;
      side: "buy" | "sell"; // 매수 or 매도
      timestamp: number; //거래 시각
    }>;
    // ticker일 경우
    close?: number; // 종가 or 현재가
    high?: number; // 24h 고가
    low?: number; // 24h 저가
    volume?: number; // 24h 거래량
    // kline일 경우
    open?: number;
    closeTime?: number;
    // ...
  };
  // 메시지 수신 시점 (거래소 서버 시간)
  localTimestamp: number;
}

export interface UnifiedTicker {
  exchange: Exchange;
  symbol: string;
  type: MarketMessageType.TICKER; // 고정값
  currentPrice: number;
  lastTradePrice: number;
  timestamp: string;
}

export interface UnifiedTrade {
  exchange: Exchange; // ✅ 거래소 (LBANK, BINANCE 등)
  symbol: string; // ✅ BTCUSDT, ETHUSDT 등
  type: MarketMessageType.TRADE; // ✅ "trade" 고정값
  tradePrice: number; // ✅ 체결된 가격 (101527.7)
  tradeVolume: number; // ✅ 체결된 거래량 (0.0078)
  tradeSide: "buy" | "sell"; // ✅ 매수 or 매도
  timestamp: string; // ✅ 체결 시간 (ISO8601 포맷)
}

export interface UnifiedOrderbook {
  exchange: Exchange;
  symbol: string;
  type: MarketMessageType.ORDERBOOK; // 고정값
  bestBidPrice: number;
  bestBidVolume: number;
  bestAskPrice: number;
  // lastTradePrice: number;
  bestAskVolume: number;
  currentPrice: number; // 예를 들어 중앙값 등
  timestamp: string;
}

export interface UnifiedOrder {
  /** 어느 거래소에서 체결되었는지 (예: "LBANK") */
  exchange: Exchange;
  /** 거래 종목 (예: "BTCUSDT") */
  instrument: string;
  /** 체결 가격 (응답의 tradePrice 사용) */
  executedPrice: string;
  /** 체결량 (응답의 volume 또는 volumeTraded 사용) */
  executedVolume: string;
  /** 체결 시각 (insertTime 값을 ISO 8601 문자열로 변환) */
  timestamp: string;

  type: MarketMessageType.ORDER;
  /**
   * 주문 방향: 매수(BUY) 또는 매도(SELL)
   * 응답의 direction 필드가 "0"이면 매수, "1"이면 매도로 처리
   */
  orderSide: "BUY" | "SELL";
  /**
   * 포지션 방향: 롱(LONG) 또는 숏(SHORT)
   * 응답의 posiDirection 필드가 "0"이면 롱, "1"이면 숏으로 처리
   */
  positionSide: "LONG" | "SHORT";
}
