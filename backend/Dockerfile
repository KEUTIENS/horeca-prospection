FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production=false

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]



