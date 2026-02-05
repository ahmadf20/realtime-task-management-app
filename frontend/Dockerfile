FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install

COPY . .

# Start the app
RUN pnpm build

CMD ["pnpm", "start"]
