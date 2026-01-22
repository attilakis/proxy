import dotenv from "dotenv";

dotenv.config();

export type AppConfig = {
  port: number;
  targetBaseUrl: string;
  proxyUrl?: string;
  requestTimeoutMs: number;
};

const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const normalizeBaseUrl = (value: string): string => value.replace(/\/+$/, "");

export const config: AppConfig = {
  port: Number.parseInt(process.env.PORT ?? "3000", 10),
  targetBaseUrl: normalizeBaseUrl(requireEnv("TARGET_BASE_URL")),
  proxyUrl: process.env.PROXY_URL?.trim() || undefined,
  requestTimeoutMs: Number.parseInt(process.env.REQUEST_TIMEOUT_MS ?? "30000", 10)
};
