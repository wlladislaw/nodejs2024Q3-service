
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

EXPOSE ${PORT}

CMD ["npm", "run", "start:prod"]

