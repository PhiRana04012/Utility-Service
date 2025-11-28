#!/bin/sh
set -e

# Default API backend URL (for docker-compose)
API_BACKEND_URL=${API_BACKEND_URL:-http://backend:3001}

# Substitute environment variables in nginx config
envsubst '${API_BACKEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Execute the main command
exec "$@"

