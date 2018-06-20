FROM alpine

# Our API server will first look for the url parameter in the client request,
# then make a request to another server based on that url.
# Once our API server gets the https response from that server,
# it needs to check against the root CA list.
RUN apk add --no-cache ca-certificates

COPY gateway /gateway

EXPOSE 80

ENTRYPOINT ["/gateway"]