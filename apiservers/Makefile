linux:
	GOOS=linux go build -o gateway/gateway gateway/main.go

clean:
	docker-compose down; cd gateway; go clean
	
dev: linux
	docker-compose up --build
	