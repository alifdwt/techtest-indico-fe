# Base image dengan Node + corepack (pnpm)
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

# Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build Next.js app
FROM base AS build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Pastikan script "build" di package.json: "next build"
RUN pnpm build

# Production runtime
FROM base AS runtime
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Copy hasil build dan dependencies
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY package.json pnpm-lock.yaml ./
COPY --from=deps /app/node_modules ./node_modules

# Expose port Next.js
EXPOSE 3000

# Start production server
# Pastikan script "start": "next start" ada di package.json
CMD ["pnpm", "start"]
