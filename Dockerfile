FROM node:14.16.0-alpine
ENV NODE_ENV=prod
WORKDIR /SAC
COPY /package.json /SAC
COPY /package-lock.json /SAC
EXPOSE 8000
RUN npm install --production
RUN npm install dotenv -save
COPY . /SAC
CMD [ "node", "src/index.js" ]
