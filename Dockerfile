# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the application files
COPY . .

# Install the Nest CLI globally for hot reloading
RUN npm install -g @nestjs/cli

# Expose the app port
EXPOSE 3000

# Start the app in development mode
CMD ["npm", "run", "start:dev"]
