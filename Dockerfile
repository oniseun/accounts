FROM node:16-alpine As development
ENV HOME=/usr/src/app
ENV NODE_ENV=development
COPY package.json ${WORKDIR}/
COPY package-lock.json ${WORKDIR}/
RUN npm install --production=false
COPY . .
EXPOSE 3000

CMD ["npm","run", "start:debug"]