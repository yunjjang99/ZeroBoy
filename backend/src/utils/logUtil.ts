// src/utils/logUtil.ts
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file"; // require도 가능
import type { TransformableInfo } from "logform";
import * as fs from "fs";
import * as path from "path";
// import { LogstashTransport } from "winston-logstash-transport"; // 필요시 주석 해제

export const formatLog = (
  message: string,
  level: "INFO" | "ERROR" | "DEBUG",
  timestamp: Date = new Date()
): string => `[${level}] - ${timestamp.toISOString()}: ${message}`;

// 개발 여부
const isDev = process.env.IS_DEV === "true";

// 패키징 환경에서 리소스/유저데이터 경로 받는다면(일렉트론 메인에서 env로 전달)
const ELECTRON_USER_DATA = process.env.ELECTRON_USER_DATA;

// ✅ 로그 디렉터리: 패키징 후에도 쓰기 가능한 위치로
const LOG_DIR =
  process.env.LOG_DIR ||
  (ELECTRON_USER_DATA
    ? path.join(ELECTRON_USER_DATA, "logs")
    : path.join(process.cwd(), "logs"));

fs.mkdirSync(LOG_DIR, { recursive: true });

// ✅ 특정 메시지(예: HTTP access log) 필터
const filterIsSuccessLogs = format((info: TransformableInfo) => {
  // message를 문자열로 정규화
  const raw = info.message;
  const msg =
    typeof raw === "string"
      ? raw
      : raw == null
        ? ""
        : typeof raw === "object"
          ? JSON.stringify(raw)
          : String(raw);

  // 여기서 필터링 조건 적용
  if (msg.includes("method") && msg.includes("url")) {
    return false; // drop
  }

  info.message = msg;
  return info;
});

export const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    // 회전 로그 (info 이상)
    new DailyRotateFile({
      filename: path.join(LOG_DIR, "application-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      level: "info",
      zippedArchive: true,
    }),
    // 에러 로그
    new transports.File({
      filename: path.join(LOG_DIR, "error.log"),
      level: "error",
    }),
    // 콘솔(에러만)
    new transports.Console({
      level: "error",
      format: format.combine(format.colorize(), format.simple()),
    }),
    // info 로그 필터(터미널 미표시)
    new transports.Console({
      level: "info",
      format: format.combine(
        filterIsSuccessLogs(),
        format.timestamp(),
        format.json()
      ),
      silent: true,
    }),

    // Logstash 사용 시
    // new LogstashTransport({
    //   host: isDev ? "127.0.0.1" : process.env.LOGSTASH_HOST,
    //   port: Number(process.env.LOGSTASH_PORT ?? 5044),
    //   protocol: "tcp",
    //   level: "info",
    //   handleExceptions: true,
    //   onError: (err) => console.error("LogstashTransport error:", err),
    // }),
  ],
});

// 호출 함수명 유틸
export function getCallerFunctionName(): string {
  const stack = new Error().stack ?? "";
  const line = stack.split("\n")[3] || "";
  const match = line.match(/at\s+(.+?)\s+\(/);
  return match ? match[1] : "unknown_function";
}
