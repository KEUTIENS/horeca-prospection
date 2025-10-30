FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production=false

# Copy source code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]



