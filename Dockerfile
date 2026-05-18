FROM node:25-alpine

WORKDIR /home/app

COPY package.json ./
COPY .env ./

COPY Service/AuthService/package.json Service/AuthService/package-lock.json ./Service/AuthService/
COPY Service/ListingService/package.json Service/ListingService/package-lock.json ./Service/ListingService/
COPY Service/OrderService/package.json Service/OrderService/package-lock.json ./Service/OrderService/
COPY App/Admin/package.json App/Admin/package-lock.json ./App/Admin/
COPY App/seller/backend/package.json App/seller/backend/package-lock.json ./App/seller/backend/
COPY App/seller/frontend/package.json App/seller/frontend/package-lock.json ./App/seller/frontend/
COPY App/shopper/backend/package.json App/shopper/backend/package-lock.json ./App/shopper/backend/
COPY App/shopper/frontend/package.json App/shopper/frontend/package-lock.json ./App/shopper/frontend/

COPY Service/AuthService/src ./Service/AuthService/src
COPY Service/AuthService/tsoa.json Service/AuthService/tsconfig.json ./Service/AuthService/
COPY Service/ListingService/src ./Service/ListingService/src
COPY Service/ListingService/tsoa.json Service/ListingService/tsconfig.json ./Service/ListingService/
COPY Service/OrderService/src ./Service/OrderService/src
COPY Service/OrderService/tsconfig.json ./Service/OrderService/
COPY App/Admin/src ./App/Admin/src
COPY App/Admin/next.config.ts App/Admin/tsconfig.json App/Admin/next-env.d.ts ./App/Admin/
COPY App/seller/backend/src ./App/seller/backend/src
COPY App/seller/backend/tsoa.json App/seller/backend/tsconfig.json ./App/seller/backend/
COPY App/seller/frontend/src ./App/seller/frontend/src
COPY App/seller/frontend/public ./App/seller/frontend/public
COPY App/seller/frontend/index.html App/seller/frontend/tsconfig.json App/seller/frontend/vite.config.ts ./App/seller/frontend/
COPY App/shopper/backend/src ./App/shopper/backend/src
COPY App/shopper/backend/tsoa.json App/shopper/backend/tsconfig.json ./App/shopper/backend/
COPY App/shopper/frontend/src ./App/shopper/frontend/src
COPY App/shopper/frontend/public ./App/shopper/frontend/public
COPY App/shopper/frontend/index.html App/shopper/frontend/tsconfig.json App/shopper/frontend/vite.config.ts ./App/shopper/frontend/

EXPOSE 3000 5173 5174 3013 3012 4000

RUN npm run cis

CMD [ "npm", "start" ]
