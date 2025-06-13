# Stage 1: Build the Angular app
# FROM node:22-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:stable-alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular build output
# COPY --from=builder /app/dist/blood-donation-app/browser/* /usr/share/nginx/html/
COPY dist/blood-donation-app/browser/* /usr/share/nginx/html/
# Optional: custom nginx config if needed
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
