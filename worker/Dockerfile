# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port (not really needed for worker, but good practice)
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the worker
CMD ["npm", "run", "start"]

