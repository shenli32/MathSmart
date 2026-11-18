#!/bin/sh
set -a
. "$(dirname "$0")/.env"
set +a

NODE_BIN="$(dirname "$0")/.tools/node-v26.13.1-darwin-arm64/bin/node"
if [ ! -x "$NODE_BIN" ]; then
  NODE_BIN="$(command -v node || true)"
fi
if [ -z "$NODE_BIN" ]; then
  echo "Node.js is not installed. Please install Node.js, then run ./start.sh again."
  exit 1
fi
exec "$NODE_BIN" "$(dirname "$0")/server.js"
