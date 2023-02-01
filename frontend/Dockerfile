FROM nginx

RUN mkdir /app

WORKDIR /app

RUN mkdir ./build

ADD ./build ./build

COPY ./nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]