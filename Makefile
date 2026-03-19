.PHONY: dev frontend backend format format-check

dev:
	./start-dev.sh

frontend:
	cd frontend && bun run dev

backend:
	cd backend && ../venv/bin/python -m uvicorn src.main:app --reload

format:
	cd frontend && bun run format

format-check:
	cd frontend && bun run format:check
