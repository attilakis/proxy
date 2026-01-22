import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import type { AppConfig } from "../src/config.js";

const config: AppConfig = {
  port: 0,
  targetBaseUrl: "https://postman-echo.com",
  proxyUrl: undefined,
  requestTimeoutMs: 30000
};

const app = createApp(config);

describe("forward proxy", () => {
  it("forwards query params and headers", async () => {
    const response = await request(app)
      .get("/get?foo=bar")
      .set("x-custom-test", "hello")
      .expect(200);

    expect(response.body.args.foo).toBe("bar");
    expect(response.body.headers["x-custom-test"]).toBe("hello");
  });

  it("forwards JSON bodies", async () => {
    const response = await request(app)
      .post("/post")
      .send({ message: "ping" })
      .set("content-type", "application/json")
      .expect(200);

    expect(response.body.json).toEqual({ message: "ping" });
  });
});
