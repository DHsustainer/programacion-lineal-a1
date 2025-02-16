# Use Node.js 20 as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Start the application
CMD ["npm", "start"]