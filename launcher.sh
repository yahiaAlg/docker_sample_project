# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to create directory and print status
create_dir() {
    mkdir -p "$1"
    echo -e "${GREEN}Created directory:${NC} $1"
}

# Function to create file and print status
create_file() {
    touch "$1"
    echo -e "${BLUE}Created file:${NC} $1"
}

# Create project root directory
PROJECT_DIR="ollama_gradio_project"
create_dir "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Create app directory and files
create_dir "app"
create_file "app/main.py"
create_file "app/wsgi.py"
create_file "app/requirements.txt"

# Create ollama directory and Dockerfile
create_dir "ollama"
create_file "ollama/Dockerfile"

# Create nginx directory and config
create_dir "nginx"
create_file "nginx/nginx.conf"

# Create root level files
create_file "docker-compose.yml"
create_file "Dockerfile"
create_file ".env"
create_file ".gitignore"

# Create initial .gitignore content
cat << 'GITIGNORE' > .gitignore
__pycache__/
*.py[cod]
*$py.class
.env
.venv
env/
venv/
ENV/
*.log
.DS_Store
GITIGNORE

# Create initial .env content
cat << 'ENVFILE' > .env
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_db
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
GRADIO_SERVER_PORT=7860
NGINX_PORT=80
OLLAMA_PORT=11434
ENVFILE

# Create initial requirements.txt content
cat << 'REQUIREMENTS' > app/requirements.txt
gradio>=4.0.0
requests>=2.31.0
psycopg2-binary>=2.9.9
gunicorn>=21.2.0
gevent>=24.2.1
python-dotenv>=1.0.0
REQUIREMENTS

echo -e "\n${GREEN}Project structure created successfully!${NC}"
echo -e "Project location: $(pwd)/${PROJECT_DIR}"
echo -e "\nNext steps:"
echo -e "1. cd ${PROJECT_DIR}"
echo -e "2. Review and modify the configuration files"
echo -e "3. Run 'docker-compose up -d' to start the services"
