import { Page } from "puppeteer";
import { TradeOrderData } from "src/interface/elementParse.interface";

export async function clickBitmartOrderButton(
  page: Page,
  positionSide: "short" | "long"
): Promise<void> {
  // 1. Open Long / Open Short 버튼 클릭
  const clicked = await page.evaluate((positionSide: string) => {
    let expectedText = "";
    if (positionSide.toLowerCase() === "long") {
      expectedText = "Open Long";
    } else if (positionSide.toLowerCase() === "short") {
      expectedText = "Open Short";
    } else {
      throw new Error("Invalid positionSide value");
    }

    // 페이지 내 모든 button > span 요소를 검색
    const elements = Array.from(document.querySelectorAll("button span"));
    const targetSpan = elements.find(
      (el) => el.textContent && el.textContent.trim() === expectedText
    );
    if (targetSpan) {
      const parentButton = targetSpan.closest("button");
      if (parentButton) {
        (parentButton as HTMLElement).click();
        return true;
      }
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
  console.log(`Bitmart ${positionSide.toUpperCase()} 버튼 클릭 완료`);

  await page.waitForSelector("div.el-dialog__wrapper[style*='z-index:']", {
    visible: true,
    timeout: 3000,
  });

  // 2. 모달 내부에서 Confirm 버튼을 찾아 클릭
  const confirmClicked = await page.evaluate(() => {
    // 모달 래퍼 선택 (동적 z-index가 설정된 요소)
    const modalWrapper = document.querySelector(
      "div.el-dialog__wrapper[style*='z-index:']"
    );
    if (!modalWrapper) return false;

    // 모달 내부의 footer 영역에서 "Confirm" 텍스트가 포함된 primary 버튼을 찾음
    const confirmButton = modalWrapper.querySelector(
      "div.el-dialog__footer button.el-button--primary span"
    );
    if (confirmButton) {
      // 부모 버튼 요소를 찾아 클릭
      const parentButton = confirmButton.closest("button");
      if (parentButton) {
        parentButton.click();
        return true;
      }
    }
    return false;
  });

  if (!confirmClicked) {
    throw new Error("Confirm 버튼을 찾을 수 없습니다.");
  }
  console.log("Bitmart Confirm 버튼 클릭 완료");
}

export async function bitmartCloseAllPositionsConfirm(
  page: Page
): Promise<void> {
  // 1. "Close All Positions" 버튼 클릭
  const closePositionsClicked = await page.evaluate(() => {
    // 모든 button 요소를 가져온 후, 텍스트가 "Close All Positions"인 버튼을 찾음
    const buttons: HTMLButtonElement[] = Array.from(
      document.querySelectorAll("button")
    );
    const targetButton = buttons.find(
      (btn) => btn.textContent?.trim() === "Close All Positions"
    );
    if (targetButton) {
      targetButton.click();
      return true;
    }
    return false;
  });

  if (!closePositionsClicked) {
    throw new Error("Close All Positions 버튼을 찾을 수 없습니다.");
  }
  console.log("Close All Positions 버튼 클릭 완료");

  // 2. 모달 래퍼(클래스: el-dialog__wrapper, style 속성에 --confirm-modal-width 와 z-index 포함)가 나타날 때까지 대기 (최대 3초)
  await page.waitForSelector(
    "div.el-dialog__wrapper[style*='--confirm-modal-width'][style*='z-index:']",
    {
      visible: true,
      timeout: 3000,
    }
  );
  console.log("모달 나타남");

  // 3. 모달 내부에서 Confirm 버튼 클릭
  const confirmClicked = await page.evaluate(() => {
    // 모달 래퍼 선택: 클래스가 el-dialog__wrapper이며, style 속성에 --confirm-modal-width와 z-index가 포함된 요소
    const modalWrapper = document.querySelector(
      "div.el-dialog__wrapper[style*='--confirm-modal-width'][style*='z-index:']"
    );
    if (!modalWrapper) return false;

    // 모달 래퍼 내부의 el-dialog 요소 선택 (동적 클래스 포함)
    const modalDialog = modalWrapper.querySelector("div.el-dialog");
    if (!modalDialog) return false;

    // el-dialog 내부의 모달 본문 선택 (클래스: el-dialog__body)
    const modalBody = modalDialog.querySelector("div.el-dialog__body");
    if (!modalBody) return false;

    // 모달 본문 내의 모든 button 요소 검색
    const buttons: HTMLButtonElement[] = Array.from(
      modalBody.querySelectorAll("button")
    );

    // 각 버튼의 텍스트 또는 자식 span의 텍스트가 "Confirm"인 버튼 찾기
    const confirmButton = buttons.find((btn) => {
      if (btn.textContent?.trim() === "Confirm") {
        return true;
      }
      const spanElement = btn.querySelector("span");
      return spanElement?.textContent?.trim() === "Confirm";
    });

    if (confirmButton) {
      confirmButton.click();
      return true;
    }
    return false;
  });

  if (!confirmClicked) {
    throw new Error("모달 내 Confirm 버튼을 찾을 수 없습니다.");
  }
  console.log("Confirm 버튼 클릭 완료");
}

/**
 * Bitmart의 거래내용을 보여주는 요소(클래스에 "contractOrders" 포함) 내에서
 * "숫자/숫자" 형식(예: "2.5756 / 2.5745")의 문자열들을 추출합니다.
 *
 * @param page Puppeteer의 Page 인스턴스
 * @returns Promise<string[]> 추출된 문자열 배열
 */
export async function extractNumberSlashNumber(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    // 클래스 이름에 "contractOrders"가 포함된 첫번째 div 요소를 찾습니다.
    const container = document.querySelector('div[class*="contractOrders"]');
    if (!container) return [];
    const text = (container as HTMLElement).innerText;
    // 숫자(소수점 포함) / 숫자(소수점 포함) 형식을 찾는 정규식 (콤마도 허용)
    const regex = /([\d.,]+)\s*\/\s*([\d.,]+)/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      // match[0]는 전체 매칭 결과입니다.
      matches.push(match[0].trim());
    }
    return matches;
  });
}

/**
 * Bitmart의 거래내용을 보여주는 요소(클래스에 "contractOrders" 포함) 내에서
 * "(정수%)" 형식(예: "(2%)")의 문자열들을 추출합니다.
 *
 * @param page Puppeteer의 Page 인스턴스
 * @returns Promise<string[]> 추출된 문자열 배열
 */
export async function extractIntegerPercent(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const container = document.querySelector('div[class*="contractOrders"]');
    if (!container) return [];
    const text = (container as HTMLElement).innerText;
    // 여는 괄호, 공백, 선택적 음수 부호, 숫자 및 소수점 숫자, %, 닫는 괄호 패턴
    const regex = /\(\s*(-?[\d]+(?:\.[\d]+)?)%\s*\)/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[0].trim());
    }
    return matches;
  });
}

/**
 * Bitmart 페이지에서 진입가, 마켓프라이스, PnL 데이터를 추출합니다.
 *
 * Bitmart는 거래내용 컨테이너에서 "숫자/숫자" 및 "(정수%)" 형식으로 데이터를 보여주므로,
 * 해당 정규식을 사용하여 데이터를 추출합니다.
 *
 * @param page Puppeteer의 Page 인스턴스
 * @returns Promise<PositionData>
 */
export async function extractBitmartPositionData(
  page: Page
): Promise<TradeOrderData> {
  return await page.evaluate(() => {
    const container = document.querySelector('div[class*="contractOrders"]');
    if (!container) {
      throw new Error("contractOrders 컨테이너를 찾을 수 없습니다.");
    }
    const text = (container as HTMLElement).innerText;

    // "숫자/숫자" 형식에서 진입가와 마켓프라이스 추출
    const priceRegex = /([\d.,]+)\s*\/\s*([\d.,]+)/;
    const priceMatch = priceRegex.exec(text);
    let entryPrice = "";
    let marketPrice = "";
    if (priceMatch) {
      entryPrice = priceMatch[1].trim();
      marketPrice = priceMatch[2].trim();
    }

    // "(정수%)" 형식에서 PnL 추출
    const percentRegex = /\(\s*(-?[\d]+(?:\.[\d]+)?)%\s*\)/;
    const pnlMatch = percentRegex.exec(text);
    const pnl = pnlMatch ? pnlMatch[0].trim() : "";

    return { entryPrice, marketPrice, pnl };
  });
}

/**
 * 주어진 페이지에서 로그인 상태를 확인합니다.
 *
 * 동적 클래스(예: "opreation-wrapper-next {EDE29V} {BtdnAj} {}")를 가진 div 내부에
 * "Get Started" 버튼이 존재하면 비로그인 상태로 판단합니다.
 *
 * @param page Puppeteer의 Page 인스턴스
 * @returns Promise<boolean> 로그인 상태 (true: 로그인 상태, false: 비로그인 상태)
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    // 동적 클래스가 포함된 div를 부분 매칭하여 선택합니다.
    const container = document.querySelector(
      'div[class*="opreation-wrapper-next"]'
    );
    if (!container) {
      // 해당 컨테이너가 없으면 로그인 상태로 간주합니다.
      return true;
    }
    // 컨테이너 내부의 모든 버튼을 찾습니다.
    const buttons = container.querySelectorAll("button");
    for (const btn of buttons) {
      if (btn.textContent && btn.textContent.trim() === "Get Started") {
        // "Get Started" 버튼이 있다면 비로그인 상태입니다.
        return false;
      }
    }
    // "Get Started" 버튼이 없으면 로그인 상태입니다.
    return true;
  });
}
