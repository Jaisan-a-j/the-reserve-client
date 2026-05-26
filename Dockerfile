FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# 1. Accept the argument coming from GitHub Actions
ARG VITE_API_BASE_URL

# 2. Assign it so Vite can see it during compilation
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# 3. Now build your application
RUN npm run build

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]