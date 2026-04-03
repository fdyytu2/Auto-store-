FROM node:20-slim

WORKDIR /app

COPY package*.json ./

# Pakai install biasa biar dia nge-sync otomatis di dalam container
RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
