FROM node
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 80
CMD ["node", "index.js"]
