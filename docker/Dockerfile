FROM mf_nodebox:latest

MAINTAINER reharik@gmail.com

ADD ./package.json ./package.json
ADD ./config ./config

RUN npm install --silent

ADD ./app /$HOME/app
