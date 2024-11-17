
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

RUN npx prisma generate

EXPOSE ${PORT}

CMD ["sh", "-c", "npx prisma migrate deploy && npm start:dev"]

