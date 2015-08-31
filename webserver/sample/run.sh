#VOLUME ["/etc/nginx/sites-enabled", "/etc/nginx/certs", 
#"/etc/nginx/conf.d", "/var/log/nginx", "/var/upload", "/home/www" ]
#

docker run --name webserver -d \
  -v `pwd`/log:/var/log/nginx \
  -v `pwd`/upload:/var/upload \
  -p 8000:80 -p 8433:443 \
  -t pointlook/webserver

docker exec -it webserver bash
