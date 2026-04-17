#!/bin/bash

echo "Creating virtual environment..."

cd /home/ubuntu/Django-PMS

echo "Activating virtual environment..."

source venv/bin/activate

echo "Collect static files..."

python manage.py collectstatic --noinput
