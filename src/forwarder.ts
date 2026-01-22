import type { Request, Response } from "express";
import { ProxyAgent, request } from "undici";
import type { Dispatcher } from "undici";
import type { AppConfig } from "./config.js";

const hopByHopHeaders = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host"
]);

const filterHeaders = (headers: Record<string, string | string[] | undefined>) =>
  Object.fromEntries(
    Object.entries(headers).filter(
      ([key, value]) => value !== undefined && !hopByHopHeaders.has(key.toLowerCase())
    )
  );

const buildTargetUrl = (config: AppConfig, originalUrl: string): string => {
  const path = originalUrl.startsWith("/") ? originalUrl : `/${originalUrl}`;
  return `${config.targetBaseUrl}${path}`;
};

export const createForwarder = (config: AppConfig) => {
  const dispatcher = config.proxyUrl ? new ProxyAgent(config.proxyUrl) : undefined;

  return async (req: Request, res: Response) => {
    const targetUrl = buildTargetUrl(config, req.originalUrl);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.requestTimeoutMs);

    req.on("aborted", () => controller.abort());

    try {
      const method = req.method.toUpperCase() as Dispatcher.HttpMethod;
      const hasBody = !["GET", "HEAD"].includes(method);
      const outboundHeaders = filterHeaders(
        req.headers as Record<string, string | string[] | undefined>
      );
      if (!hasBody) {
        delete outboundHeaders["content-length"];
      }

      const { statusCode, headers, body } = await request(targetUrl, {
        method,
        headers: outboundHeaders,
        body: hasBody ? req : undefined,
        dispatcher,
        signal: controller.signal
      });

      res.status(statusCode);
      for (const [key, value] of Object.entries(headers)) {
        if (!hopByHopHeaders.has(key.toLowerCase()) && value !== undefined) {
          res.setHeader(key, value);
        }
      }

      if (!body) {
        res.end();
        return;
      }

      body.on("error", () => {
        if (!res.headersSent) {
          res.status(502);
        }
        res.end();
      });

      body.pipe(res);
    } catch (error) {
      if (!res.headersSent) {
        res.status(502);
      }
      res.end();
    } finally {
      clearTimeout(timeout);
    }
  };
};
