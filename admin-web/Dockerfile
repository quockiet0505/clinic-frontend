# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app

# Install pnpm to unify package managers
RUN npm install -g pnpm

# Copy package configuration
COPY package.json ./

# Install dependencies (ignoring lockfile if it's npm to force pnpm)
RUN pnpm install --no-frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the app using Vite
RUN pnpm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built assets from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
