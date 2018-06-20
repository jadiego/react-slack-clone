SUBDIRS = messaging gateway

# https://www.gnu.org/software/make/manual/make.html#Recursion
all:
	+$(MAKE) -C messaging
	+$(MAKE) -C gateway

.PHONY: up
up: all
	docker-compose up --build

.PHONY: down
down: clean
	docker-compose down

.PHONY: clean
clean:
	@for dir in $(SUBDIRS); do \
    	$(MAKE) -C $$dir -f Makefile $@; \
  	done
