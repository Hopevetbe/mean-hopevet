# Use Node.js 14 as base image
FROM node:alpine3.18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port if needed
 EXPOSE 4300

# Command to run the application
CMD ["npm", "start"]
