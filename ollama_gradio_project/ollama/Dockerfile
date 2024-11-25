FROM ollama/ollama:latest

# Create a script to pull models
COPY <<EOF /pull-models.sh
#!/bin/bash
ollama serve & 
sleep 5
ollama pull phi3
ollama pull llama3.1
ollama pull wizardcoder
pkill ollama
EOF

# Make script executable and run it during build
RUN chmod +x /pull-models.sh && \
    ./pull-models.sh

EXPOSE 11434

CMD ["ollama", "serve"]