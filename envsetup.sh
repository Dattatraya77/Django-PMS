#!/bin/bash

echo "Creating virtual environment..."

cd /home/ubuntu/Django-PMS

python3 -m venv venv

echo "Activating virtual environment..."

source venv/bin/activate

echo "Installing requirements..."

pip install --upgrade pip

pip install gunicorn
pip install psycopg2-binary

if [ -f requirements.txt ]; then
    pip install -r requirements.txt
fi

echo "Collect static files..."

python manage.py collectstatic --noinput

echo "Running migrations..."