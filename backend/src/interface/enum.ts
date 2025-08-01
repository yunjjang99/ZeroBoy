export enum MarketMessageType {
  TICKER = "ticker",
  ORDERBOOK = "orderbook",
  TRADE = "trade", // 체결 데이터 (Depth라고 명명할 수도 있음)
  ORDER = "order", // 실제 사용자 주문 데이터
}

export enum Exchange {
  LBANK = "LBANK",
  BINANCE = "BINANCE",
  COINBASE = "COINBASE",
  OKX = "OKX",
  XT = "XT",
  BITMART = "BITMART",
  ASCENDEX = "ASCENDEX",
  // 필요하면 다른 거래소도 추가 가능
}
