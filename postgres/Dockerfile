FROM postgres:alpine
COPY Service/AuthService/sql/databases.sql /docker-entrypoint-initdb.d/1.auth.databases.sql
COPY Service/ListingService/sql/databases.sql /docker-entrypoint-initdb.d/2.listing.databases.sql
COPY Service/OrderService/sql/databases.sql /docker-entrypoint-initdb.d/3.order.databases.sql
COPY Service/CorporateService/sql/databases.sql /docker-entrypoint-initdb.d/4.corporate.databases.sql
COPY Service/CartService/sql/databases.sql /docker-entrypoint-initdb.d/5.cart.databases.sql