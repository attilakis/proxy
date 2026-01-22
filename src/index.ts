import { createApp } from "./app.js";
import { config } from "./config.js";

const app = createApp(config);

app.listen(config.port, () => {
  console.log(`Proxy listening on http://localhost:${config.port}`);
  console.log(`Forwarding to ${config.targetBaseUrl}`);
  if (config.proxyUrl) {
    console.log("Upstream proxy enabled");
  }
});
