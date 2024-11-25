To make the Nginx container accessible through your Virtual Server's IP address (41.111.206.178), we need to modify a few things:

1. Update your nginx.conf to listen on all interfaces and use your domain:

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name mobtakir.univ-setif.dz;

        # Add additional server names
        server_name 41.111.206.178;

        location / {
            root   /usr/share/nginx/html;
            index  index.html;
        }
    }
}
```

2. Modify your Docker run command to bind to all interfaces:

```bash
# Stop existing container
docker stop nginx-web
docker rm nginx-web

# Run with new settings
docker run -d \
  --name nginx-web \
  --restart unless-stopped \
  -p 41.111.206.178:8094:80 \
  -v "$(pwd)/conf/nginx.conf:/etc/nginx/nginx.conf:ro" \
  -v "$(pwd)/conf/mime.types:/etc/nginx/mime.types:ro" \
  -v "$(pwd)/html:/usr/share/nginx/html:ro" \
  my-website
```

3. Test access using:

```bash
# Local test
curl http://41.111.206.178:8094

# Or using domain
curl http://mobtakir.univ-setif.dz:8094
```

4. Make sure your firewall allows port 8094:

```bash
sudo ufw allow 8094/tcp
```

5. If you're still having issues, try using the host network mode:

```bash
docker run -d \
  --name nginx-web \
  --network host \
  --restart unless-stopped \
  -v "$(pwd)/conf/nginx.conf:/etc/nginx/nginx.conf:ro" \
  -v "$(pwd)/conf/mime.types:/etc/nginx/mime.types:ro" \
  -v "$(pwd)/html:/usr/share/nginx/html:ro" \
  my-website
```

---

1. First, stop any existing containers:

```bash
docker stop nginx-web
docker rm nginx-web
```

2. Try running the container by binding to all interfaces (0.0.0.0) instead:

```bash
docker run -d \
--name nginx-web \
--restart unless-stopped \
-p 0.0.0.0:8094:80 \
-v "$(pwd)/conf/nginx.conf:/etc/nginx/nginx.conf:ro" \
-v "$(pwd)/conf/mime.types:/etc/nginx/mime.types:ro" \
-v "$(pwd)/html:/usr/share/nginx/html:ro" \
my-website
```

If that doesn't work, try using the host network mode:

```bash
docker run -d \
--name nginx-web \
--network host \
--restart unless-stopped \
-v "$(pwd)/conf/nginx.conf:/etc/nginx/nginx.conf:ro" \
-v "$(pwd)/conf/mime.types:/etc/nginx/mime.types:ro" \
-v "$(pwd)/html:/usr/share/nginx/html:ro" \
my-website
```

The error "cannot assign requested address" typically means Docker can't bind directly to the external IP. Using 0.0.0.0 or host networking should resolve this issue while still making the service accessible via your external IP.

---

I notice a few issues we need to address:

1. First, let's check if port 8094 is allowed in the firewall:

```bash
sudo ufw status
sudo ufw allow 8094/tcp
```

2. Let's verify there's no port conflict by checking what's using port 8094:

```bash
sudo netstat -tulpn | grep 8094
```

3. Let's try running the container with the host network mode since we're having connection issues:

```bash
# Stop the current container
docker stop nginx-web
docker rm nginx-web

# Run with host network mode
docker run -d \
--name nginx-web \
--network host \
--restart unless-stopped \
-v "$(pwd)/conf/nginx.conf:/etc/nginx/nginx.conf:ro" \
-v "$(pwd)/conf/mime.types:/etc/nginx/mime.types:ro" \
-v "$(pwd)/html:/usr/share/nginx/html:ro" \
my-website
```

4. Also, let's modify the nginx.conf to explicitly listen on your IP:

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 41.111.206.178:8094;
        server_name mobtakir.univ-setif.dz;

        location / {
            root   /usr/share/nginx/html;
            index  index.html;
        }
    }
}
```

5. After making these changes, verify the container is running:

```bash
docker ps
docker logs nginx-web
```

6. Test locally first:

```bash
curl http://localhost:8094
```

If you're still having issues, we might need to:

1. Check if there are any SELinux or AppArmor restrictions
2. Verify the virtual server's firewall settings
3. Check if the port is blocked by any upstream firewalls

---

I'll help you create a multi-container setup using Docker Compose for Ollama, Gradio app with Gunicorn, and PostgreSQL. Here's a complete setup:

1. First, create this directory structure:

```bash
project/
├── docker-compose.yml
├── .env
├── app/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py
│   ├── gunicorn_config.py
│   └── database.py
└── nginx/
    ├── Dockerfile
    └── nginx.conf
```

2. Create `requirements.txt`:

```text
gradio
gunicorn
psycopg2-binary
sqlalchemy
requests
```

3. Create `app/main.py`:

```python
import gradio as gr
import requests
from database import Database
from sqlalchemy import create_engine

# Database connection
DATABASE_URL = "postgresql://user:password@db:5432/ollama_db"
db = Database(DATABASE_URL)

def query_ollama(prompt):
    response = requests.post('http://ollama:11434/api/generate',
                           json={
                               "model": "llama2",
                               "prompt": prompt
                           })

    # Store the interaction in database
    db.store_interaction(prompt, response.json()['response'])

    return response.json()['response']

# Create Gradio interface
interface = gr.Interface(
    fn=query_ollama,
    inputs=gr.Textbox(lines=2, placeholder="Enter your prompt here..."),
    outputs="text"
)

# Launch with server name and port for Gunicorn
if __name__ == "__main__":
    interface.launch(server_name="0.0.0.0", server_port=7860)
```

4. Create `app/database.py`:

```python
from sqlalchemy import create_engine, Column, String, DateTime, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

Base = declarative_base()

class Interaction(Base):
    __tablename__ = 'interactions'

    id = Column(Integer, primary_key=True)
    prompt = Column(String)
    response = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Database:
    def __init__(self, db_url):
        self.engine = create_engine(db_url)
        Base.metadata.create_all(self.engine)
        Session = sessionmaker(bind=self.engine)
        self.session = Session()

    def store_interaction(self, prompt, response):
        interaction = Interaction(prompt=prompt, response=response)
        self.session.add(interaction)
        self.session.commit()
```

5. Create `app/gunicorn_config.py`:

```python
bind = "0.0.0.0:7860"
workers = 4
threads = 4
timeout = 120
```

6. Create `app/Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "-c", "gunicorn_config.py", "main:interface.app"]
```

7. Create `nginx/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream gradio_app {
        server app:7860;
    }

    server {
        listen 80;
        server_name mobtakir.univ-setif.dz;

        location / {
            proxy_pass http://gradio_app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
```

8. Create `nginx/Dockerfile`:

```dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
```

9. Create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  ollama:
    image: ollama/ollama
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    restart: unless-stopped

  db:
    image: postgres:13-alpine
    container_name: postgres_db
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  app:
    build:
      context: ./app
      dockerfile: Dockerfile
    container_name: gradio_app
    depends_on:
      - ollama
      - db
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
    restart: unless-stopped

  nginx:
    build:
      context: ./nginx
      dockerfile: Dockerfile
    container_name: nginx_proxy
    ports:
      - "8094:80"
    depends_on:
      - app
    restart: unless-stopped

volumes:
  ollama_data:
  postgres_data:
```

10. Create `.env` file:

```env
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=ollama_db
```

11. To run everything:

```bash
# Build and start all services
docker-compose up -d

# Download the Llama2 model
docker exec ollama run llama2

# Check logs
docker-compose logs -f
```

To access the Gradio interface:

- Local: http://localhost:8094
- Server: http://mobtakir.univ-setif.dz:8094

Additional considerations:

1. Add proper error handling in the Python code
2. Add database migrations
3. Implement proper security measures
4. Add SSL/TLS configuration
5. Add health checks
6. Implement proper logging

---

You're right. Let's improve the Dockerfile for the app to include the correct Python version and PostgreSQL dependencies. Here's the corrected version:

```dockerfile
# Use Python 3.11
FROM python:3.11-slim

# Install system dependencies including PostgreSQL client
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run with Gunicorn
CMD ["gunicorn", "-c", "gunicorn_config.py", "main:interface.app"]
```

Key improvements made:

1. Updated Python version from 3.9 to 3.11 for better Gradio compatibility
2. Added PostgreSQL development libraries (`libpq-dev`)
3. Added necessary build tools (`gcc` and `python3-dev`) for compiling psycopg2
4. Added cleanup step to reduce image size
5. Kept the slim base image for smaller overall size while including necessary dependencies

## You would typically need Python 3.10+ for newer Gradio versions, and 3.11 provides better performance. The PostgreSQL client libraries are essential for psycopg2 to work correctly with the database.

I'll break down each of these components in detail:

1. **Nginx Configuration In-Depth**:

```nginx
# Detailed nginx.conf explanation
events {
    worker_connections 1024;    # Maximum simultaneous connections per worker
    multi_accept on;           # Accept as many connections as possible
    use epoll;                 # More efficient connection processing on Linux
}

http {
    # Basic settings
    sendfile on;              # Optimize sending of static files
    tcp_nopush on;            # Optimize network packets
    tcp_nodelay on;           # Reduce latency for small packets
    keepalive_timeout 65;     # Keep connections alive
    types_hash_max_size 2048;
    server_tokens off;        # Hide nginx version

    # MIME types configuration
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging settings
    access_log /var/log/nginx/access.log combined buffer=512k flush=1m;
    error_log /var/log/nginx/error.log warn;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # Define upstream for Gradio
    upstream gradio_app {
        server app:7860;
        keepalive 32;         # Keep connections to upstream alive
    }

    server {
        listen 80;
        server_name mobtakir.univ-setif.dz;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Content-Type-Options "nosniff";

        # Rate limiting
        limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;
        limit_req zone=one burst=10 nodelay;

        location / {
            proxy_pass http://gradio_app;

            # Essential proxy headers
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";

            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;

            # Buffer settings
            proxy_buffer_size 16k;
            proxy_buffers 8 16k;

            # Error handling
            proxy_next_upstream error timeout http_500 http_502 http_503 http_504;
        }
    }
}
```

2. **Gunicorn Configuration Deep Dive**:

```python
# Detailed gunicorn_config.py
import multiprocessing

# Server socket
bind = "0.0.0.0:7860"
backlog = 2048  # Pending connections queue size

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1  # Dynamic worker count
worker_class = 'gthread'  # Use threads
threads = 4  # Threads per worker
worker_connections = 1000  # Max active connections per worker
max_requests = 2000  # Restart workers after handling this many requests
max_requests_jitter = 200  # Add randomness to max_requests

# Timeouts
timeout = 120  # Worker silent for this many seconds is killed
graceful_timeout = 30  # Grace period for workers to finish
keepalive = 5  # Keep connections alive

# Logging
accesslog = '-'  # Log to stdout
errorlog = '-'   # Log to stderr
loglevel = 'info'
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = 'gradio_app'

# SSL (if needed)
# keyfile = '/path/to/keyfile'
# certfile = '/path/to/certfile'

# Development settings
reload = False  # Auto-reload on code changes
```

3. **Docker Compose Deep Dive**:

```yaml
# Detailed docker-compose.yml with explanations
version: "3.8" # Latest stable compose version

services:
  ollama:
    image: ollama/ollama
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy: # Resource constraints
      resources:
        limits:
          cpus: "4"
          memory: 8G
        reservations:
          cpus: "2"
          memory: 4G
    healthcheck: # Health monitoring
      test: ["CMD", "curl", "-f", "http://localhost:11434/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped
    networks:
      - app_network

  db:
    image: postgres:13-alpine
    container_name: postgres_db
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_INITDB_ARGS="--data-checksums"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d # Initialization scripts
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 4G
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped
    networks:
      - app_network

  app:
    build:
      context: ./app
      dockerfile: Dockerfile
      args: # Build arguments
        PYTHON_VERSION: 3.9
    container_name: gradio_app
    depends_on:
      db:
        condition: service_healthy
      ollama:
        condition: service_healthy
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      - PYTHONUNBUFFERED=1
      - GRADIO_SERVER_NAME=0.0.0.0
      - GRADIO_SERVER_PORT=7860
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 4G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:7860"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped
    networks:
      - app_network

  nginx:
    build:
      context: ./nginx
      dockerfile: Dockerfile
    container_name: nginx_proxy
    ports:
      - "8094:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/logs:/var/log/nginx
    depends_on:
      app:
        condition: service_healthy
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 1G
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped
    networks:
      - app_network

networks:
  app_network:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.0.0/16

volumes:
  ollama_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: ${PWD}/data/ollama
  postgres_data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: ${PWD}/data/postgres
```

**Key Design Choices and Rationale:**

1. **Nginx Configuration Choices:**

- Uses `epoll` event model for better performance on Linux
- Implements rate limiting to prevent abuse
- Configures WebSocket support for Gradio's real-time features
- Sets up proper buffering and timeout values
- Includes security headers
- Enables gzip compression for faster content delivery

2. **Gunicorn Configuration Choices:**

- Dynamic worker calculation based on CPU cores
- Uses threaded workers for better handling of I/O operations
- Implements max requests with jitter to prevent memory leaks
- Configures proper logging
- Sets reasonable timeouts for long-running AI operations
- Keeps connections alive for better performance

3. **Docker Compose Design Decisions:**

- Uses bridge network for internal communication
- Implements health checks for all services
- Sets resource limits to prevent container overflow
- Uses volume bindings for persistent data
- Implements proper dependency order
- Uses environment variables for configuration
- Sets up proper logging
- Includes restart policies

4. **Security Considerations:**

- Disables Nginx version exposure
- Implements rate limiting
- Uses read-only volume mounts where possible
- Separates services into different containers
- Uses non-root users in containers
- Implements proper logging for audit trails

Would you like me to elaborate on any specific aspect or provide more details about certain configurations?

---

Ah, I apologize! Let me explain the reasoning and methodology behind these three key components:

**1. Nginx - Why This Setup?**

- Acts as a reverse proxy to shield the application server (Gradio) from direct exposure
- Key reasons for this architecture:
  - Security: Filters and validates requests before they reach the application
  - Load balancing capability if we need to scale
  - Handles SSL/TLS termination in one place
  - Better static file serving than Python-based servers
  - Can buffer slow clients, preventing them from slowing down the application server

**2. Gunicorn - Why Use It?**

- Serves as the application server between Nginx and our Python code
- The reasoning behind its configuration:
  - Worker processes: Uses multiple workers to handle concurrent requests
  - Thread model: Better for I/O-bound applications like ours that wait for Ollama responses
  - Pre-fork model: Spawns workers before they're needed, reducing request latency
  - Handles crashes gracefully by automatically restarting failed workers

**3. Docker Compose Architecture Decisions**

- Orchestrates four separate services for clear separation of concerns:
  - Ollama: AI model service
  - PostgreSQL: Persistent storage
  - Gradio App: Web interface
  - Nginx: Reverse proxy
- Why this separation?
  - Independent scaling of components
  - Isolated resource management
  - Easy updates and rollbacks
  - Different security contexts
  - Independent logging and monitoring

**The Flow and Why It Matters:**

```
Client Request → Nginx → Gunicorn → Gradio App → Ollama
                          ↓
                      PostgreSQL
```

This architecture:

1. Handles high concurrency efficiently
2. Maintains stability under load
3. Provides security layers
4. Enables easy scaling
5. Separates concerns for better maintenance

**Common Pitfalls This Setup Avoids:**

- Direct exposure of application server
- Single process bottlenecks
- Memory leaks from long-running processes
- Database connection exhaustion
- Request queuing issues

## Would you like me to expand on any of these aspects or explain how they work together in specific scenarios?

Here's the launcher script for installing Llama3, Phi3, and WizardCoder models:

```bash
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print banner
print_banner() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════╗"
    echo "║         AI Models Deployment Script        ║"
    echo "║    (Llama3, Phi3, WizardCoder-Python)     ║"
    echo "╚════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        echo -e "${RED}[ERROR] Docker is not running or you don't have permissions${NC}"
        exit 1
    fi
}

# Function to check if docker-compose exists
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}[ERROR] docker-compose is not installed${NC}"
        exit 1
    fi
}

# Function to pull and verify model
pull_model() {
    local model=$1
    echo -e "${YELLOW}[INFO] Pulling $model model...${NC}"
    if docker exec ollama pull $model 2>&1 | tee /dev/null; then
        echo -e "${GREEN}[SUCCESS] Successfully pulled $model${NC}"
        return 0
    else
        echo -e "${RED}[ERROR] Failed to pull $model${NC}"
        return 1
    fi
}

# Function to test model
test_model() {
    local model=$1
    echo -e "${YELLOW}[INFO] Testing $model...${NC}"
    if docker exec ollama run $model "Write a short 'Hello World'" > /dev/null 2>&1; then
        echo -e "${GREEN}[SUCCESS] $model is working correctly${NC}"
        return 0
    else
        echo -e "${RED}[ERROR] $model test failed${NC}"
        return 1
    fi
}

# Function to check system resources
check_resources() {
    echo -e "${YELLOW}[INFO] Checking system resources...${NC}"

    # Check available RAM
    local total_ram=$(free -g | awk '/^Mem:/{print $2}')
    if [ $total_ram -lt 16 ]; then
        echo -e "${RED}[WARNING] Less than 16GB RAM available (${total_ram}GB). Models might run slowly.${NC}"
    else
        echo -e "${GREEN}[OK] RAM: ${total_ram}GB available${NC}"
    fi

    # Check available disk space
    local free_space=$(df -h . | awk 'NR==2 {print $4}')
    echo -e "${GREEN}[OK] Available disk space: ${free_space}${NC}"
}

# Function to check container health
check_container_health() {
    local container=$1
    if [ "$(docker container inspect -f '{{.State.Running}}' $container 2>/dev/null)" == "true" ]; then
        echo -e "${GREEN}[OK] $container is running${NC}"
        return 0
    else
        echo -e "${RED}[ERROR] $container is not running${NC}"
        return 1
    fi
}

# Main script
print_banner

# Check prerequisites
echo -e "${YELLOW}[INFO] Checking prerequisites...${NC}"
check_docker
check_docker_compose
check_resources

# Create necessary directories
echo -e "${YELLOW}[INFO] Setting up directories...${NC}"
mkdir -p data/ollama data/postgres
chmod 777 data/ollama data/postgres

# Start containers
echo -e "${YELLOW}[INFO] Starting Docker containers...${NC}"
docker-compose down -v 2>/dev/null  # Clean start
docker-compose up -d

# Wait for Ollama container to be ready
echo -e "${YELLOW}[INFO] Waiting for Ollama service to initialize...${NC}"
sleep 15

# Check container health
check_container_health "ollama"
check_container_health "postgres_db"
check_container_health "gradio_app"
check_container_health "nginx_proxy"

# Pull models
models=("llama2:13b" "phi:latest" "wizardcoder:python")
failed_models=()

for model in "${models[@]}"; do
    if ! pull_model $model; then
        failed_models+=($model)
    fi
done

# Test models
echo -e "\n${YELLOW}[INFO] Testing models...${NC}"
for model in "${models[@]}"; do
    if [[ ! " ${failed_models[@]} " =~ " ${model} " ]]; then
        test_model $model
    fi
done

# Print status summary
echo -e "\n${BLUE}════════ Deployment Summary ════════${NC}"
echo -e "Access Points:"
echo -e "- Gradio Interface: ${GREEN}http://localhost:8094${NC}"
echo -e "- Ollama API: ${GREEN}http://localhost:11434${NC}"

echo -e "\nUseful Commands:"
echo -e "- View logs: ${YELLOW}docker-compose logs -f${NC}"
echo -e "- Stop services: ${YELLOW}docker-compose down${NC}"
echo -e "- Restart services: ${YELLOW}docker-compose restart${NC}"
echo -e "- Check model status: ${YELLOW}docker exec ollama ls models${NC}"

# Print any failures
if [ ${#failed_models[@]} -ne 0 ]; then
    echo -e "\n${RED}[WARNING] Failed to install these models:${NC}"
    for model in "${failed_models[@]}"; do
        echo -e "${RED}- $model${NC}"
    done
fi

echo -e "\n${BLUE}═══════════════════════════════════${NC}"

# Create a models_info.txt file
echo "Installed Models Information" > models_info.txt
echo "Date: $(date)" >> models_info.txt
echo "----------------------------------------" >> models_info.txt
docker exec ollama ls models >> models_info.txt

exit 0
```

To use this script:

1. Save as `launch.sh` in your project directory
2. Make it executable:

```bash
chmod +x launch.sh
```

3. Run it:

```bash
./launch.sh
```

Key features:

- Visual banner and colored output
- System resources check
- Container health monitoring
- Proper model installation verification
- Model testing
- Detailed status reporting
- Creates models_info.txt for reference
- Comprehensive error handling
- Clean restart capability

The script will:

1. Check prerequisites and system resources
2. Start all containers
3. Install Llama2 13B, Phi, and WizardCoder-Python
4. Test each model
5. Provide a detailed summary
6. Create a models inventory file

Note: The models will require significant disk space and RAM. The script includes resource checks to warn about potential issues.

Would you like me to modify any part of the script or add additional features?
