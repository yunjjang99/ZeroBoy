// src/puppeteer/puppeteer.service.ts
import { Injectable, OnModuleDestroy, Logger } from "@nestjs/common";
import { Browser, Page, CDPSession } from "puppeteer-core";
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
import {
  generateRandomFingerprintForKorea,
  applyFingerprint,
} from "../utils/fingerprintGenerator";
import { FingerprintService } from "@/fingerprint/fingerprint.service";
import * as fs from "fs";
import * as path from "path";
import { Buffer } from "buffer";

import { XTTickerFormatter } from "../formatters/XT/xt-ticker.formatter";
import { XTOrderbookFormatter } from "src/formatters/XT/xt-orderbook.formatter";
import { LbankTickerFormatter } from "../formatters/LBANK/lbank-ticker.formatter";
import { LbankOrderbookFormatter } from "../formatters/LBANK/lbank-orderbook.formatter";
import { LbankTradeFormatter } from "../formatters/LBANK/lbank-trade.formatter";
import { BitmartOrderbookFormatter } from "src/formatters/BITMART/bitmart-orderbook.formatter";
import { BitmartTradeFormatter } from "src/formatters/BITMART/bitmart-trade.formatter";
import { BitmartTickerFormatter } from "src/formatters/BITMART/bitmart-ticker.formmater";
// Unified 메시지 인터페이스 및 Enum 임포트
import { Exchange, MarketMessageType } from "src/interface/enum";
import { LbankOrderFormatter } from "src/formatters/LBANK/lbank-order.fommater";

import * as LbankExchange from "./exchange/lbank";
import * as BitmartExchange from "./exchange/bitmart";

import { AscendexTickerFormatter } from "src/formatters/ASCENDEX/ascendex-ticker.fomatter";
import { AscendexOrderbookFormatter } from "src/formatters/ASCENDEX/ascendex-orderbook";
import { AscendexTradeFormatter } from "src/formatters/ASCENDEX/ascendex-trade.formatter";
import { TradeOrderData } from "src/interface/elementParse.interface";
import { PuppeteerGateway } from "./puppeteer.gateway";

interface WebSocketMessage {
  topic?: string;
  [key: string]: unknown;
}
export interface PuppeteerInstance {
  browser: Browser;
  uuid: string;
}

@Injectable()
export class PuppeteerService implements OnModuleDestroy {
  constructor(
    private readonly fingerprintService: FingerprintService,
    private readonly puppeteerGateway: PuppeteerGateway
  ) {}

  private xtTickerFormatter = new XTTickerFormatter();
  private xtOderbookFormatter = new XTOrderbookFormatter();
  // 2. Lbank 포매터 인스턴스 생성
  private lbankTickerFormatter = new LbankTickerFormatter();
  private lbankOrderbookFormatter = new LbankOrderbookFormatter();
  private lbankTradeFormatter = new LbankTradeFormatter();
  private lbankOrderFormatter = new LbankOrderFormatter();
  //3. Bitmart 포매터 인스턴스 생성
  private bitmartTickerFormatter = new BitmartOrderbookFormatter();
  private bitmartOrderbookFormatter = new BitmartOrderbookFormatter();
  private bitmartTradeFormatter = new BitmartTradeFormatter();
  // 4. Ascendex 포매터 인스턴스 생성
  private ascendexTickerFormatter = new AscendexTickerFormatter();
  private ascendexOrderbookFormatter = new AscendexOrderbookFormatter();
  private ascendexTradeFormatter = new AscendexTradeFormatter();

  private readonly logger = new Logger(PuppeteerService.name);
  private readonly browsers = new Map<string, Browser>();

  private getRawLogFilePath(
    exchange: "LBANK" | "BITMART" | "ASCENDEX" | "OTHER"
  ): string {
    switch (exchange) {
      case "LBANK":
        return path.resolve(__dirname, "../../logs/LBANK/raw.txt");
      case "BITMART":
        return path.resolve(__dirname, "../../logs/BITMART/raw.txt");
      case "ASCENDEX":
        return path.resolve(__dirname, "../../logs/ASCENDEX/raw.txt");
      default:
        return path.resolve(__dirname, "../../logs/OTHER/raw.txt");
    }
  }

  private async handleFetchResponse(
    cdp: CDPSession,
    params: any,
    siteUrl: string
  ): Promise<void> {
    const { response, requestId } = params;

    // JSON 응답만 처리 (필요에 따라 조건 확장 가능)
    if (response.mimeType && response.mimeType.includes("application/json")) {
      try {
        const responseBody = await cdp.send("Network.getResponseBody", {
          requestId,
        });
        const rawData = responseBody.body;
        if (!rawData) return;

        let parsed: any;
        try {
          parsed = JSON.parse(rawData);
        } catch (err) {
          // JSON 파싱 실패 시 무시
          return;
        }

        // 기타 fetch 응답 처리 (필요 시 추가)
        const unifiedMessage = this.formatMessage(parsed, siteUrl);
        if (unifiedMessage) {
          // this.logUnifiedMessage(unifiedMessage);
          // this.server.emit("tradeData", unifiedMessage);
        }
      } catch (err) {
        // console.error("Fetch response 처리 중 에러 발생:", err);
      }
    }
  }

  private appendRawLog(
    exchange: "LBANK" | "BITMART" | "OTHER" | "ASCENDEX",
    logMessage: string
  ): void {
    const filePath = this.getRawLogFilePath(exchange);
    // 디렉토리 없으면 생성 (이미 ensureLogFileAt가 있다면 재활용 가능)
    const logDir = path.dirname(filePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    // 로그 파일에 문자열 추가
    fs.appendFileSync(filePath, logMessage + "\n", "utf8");
  }

  private formatMessage(message: any, siteUrl: string): any | null {
    if (siteUrl.includes("lbank.com")) {
      if (message.name === "SendOrderInsert") {
        console.log(message, "message name sendorderinsert");
        return this.lbankOrderFormatter.format(message);
      }

      if (message.d) {
        // 만약 d가 배열이면 기존 로직대로 처리
        if (Array.isArray(message.d)) {
          const ticker = this.lbankTickerFormatter.format(message);
          if (ticker) return ticker;
        }
        // d가 객체인 경우 ticker에 필요한 키가 있는지 확인 후 배열로 감싸서 전달
        else if (typeof message.d === "object") {
          const { a, i, u, k } = message.d;
          if (a && i && (u || k)) {
            const ticker = this.lbankTickerFormatter.format({
              ...message,
              d: [message.d],
            });
            if (ticker) return ticker;
          }
        }
      }
      // Orderbook 메시지 (예: message.b와 message.s가 존재하는 경우)
      if (message.b && message.s) {
        return this.lbankOrderbookFormatter.format(message);
      }
      // Trade 메시지 (추가 조건이 있다면 Trade 포매터를 호출)
      if (message.d && typeof message.d === "object") {
        return this.lbankTradeFormatter.format(message);
      }
    } else if (siteUrl.includes("ascendex.com")) {
      // Ascendex의 경우, 메시지의 "m" 필드를 기준으로 처리합니다.
      switch (message.m) {
        case "ticker":
          return this.ascendexTickerFormatter.format(message);
        case "depth":
          return this.ascendexOrderbookFormatter.format(message);
        case "trades":
          return this.ascendexTradeFormatter.format(message);
        // case "order":
        //   return this.ascendexOrderFormatter.format(message);
        default:
          //  console.warn("Ascendex: 알 수 없는 메시지 타입", message.m);
          return null;
      }
    } else if (siteUrl.includes("bitmart.com")) {
      if (message.group) {
        if (message.group.startsWith("Ticker")) {
          return this.bitmartTickerFormatter.format(message);
        } else if (message.group.startsWith("Depth")) {
          return this.bitmartOrderbookFormatter.format(message);
        } else if (message.group.startsWith("Trade")) {
          return this.bitmartTradeFormatter.format(message);
        }
      }
      return;
    } else if (siteUrl.includes("xt.com")) {
      if (message.topic === "ticker") {
        return this.xtTickerFormatter.format(message);
      } else if (message.topic === "depth_update") {
        return this.xtOderbookFormatter.format(message);
      }
    }

    return null;
  }

  async createBrowser(siteUrl: string): Promise<PuppeteerInstance> {
    const { connect } = require("puppeteer-real-browser");

    const { browser, page }: { browser: Browser; page: Page } = await connect({
      headless: false,
      executablePath: process.env.CHROME_PATH,
      args: [],
      customConfig: {
        defaultViewport: null,
      },
      turnstile: false,
      connectOption: {
        defaultViewport: {
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
        },
      },
      disableXvfb: false,
      ignoreAllFlags: false,
    });

    // ✅ 브라우저 지문 랜덤 설정
    const publicIp = await this.getPublicIp();
    const fingerprint = await generateRandomFingerprintForKorea(publicIp);
    const uuid = await this.fingerprintService.saveFingerprint(
      fingerprint,
      siteUrl
    );
    this.logger.log(`📦 브라우저 Fingerprint 저장됨: ${uuid}`);

    await applyFingerprint(page, fingerprint);

    // ✅ 입력받은 siteUrl로 이동
    await page.goto(siteUrl, { waitUntil: "domcontentloaded" });

    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();

        if (window.indexedDB && indexedDB.databases) {
          indexedDB.databases().then((dbs) => {
            dbs.forEach((db) => {
              if (db.name) indexedDB.deleteDatabase(db.name);
            });
          });
        }

        if (typeof caches !== "undefined" && caches.keys) {
          caches.keys().then((keys) => {
            keys.forEach((key) => caches.delete(key));
          });
        }
      } catch (e) {
        console.warn("스토리지 정리 중 오류:", e);
      }
    });

    // ✅ 네트워크 추적 활성화
    await this.enableCDPNetwork(page, siteUrl);

    this.browsers.set(uuid, browser);

    // 10초마다 저장
    setInterval(async () => {
      try {
        // ✅ 반드시 유효 페이지 로드 후에만 실행
        const url = page.url();
        if (url.startsWith("http")) {
          const cookies = await page.cookies();
          const localStorage = await page.evaluate(() =>
            JSON.stringify(window.localStorage)
          );
          const sessionStorage = await page.evaluate(() =>
            JSON.stringify(window.sessionStorage)
          );

          await this.fingerprintService.updateSession(uuid, {
            cookies,
            localStorage,
            sessionStorage,
          });

          this.logger.debug(`🧩 세션 저장 완료 (UUID: ${uuid})`);
        }
      } catch (err) {
        this.logger.warn(`세션 저장 실패: ${err}`);
      }
    }, 10_000);

    return { browser, uuid };
  }

  async reopenBrowser(uuid: string): Promise<Browser> {
    const { connect } = require("puppeteer-real-browser");

    // 1. DB에서 fingerprint 불러오기
    const fingerprint = await this.fingerprintService.getFingerprint(uuid);
    if (!fingerprint) {
      throw new Error(`해당 UUID에 대한 Fingerprint 없음: ${uuid}`);
    }

    // 2. 브라우저 실행
    const { browser, page }: { browser: Browser; page: Page } = await connect({
      headless: false,
      executablePath: process.env.CHROME_PATH,
      args: [],
      customConfig: {
        defaultViewport: null,
      },
      turnstile: false,
      connectOption: {
        defaultViewport: {
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
        },
      },
      disableXvfb: false,
      ignoreAllFlags: false,
    });

    // 3. applyFingerprint 적용
    await applyFingerprint(page, fingerprint);

    if (fingerprint.cookies?.length) {
      await page.setCookie(...fingerprint.cookies);
      this.logger.log(`🍪 쿠키 복원 완료`);
    }

    // 🧭 페이지 이동
    //await page.goto(fingerprint.siteUrl, { waitUntil: "domcontentloaded" });
    await page.goto("https://www.naver.com", { waitUntil: "domcontentloaded" });

    //www.lbank.com
    // 🧩 Storage 복원 (이제 접근 가능)
    await page.evaluate(
      (local, session) => {
        try {
          const l = JSON.parse(local || "{}");
          for (const k in l) localStorage.setItem(k, l[k]);
        } catch {}
        try {
          const s = JSON.parse(session || "{}");
          for (const k in s) sessionStorage.setItem(k, s[k]);
        } catch {}
      },
      fingerprint.localStorage,
      fingerprint.sessionStorage
    );

    this.logger.log(`♻️ Fingerprint 재적용 브라우저 실행됨 (UUID: ${uuid})`);
    this.browsers.set(uuid, browser);
    const status = await this.getBrowserStatus("uuid");
    console.log(status);
    await this.enableCDPNetwork(page, fingerprint.siteUrl);
    return browser;
  }

  async getBrowserStatuses(): Promise<
    { uuid: string; isConnected: boolean; tabs: string[] }[]
  > {
    const statuses: { uuid: string; isConnected: boolean; tabs: string[] }[] =
      [];

    for (const [uuid, browser] of this.browsers.entries()) {
      const isConnected = browser.isConnected();
      let tabs: string[] = [];

      try {
        const pages = await browser.pages();
        tabs = await Promise.all(pages.map((p) => p.url()));
      } catch (e) {
        tabs = ["탭 정보를 가져올 수 없음"];
      }

      statuses.push({ uuid, isConnected, tabs });
    }

    return statuses;
  }

  private async getPublicIp(): Promise<string> {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (e) {
      this.logger.error("공인 IP 가져오기 실패, 기본 IP 사용", e);
      return "1.1.1.1"; // fallback
    }
  }

  async onModuleDestroy() {
    this.logger.log("모듈 종료, 브라우저 모두 종료");

    // Map의 values를 배열로 변환 후 map 사용
    const closeTasks = Array.from(this.browsers.values()).map((browser) =>
      browser.close()
    );

    await Promise.all(closeTasks);
    this.browsers.clear();
  }

  private async enableCDPNetwork(
    page: Page,
    siteUrl: string
  ): Promise<CDPSession> {
    const cdp = await page.target().createCDPSession();
    await cdp.send("Network.enable");

    // 1) 모든 요청(Request)에 대한 이벤트
    cdp.on("Network.requestWillBeSent", (params) => {
      const { request } = params;
      const url = request.url || "";

      if (url.includes("bitmart.com")) {
        console.log(`[BITMART Request] ${url}`);
        this.appendRawLog("BITMART", `[Request] ${url}`);
      } else if (url.includes("lbank.com")) {
        // console.log(`[LBANK Request] ${url}`);
        this.appendRawLog("LBANK", `[Request] ${url}`);
      } else if (url.includes("ascendex.com")) {
        //console.log(`[ASCENDEX Request] ${url}`);
        this.appendRawLog("ASCENDEX", `[Request] ${url}`);
      } else {
        // console.log(`[OTHER Request] ${url}`);
        this.appendRawLog("OTHER", `[Request] ${url}`);
      }
    });

    // 2) 모든 응답(Response)에 대한 이벤트
    cdp.on("Network.responseReceived", async (params) => {
      const { response } = params;
      const { url, status, mimeType } = response;

      let exchange: "LBANK" | "BITMART" | "ASCENDEX" | "OTHER" = "OTHER";
      if (url.includes("bitmart.com")) {
        exchange = "BITMART";
      } else if (url.includes("lbank.com")) {
        exchange = "LBANK";
      } else if (url.includes("ascendex.com")) {
        exchange = "ASCENDEX";
      }

      // 콘솔 + 파일 로깅
      // console.log(
      //   `[${exchange} Response] url: ${url}, status: ${status}, mimeType: ${mimeType}`
      // );
      this.appendRawLog(
        exchange,
        `[Response] url: ${url}, status: ${status}, mimeType: ${mimeType}`
      );

      // JSON 응답이면 바디도 저장
      try {
        if (mimeType.includes("application/json")) {
          const responseBody = await cdp.send("Network.getResponseBody", {
            requestId: params.requestId,
          });
          const rawData = responseBody.body || "";
          // 필요하다면 파일에 Raw Body 로깅
          this.appendRawLog(exchange, `[Response Body] ${rawData}`);
        }
      } catch (error) {
        // console.error("응답 바디 조회 중 에러:", error);
      }
    });

    cdp.on("Network.webSocketCreated", (params) => {
      // 필요시 추가 로직 구현
    });

    cdp.on("Network.webSocketFrameReceived", (params) => {
      const { opcode, payloadData } = params.response;
      let rawData = payloadData;
      if (opcode === 2) {
        try {
          rawData = Buffer.from(payloadData, "base64").toString("utf-8");
        } catch (err) {
          console.error("Base64 디코딩 실패:", err);
          return;
        }
      }

      let parsed: WebSocketMessage;
      try {
        parsed = JSON.parse(rawData);
      } catch {
        // console.log(`JSON 파싱 불가 데이터: ${rawData}`);
        return;
      }

      if (siteUrl.includes("xt.com")) {
        if (parsed.topic !== "ticker" && parsed.topic !== "depth_update") {
          return;
        }
      }
      const unifiedMessage = this.formatMessage(parsed, siteUrl);
      if (unifiedMessage) {
        // this.monitorAndClosePositions();
        // this.logUnifiedMessage(unifiedMessage);
        this.puppeteerGateway.emit("socketData", unifiedMessage);
      } else {
        // console.log("포맷팅 실패 또는 처리 대상 메시지가 아님:", rawData);
      }
    });

    // fetch 응답 수신 이벤트 등록
    cdp.on("Network.responseReceived", async (params) => {
      await this.handleFetchResponse(cdp, params, siteUrl);
    });

    return cdp;
  }

  async getBrowserStatus(uuid: string): Promise<{
    uuid: string;
    isConnected: boolean;
    tabs: string[];
  } | null> {
    const browser = this.browsers.get(uuid);
    if (!browser) {
      this.logger.warn(
        `UUID ${uuid}에 해당하는 브라우저 인스턴스를 찾을 수 없습니다.`
      );
      return null;
    }

    const isConnected = browser.isConnected();
    let tabs: string[] = [];

    try {
      const pages = await browser.pages();
      tabs = await Promise.all(pages.map((p) => p.url()));
    } catch (error) {
      this.logger.error(
        `탭 정보를 가져오는 중 오류 발생 (UUID: ${uuid})`,
        error
      );
      tabs = ["탭 정보를 가져올 수 없음"];
    }

    return { uuid, isConnected, tabs };
  }
}
