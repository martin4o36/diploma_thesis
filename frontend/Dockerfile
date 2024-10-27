FROM node:20.14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# This is the default dev port for Vite
EXPOSE 5173

ENV NODE_ENV=development

CMD ["npm", "start"]