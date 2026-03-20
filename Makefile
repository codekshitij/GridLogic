.PHONY: help

help:
	@echo "Available make commands:"
	@echo "  dev              - Start both frontend and backend in dev mode"
	@echo "  frontend         - Start frontend dev server"
	@echo "  backend          - Start backend API server"
	@echo "  lint             - Run linter on frontend"
	@echo "  lint-fix         - Auto-fix lint errors on frontend"
	@echo "  format           - Format frontend code with Prettier"
	@echo "  format-check     - Check formatting on frontend with Prettier"
	@echo "  prettier         - Format frontend code with Prettier (direct)"
	@echo "  prettier-check   - Check formatting on frontend with Prettier (direct)"
.PHONY: dev frontend backend lint lint-fix format format-check prettier prettier-check

dev:
	./start-dev.sh

frontend:
	cd frontend && bun run dev

backend:
	cd backend && ../venv/bin/python -m uvicorn src.main:app --reload

lint:
	cd frontend && bun run lint

lint-fix:
	cd frontend && bunx eslint . --fix

format:
	cd frontend && bun run format

prettier:
	cd frontend && bunx prettier --write .

prettier-check:
	cd frontend && bunx prettier --check .

format-check:
	cd frontend && bun run format:check
