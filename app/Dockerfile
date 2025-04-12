FROM node:23-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app

# Copy package files from root
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy Prisma schema
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN pnpx prisma generate

# Copy the entire application code
COPY . ./
RUN pnpm run build

EXPOSE 3000
