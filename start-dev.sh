#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
PYTHON_BIN="$ROOT_DIR/venv/bin/python"

if [[ ! -x "$PYTHON_BIN" ]]; then
  echo "Error: Python executable not found at $PYTHON_BIN"
  echo "Create/activate your venv first, then retry."
  exit 1
fi

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

echo "Starting backend on http://localhost:8000 ..."
(
  cd "$BACKEND_DIR"
  "$PYTHON_BIN" -m uvicorn src.main:app --reload
) &
BACKEND_PID=$!

echo "Starting frontend on http://localhost:5173 ..."
cd "$FRONTEND_DIR"
bun run dev
