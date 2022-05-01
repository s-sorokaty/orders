start_project:
	cp .local.env .env
	docker-compose up -d 
	npm i
	npm run start

down_project:
	docker-compose down