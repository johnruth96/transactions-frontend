# Build stage
FROM node:20-alpine AS build
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
COPY --from=config config.ts src/app/config.ts
COPY --from=config rules.tsx src/app/rules.tsx
RUN NODE_OPTIONS=--max_old_space_size=1000 npm run build

# Production stage
FROM nginx:stable-alpine AS production
COPY --from=build /src/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
