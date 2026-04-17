#!/bin/bash

echo "Creating virtual environment..."

cd $WORKSPACE

source venv/bin/activate

echo "collecting static files..."

python manage.py collectstatic --noinput

echo "Completed collecting static files..."