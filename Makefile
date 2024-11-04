.phony: up down restart cmd

up:
	docker compose up -d --remove-orphans
down:
	docker compose down --remove-orphans
restart: down up

cmd:
	docker compose exec node bash

deploy:
	docker compose -f docker-compose.override.yaml up -d --remove-orphans