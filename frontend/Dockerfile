FROM node:12.7-alpine AS build
RUN mkdir -p /usr/src/frontend
WORKDIR /usr/src/frontend
COPY package.json /usr/src/frontend
RUN npm install
COPY . /usr/src/frontend
CMD [ “npm”, “start” ]


FROM nginx:1.17.1-alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/frontend/ /usr/share/nginx/html
EXPOSE 80