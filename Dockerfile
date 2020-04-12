FROM node

COPY . /online-json-diff
WORKDIR /online-json-diff
RUN npm install
EXPOSE 5000
ENTRYPOINT ["npm", "start"]
