# ==============================================================================
# Multi-stage Dockerfile for Student Attendance Tracker (OpenShift Ready)
# ==============================================================================

# Stage 1: Build the React static assets
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve static files using OpenShift-compatible non-root Nginx
FROM nginxinc/nginx-unprivileged:alpine

# Copy custom Nginx configuration listening on 8080 with SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production build from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Ensure proper permissions for OpenShift arbitrary UIDs (root group)
USER root
RUN chmod -R g+rX /usr/share/nginx/html
USER 101

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
