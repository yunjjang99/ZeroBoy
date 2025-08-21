// CJS 환경에서도 ESM 모듈을 안전하게 불러오는 브리지
export type CamoufoxModule = typeof import("camoufox-js");

let _mod: Promise<CamoufoxModule> | null = null;

// TS가 require로 변환하지 않도록 Function('return import(...)') 사용
export function loadCamoufox(): Promise<CamoufoxModule> {
  if (!_mod) {
    _mod = Function(
      'return import("camoufox-js")'
    )() as Promise<CamoufoxModule>;
  }
  return _mod;
}
