.PHONY: dev build test test-e2e migrate seed docker-up docker-down logs-api eval

dev:
	pnpm install
	pnpm dev

build:
	pnpm install
	pnpm build

test:
	pnpm test

test-e2e:
	pnpm test:e2e

migrate:
	pnpm -w exec tsx scripts/migrate.ts

seed:
	pnpm seed

docker-up:
	docker compose -f docker/docker-compose.yml up -d

docker-down:
	docker compose -f docker/docker-compose.yml down

logs-api:
	docker compose -f docker/docker-compose.yml logs -f api

eval:
	pnpm -w exec tsx scripts/eval.ts
