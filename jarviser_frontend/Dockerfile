FROM node:14.21.3
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 실행 스테이지
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 81
EXPOSE 4443
CMD ["nginx", "-g", "daemon off;"]