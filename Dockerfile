# Stage One
FROM reg.ariaco.org/ariaco/node:wide-base-gyp-18.16.1 AS builder

USER root
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY . .

RUN npm ci
RUN npm run build

RUN npm ci --omit=dev


# Stage Two
FROM reg.ariaco.org/ariaco/node:wide-base-gyp-18.16.1 AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Install font dependencies
RUN apk add --no-cache fontconfig

# Update font cache
RUN fc-cache -f

COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/package.json ./package.json

EXPOSE 3113

CMD [ "npm", "run", "start:prod" ]
