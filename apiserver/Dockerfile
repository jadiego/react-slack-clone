FROM scratch
ADD ca-certificates.crt /etc/ssl/certs/
COPY apiserver apiserver
EXPOSE 80
ENTRYPOINT ["/apiserver"]
