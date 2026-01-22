# Lightweight forward proxy (TypeScript)

This tiny Express app forwards any incoming request to a target base URL, optionally through an upstream proxy with a fixed IP.

## Requirements

- Node.js >= 18.18 (tested on 20.x)
- npm >= 9

## Setup

1. Install deps:
   - `npm install`
2. Create `.env` from `env.example` and set values:
   - `cp env.example .env`
   - `PROXY_URL` example: `http://user:pass@proxy.example:12345`
3. Run:
   - Dev (auto-reload): `npm run dev`
   - Prod: `npm run build && npm start`

## Usage

Send requests to `http://localhost:3000/<any-path>` and the app forwards them to:

```
${TARGET_BASE_URL}/<any-path>
```

Query params, headers, and body are forwarded as-is.

## Examples

Assume `.env` contains:

```
TARGET_BASE_URL=https://api.binance.com
PORT=3000
PROXY_URL=http://user:pass@proxy.example:12345
```

Then these requests:

```
curl "http://localhost:3000/api/v3/time"
curl "http://localhost:3000/api/v3/ticker/price?symbol=BTCUSDT"
curl -X POST "http://localhost:3000/api/v3/order" \
  -H "Content-Type: application/json" \
  -d '{"symbol":"BTCUSDT","side":"BUY","type":"MARKET","quantity":"0.001"}'
```

Are forwarded to:

```
https://api.binance.com/api/v3/time
https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT
https://api.binance.com/api/v3/order
```

## Tests

Run `npm test` to verify forwarding against `https://postman-echo.com`.
