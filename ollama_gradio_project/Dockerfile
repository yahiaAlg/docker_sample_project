FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ .

# Run with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--workers", "3", "--timeout", "300", "--worker-class", "gevent", "wsgi:app"]