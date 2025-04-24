build:
	docker-compose -f docker-compose.yml up -d db redis backend frontend --build

bundle.update:
	docker-compose run --rm --no-deps backend bundle update

start:
	docker-compose up

stop:
	docker-compose down --remove-orphans

rails.c:
	docker-compose run backend rails c

sh:
	docker-compose run backend sh

db.init:
	docker-compose run backend bundle exec rake db:create db:migrate db:seed

db.migrate:
	docker-compose run backend bundle exec rake db:migrate

test:
	docker-compose run backend bundle exec rspec spec/$(folder)