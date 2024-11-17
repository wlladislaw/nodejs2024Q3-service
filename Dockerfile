
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .


EXPOSE ${PORT}

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]

