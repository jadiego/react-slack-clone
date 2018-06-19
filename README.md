# Howl

<p align="center">
  <img src="https://github.com/jadiego/howl/blob/master/howl.png" alt="bloom logo"/>
</p>

Howl is an instant messaging web application, similar to Slack, which I built to learn more about server-side programming. 

## Features
- Instant message anyone who has created an account
- Create public or private channels
- A chatbot that answers simple questions about chat logs
- Account authentication during sign in
- Storing sessions
- Add/Remove users from a channel

## Built With
- DigitalOcean: Cloud hosting which provides Linux virtual servers
- MongoDB: NoSQL database program
- Redis: In-memory data structure store for caching
- React: Javascript library for building user interfaces
- Redux: State management system
- Docker: Software container platform for deploying apps
- Go: Programming language used for API server

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

2. cd into apiserver and run 
```
GOOS=linux go build
```
This will create the binary needed by the container to run the apiserver

Then, A **docker-compose.yml** file has been provided in order to start the backend, including and all required DBs (mongo and redis), with a single command. To do so, the required environment variables has to be set at **.env** at the root directory. See **.env.example** for an example. Once that is set, we could run it all using the command in bash:
```
docker-compose up
```
> You might have to change the environment and volume for the **goapi** service. For volumes, the left side of the : is the **source path** for the self-signed certificates we created, while the right side of the : is the **target path** within the container. The target path and and path set by the environment variable has to match

