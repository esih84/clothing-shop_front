# syntax=docker/dockerfile:1
# Pet Shop store (Next.js 16, standalone output). npm (package-lock.json موجود است).
# NEXT_PUBLIC_API_URL هنگام build داخل باندل کلاینت bake می‌شود → باید URL عمومی https باشد.

FROM docker.arvancloud.ir/node:22-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM docker.arvancloud.ir/node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM docker.arvancloud.ir/node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 5000

CMD ["node", "server.js"]
