FROM nginx:alpine

# Copy configuration files
COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY conf/mime.types /etc/nginx/mime.types

# Copy HTML files
COPY html /usr/share/nginx/html