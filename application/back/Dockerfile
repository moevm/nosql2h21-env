FROM node:16-alpine

ARG DOCKER
ENV DOCKER=$DOCKER

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
RUN npm install

COPY . .
CMD ["npm", "start"]
