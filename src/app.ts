import express from "express";
import type { AppConfig } from "./config.js";
import { createForwarder } from "./forwarder.js";

export const createApp = (config: AppConfig) => {
  const app = express();
  app.disable("x-powered-by");
  app.all("*", createForwarder(config));
  return app;
};
