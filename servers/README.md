# API Server

This directory contains the source code for the API Server, which clients will use to authenticate, post messages, receive notifications of new messages posted by other clients, etc.

## Development

Requirements:
- Node / npm
- Go
- Docker

1. To start our backend, we need to create a self-signed cert. Run the command in bash:
```
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -subj "/CN=localhost" -keyout privkey.pem -out fullchain.pem
``` 
This will create 2 files **privkey.pem** and **fullchain.pem** at the directory where the command was ran. 
> I suggest storing them in a folder (tls) and remember to not push these to the git repo


2. cd into root directory of apiservers and run 
```
make
```
This will create the binaries needed by the container to run the apiserver

Then, A **docker-compose.yml** file has been provided in order to start the backend, including and all required DBs (mongo and redis), with a single command. To do so, the required **environment variables has to be set at .env** at the root directory. See **.env.example** for an example. Once that is set, we could run it all using the command in bash:
```
docker-compose up
```
> You might have to change the environment and volume for the **gogateway** service. For volumes, the left side of the : is the **source path** for the self-signed certificates we created, while the right side of the : is the **target path** within the container. The target path and and path set by the environment variable has to match
