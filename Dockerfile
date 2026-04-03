FROM node:20-slim
WORKDIR /app
COPY package*.json ./
# Di sini kuncinya: Railway bakal download semua yang tadi kita injek
RUN npm install --omit=dev
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
