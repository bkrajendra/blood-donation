# LTS base image
FROM node:22-alpine

WORKDIR /app

# Install production deps
COPY package*.json ./
RUN npm install --production

# Must be already build in ci
COPY dist ./dist

# Copy SQLite DB
COPY data/blood_donation.db ./dist/data/blood_donation.db

# Expose the app port
EXPOSE 3000

# Run the NestJS app
CMD ["node", "dist/main"]
