# Lightweight forward proxy (TypeScript)

This tiny Express app forwards any incoming request to a target base URL, optionally through an upstream proxy with a fixed IP.

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

## Tests

Run `npm test` to verify forwarding against `https://postman-echo.com`.
