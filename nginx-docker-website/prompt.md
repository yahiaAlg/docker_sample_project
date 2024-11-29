# Inside your container

docker exec nginx-web chown -R nginx:nginx /usr/share/nginx/html
docker exec nginx-web chmod -R 755 /usr/share/nginx/html
docker exec nginx-web chmod 644 /usr/share/nginx/html/css/style.css
