include .env
project= -p ${COMPOSER_PROJECT_NAME}

start:
	@docker-compose -f docker-compose.yml $(project) up -d
stop:
	@docker-compose -f docker-compose.yml $(project) down
restart: stop start

logs-nginx:
	@docker logs -f ${COMPOSER_PROJECT_NAME}_nginx
logs-client:
	@docker logs -f ${COMPOSER_PROJECT_NAME}_client
logs-api:
	@docker logs -f ${COMPOSER_PROJECT_NAME}_api
logs-worker:
	@docker logs -f ${COMPOSER_PROJECT_NAME}_worker
logs-mysql:
	@docker logs -f ${COMPOSER_PROJECT_NAME}_mysql

ssh:
	@docker exec -it ${COMPOSER_PROJECT_NAME}_api /bin/sh

ssh-nginx:
	@docker exec -it ${COMPOSER_PROJECT_NAME}_nginx /bin/bash

ssh-worker:
	@docker exec -it ${COMPOSER_PROJECT_NAME}_worker /bin/sh

ssh-redis:
	@docker exec -it ${COMPOSER_PROJECT_NAME}_redis /bin/sh

ssh-mysql:
	@docker exec -it ${COMPOSER_PROJECT_NAME}_mysql /bin/sh
