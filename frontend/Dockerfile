# Stage 1: Build the React app
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Start the server
CMD ["nginx", "-g", "daemon off;"]