#!/bin/bash

echo "Creating Nginx config..."

sudo bash -c 'cat > /etc/nginx/sites-available/django-pms <<EOF
server {
    listen 80;
    server_name _;

    location = /favicon.ico { access_log off; log_not_found off; }

    location /static/ {
        root /home/ubuntu/Django-PMS;
    }

    location /media/ {
        root /home/ubuntu/Django-PMS;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/run/gunicorn.sock;
    }
}
EOF'

echo "Enable Nginx config..."

sudo ln -s /etc/nginx/sites-available/django-pms /etc/nginx/sites-enabled

sudo rm -f /etc/nginx/sites-enabled/default

echo "Restart Nginx..."

sudo systemctl restart nginx
sudo systemctl enable nginx

echo "Nginx Setup Completed"