import { UnifiedOrder, UnifiedOrderbook } from "./messege";
import { UnifiedTrade } from "./messege";
import { UnifiedTicker } from "./messege";
/**
 * 모든 거래소의 Orderbook 데이터를 통일된 형식으로 변환하는 포맷터 인터페이스
 */
export interface OrderbookFormatter {
  /**
   * Orderbook 데이터를 UnifiedOrderbook 형식으로 변환하는 메서드
   * @param message 원본 Orderbook 데이터 (각 거래소에서 받은 원본 데이터)
   * @returns UnifiedOrderbook 객체 또는 변환 실패 시 null
   */
  format(message: any): UnifiedOrderbook | null;
}

/**
 * 모든 거래소의 Trade 데이터를 통일된 형식으로 변환하는 포맷터 인터페이스
 */
export interface TradeFormatter {
  /**
   * Trade 데이터를 UnifiedTrade 형식으로 변환하는 메서드
   * @param message 원본 Trade 데이터 (각 거래소에서 받은 원본 데이터)
   * @returns UnifiedTrade 객체 또는 변환 실패 시 null
   */
  format(message: any): UnifiedTrade | null;
}

export interface TickerFormatter {
  /**
   * Trade 데이터를 UnifiedTicker 형식으로 변환하는 메서드
   * @param message 원본 Ticker 데이터 (각 거래소에서 받은 원본 데이터)
   * @returns UnifiedTicker 객체 또는 변환 실패 시 null
   */
  format(message: any): UnifiedTicker | null;
}

export interface OrderFormatter {
  /**
   * Trade 데이터를 UnifiedTicker 형식으로 변환하는 메서드
   * @param message 원본 Ticker 데이터 (각 거래소에서 받은 원본 데이터)
   * @returns UnifiedTicker 객체 또는 변환 실패 시 null
   */
  format(message: any): UnifiedOrder | null;
}
