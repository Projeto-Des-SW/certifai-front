# ==========================================
# Stage 1: Build Environment (Node.js LTS)
# ==========================================
FROM node:lts-alpine AS builder

WORKDIR /app

# Install project dependencies leveraging Docker layer caching
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Build arguments for Vite environment variables
ARG VITE_API_URL=https://certifai-backend.onrender.com/certifai
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Compile TypeScript and generate production Vite bundle
RUN npm run build

# ==========================================
# Stage 2: Runtime Environment (Nginx Alpine)
# ==========================================
FROM nginx:stable-alpine AS runner

# Copy custom Nginx configuration optimized for SPA and compression
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production artifacts from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Health check to verify Nginx and container readiness
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
