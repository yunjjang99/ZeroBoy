// src/puppeteer/exchange/lbank.ts
import { Page } from "puppeteer-core";
import { TradeOrderData } from "src/interface/elementParse.interface";

export async function clickOrderboardButton(
  page: Page,
  positionSide: "short" | "long"
): Promise<void> {
  // 1. 주문보드 버튼 클릭
  const clicked = await page.evaluate((positionSide: string) => {
    let selector = "";
    let expectedText = "";

    if (positionSide.toLowerCase() === "long") {
      selector = ".btnOpen span.text";
      expectedText = "Open Long";
    } else if (positionSide.toLowerCase() === "short") {
      selector = ".btnClose span.text";
      expectedText = "Open Short";
    } else {
      throw new Error("Invalid positionSide value");
    }

    const elements = Array.from(document.querySelectorAll(selector));
    const targetElement = elements.find(
      (el) => el.textContent && el.textContent.trim() === expectedText
    );

    if (targetElement) {
      (targetElement as HTMLElement).click();
      return true;
    }
    return false;
  }, positionSide);

  if (!clicked) {
    throw new Error(
      `Button with text "${
        positionSide.toLowerCase() === "long" ? "Open Long" : "Open Short"
      }" not found.`
    );
  }
  console.log(`lbank ${positionSide.toUpperCase()} 버튼 클릭 완료`);

  // 2. confirm 모달이 생성되는지 대기 (최대 5초)
  try {
    await page.waitForFunction(
      () => {
        return document.body.innerText.includes("Order Confirmation");
      },
      { timeout: 1000 }
    );
    console.log("Confirm 모달이 감지되었습니다.");

    // 3. 모달 내 Confirm 버튼 클릭
    const confirmClicked = await page.evaluate(() => {
      const modal = document.querySelector("[class*='lbank-modal-content']");
      if (modal) {
        const confirmBtn = Array.from(modal.querySelectorAll("button")).find(
          (btn) => btn.textContent && btn.textContent.trim() === "Confirm"
        );
        if (confirmBtn) {
          (confirmBtn as HTMLElement).click();
          return true;
        }
      }
      return false;
    });
    if (!confirmClicked) {
      throw new Error("Confirm 버튼을 찾을 수 없습니다.");
    }
    console.log("lbank Confirm 버튼 클릭 완료");
  } catch (error) {
    // 타임아웃이나 모달이 나타나지 않은 경우 별도 처리 (여기서는 그냥 로그를 남김)
    console.warn(
      "Confirm 모달이 나타나지 않았습니다. (에러:",
      error.message,
      ")"
    );
  }
}

/**
 * lbank 페이지에서 매도 주문을 실행합니다.
 * 순서:
 * 1. ".futures-orders-tabs-toolbar" 내부에서 "MKT close" 버튼 클릭
 * 2. 모달이 나타나면 "Confirm" 버튼 클릭
 */
export async function lbankSell(page: Page): Promise<void> {
  // 1. futures-orders-tabs-toolbar 요소 대기
  await page.waitForSelector(".futures-orders-tabs-toolbar", { visible: true });

  // "MKT close" 버튼 클릭 (toolbar 내의 span 요소)
  const mktCloseClicked = await page.evaluate(() => {
    const toolbar = document.querySelector(".futures-orders-tabs-toolbar");
    if (toolbar) {
      const targetSpan = Array.from(toolbar.querySelectorAll("span")).find(
        (span) =>
          span.textContent &&
          span.textContent.trim().toLowerCase().includes("mkt close")
      );
      if (targetSpan) {
        (targetSpan as HTMLElement).click();
        return true;
      }
    }
    return false;
  });

  if (!mktCloseClicked) {
    throw new Error("MKT close 버튼을 찾을 수 없습니다.");
  }
  console.log("lbank MKT close 버튼 클릭 완료");

  // 2. 모달 대기 후 Confirm 버튼 클릭
  await page.waitForSelector("[class*='lbank-modal-content']", {
    visible: true,
  });
  console.log("lbank 모달이 나타남");

  const confirmClicked = await page.evaluate(() => {
    const modal = document.querySelector("[class*='lbank-modal-content']");
    if (modal) {
      const confirmBtn = Array.from(modal.querySelectorAll("button")).find(
        (btn) => btn.textContent && btn.textContent.trim() === "Confirm"
      );
      if (confirmBtn) {
        (confirmBtn as HTMLElement).click();
        return true;
      }
    }
    return false;
  });

  if (!confirmClicked) {
    throw new Error("Confirm 버튼을 찾을 수 없습니다.");
  }
  console.log("lbank Confirm 버튼 클릭 완료");
}

/**
 * lbank 페이지에서 롱/숏 레버리지 값을 가져옵니다.
 */
export async function getLeverageValues(
  page: Page
): Promise<{ longLeverage: number; shortLeverage: number }> {
  return await page.evaluate(() => {
    const longElement = document.querySelector(
      "div.btn_lever.lever_long span.lbk_up_down_tag.up"
    );
    const shortElement = document.querySelector(
      "div.btn_lever.lever_long span.lbk_up_down_tag.down"
    );

    const parseLeverage = (text: string | null): number => {
      if (!text) return 0;
      const numericString = text.replace(/[^0-9.]/g, "");
      return parseFloat(numericString);
    };

    const longText = longElement
      ? (longElement.textContent?.trim() ?? null)
      : null;
    const shortText = shortElement
      ? (shortElement.textContent?.trim() ?? null)
      : null;

    return {
      longLeverage: parseLeverage(longText),
      shortLeverage: parseLeverage(shortText),
    };
  });
}

/**
 * table-container 클래스를 가진 테이블의 첫번째 table-body-row에서
 * Entry Price(3번째 td), Market Price(4번째 td) 및 8번째 td 내부에서 괄호로 시작하는(PnL) 텍스트를 추출합니다.
 *
 * @param page Puppeteer의 Page 인스턴스
 * @returns Promise<{ entryPrice: string; marketPrice: string; pnl: string }>
 */
export async function extractPositionData(
  page: Page
): Promise<{ entryPrice: string; marketPrice: string; pnl: string }> {
  return await page.evaluate(() => {
    // table-body-row를 찾습니다.
    const row = document.querySelector("tr.table-body-row");
    if (!row) {
      throw new Error("table-body-row를 찾을 수 없습니다.");
    }
    const cells = Array.from(row.querySelectorAll("td"));
    if (cells.length < 8) {
      throw new Error("필요한 td 셀의 개수가 부족합니다.");
    }

    // Entry Price: 3번째 td (0-based index 2)
    const entryPrice = cells[2].innerText.trim();
    // Market Price: 4번째 td (0-based index 3)
    const marketPrice = cells[3].innerText.trim();

    // 8번째 td (0-based index 7) 내부에서 괄호로 시작하는 텍스트(예: PnL)를 찾습니다.
    let pnl = "";
    const pnlContainer = cells[7];
    // pnlContainer 내의 모든 자식 요소를 순회하면서, 텍스트가 "("로 시작하는 요소를 찾습니다.
    const potentialEls = pnlContainer.querySelectorAll("div, span");
    potentialEls.forEach((el) => {
      const txt = el.textContent?.trim() || "";
      if (txt.startsWith("(")) {
        pnl = txt;
      }
    });

    return { entryPrice, marketPrice, pnl };
  });
}

/**
 * Lbank 페이지에서 진입가, 마켓프라이스, PnL 데이터를 추출합니다.
 *
 * @param page Puppeteer의 Page 인스턴스
 * @returns Promise<PositionData>
 */
export async function extractLbankPositionData(
  page: Page
): Promise<TradeOrderData> {
  return await page.evaluate(() => {
    const row = document.querySelector("tr.table-body-row");
    if (!row) {
      throw new Error("table-body-row를 찾을 수 없습니다.");
    }
    const cells = Array.from(row.querySelectorAll("td"));
    if (cells.length < 8) {
      throw new Error("필요한 td 셀의 개수가 부족합니다.");
    }

    const entryPrice = cells[2].innerText.trim(); // 3번째 td
    const marketPrice = cells[3].innerText.trim(); // 4번째 td

    let pnl = "";
    const pnlContainer = cells[7]; // 8번째 td
    const potentialEls = pnlContainer.querySelectorAll("div, span");
    potentialEls.forEach((el) => {
      const txt = el.textContent?.trim() || "";
      if (txt.startsWith("(")) {
        pnl = txt;
      }
    });

    return { entryPrice, marketPrice, pnl };
  });
}

/**
 * Lbank 페이지의 futures_orderboard_content 영역 내에 "Log In / Register" 텍스트를 가진 요소가 있는지 확인하여
 * 로그인 상태를 판단합니다.
 *
 * @param page Puppeteer의 Page 인스턴스
 * @returns Promise<boolean> 로그인 상태 (true: 로그인 상태, false: 비로그인 상태)
 */
export async function isLbankLoggedIn(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    // futures_orderboard_content 클래스를 포함하는 컨테이너를 찾습니다.
    const container = document.querySelector(
      'div[class*="futures_orderboard_content"]'
    );
    if (!container) {
      // 컨테이너가 없으면 페이지 구조가 변경된 것으로 간주하고 false 반환
      return false;
    }
    // 컨테이너 내부에서 "Log In / Register" 텍스트를 가진 div 요소를 찾습니다.
    const loginElement = Array.from(container.querySelectorAll("div")).find(
      (el) => el.textContent?.trim() === "Log In / Register"
    );
    // 해당 요소가 있다면 비로그인 상태, 없으면 로그인 상태입니다.
    return loginElement ? false : true;
  });
}
