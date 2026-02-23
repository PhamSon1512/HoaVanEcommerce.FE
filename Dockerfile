# Giai đoạn 1: Build Angular
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx ng build --configuration=production

# Giai đoạn 2: Serve bằng Nginx
FROM nginx:alpine
COPY --from=build /app/dist/hoavan-ecommerce-fe /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80