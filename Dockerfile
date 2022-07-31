FROM node:16
WORKDIR /app
COPY controllers controllers
COPY middlewares middlewares
COPY models models
COPY router router
COPY service service
COPY utils utils
COPY app.js app.js
COPY package.json package.json
RUN npm install --save
CMD ["app.js"]