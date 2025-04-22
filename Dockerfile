FROM node:22-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app

# Copy package files from root
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install


# Copy the entire application code
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN pnpx prisma generate

EXPOSE 3000
