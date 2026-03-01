When running dev for docker compose use this command
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

When want to run prod this this command
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

When switching env using command before switching
docker compose down -v