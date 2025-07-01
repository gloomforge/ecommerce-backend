.PHONY: install up dev all
.DEFAULT_GOAL := all

install:
	@echo "Installing dependencies"
	@bun install

up:
	@echo "Starting docker containers (MySQL, Redis)"
	@docker-compose up -d

dev:
	@echo "Starting dev server..."
	@bun run start:dev

all: install up dev
	@echo "All services started: dependencies installed, containers up, dev server running."