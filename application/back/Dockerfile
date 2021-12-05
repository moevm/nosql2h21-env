FROM node:16-alpine

ARG DOCKER
ENV DOCKER=$DOCKER

WORKDIR /app

COPY ["package.json", "./"]
RUN npm install

COPY . .
CMD ["npm", "start"]
