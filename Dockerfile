FROM node:20-alpine

WORKDIR /app

# 1. Copy package files first to leverage Docker caching
COPY package*.json ./

# 2. Install dependencies
RUN npm install

# 3. CRITICAL FIX: Copy your actual source code BEFORE running the build step
COPY . .

# 4. Accept the arguments coming from your GitHub Actions pipeline
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# 5. Build your application
RUN npm run build

# 6. Expose port 5173 to tell Render where traffic goes
EXPOSE 5173

# 7. Start your development server bound to all network interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]