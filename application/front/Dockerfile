FROM node:16-alpine

ARG REACT_APP_DOCKER
ENV REACT_APP_DOCKER=$REACT_APP_DOCKER

WORKDIR /app

COPY ["package.json", "./"]
RUN npm install

COPY . .
CMD ["npm", "start"]
