FROM node:18-alpine

WORKDIR /

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
# Omit --production flag for TypeScript devDependencies
RUN npm ci

COPY pages ./pages
COPY public ./public
COPY styles ./styles
COPY next.config.mjs .
COPY tsconfig.json .
COPY tailwind.config.ts .
COPY postcss.config.js .

RUN npm run build

CMD npm run start