FROM mhart/alpine-node:latest
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN yarn install
COPY . .
CMD ["yarn", "dev"]