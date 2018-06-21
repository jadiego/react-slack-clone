# Client 
This directory contains the source code for the web client. It was used using CRA and so [this helpguide](https://github.com/facebook/create-react-app) also applies.

## Development

Requirements
- node / npm

For first time after cloning
```
npm install
```

For running a local web server:
```
npm start
```

## Docker Configuration

Execute below to get a copy of nginx config file.
```
docker run --name tmp-nginx-container -d nginx
docker cp tmp-nginx-container:/etc/nginx/nginx.conf nginx.conf
docker rm -f tmp-nginx-container
```
