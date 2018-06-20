# NOTE: before a docker container is build using this config file
# an executable "gateway" should be built first. Go to root apiserver 
# directory first and run `make`
FROM alpine

# Our API server will first look for the url parameter in the client request,
# then make a request to another server based on that url.
# Once our API server gets the https response from that server,
# it needs to check against the root CA list.
RUN apk add --no-cache ca-certificates

# Copies the gateway executble built using `go build`.
COPY messaging /messaging

EXPOSE 80

ENTRYPOINT ["/messaging"]
