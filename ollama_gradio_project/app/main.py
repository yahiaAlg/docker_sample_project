import gradio as gr
import requests
import psycopg2
import time
import os

def create_app():
    def connect_db():
        return psycopg2.connect(
            dbname="your_db",
            user="your_user",
            password="your_password",
            host="postgres"
        )

    def wait_for_ollama():
        max_retries = 30
        for _ in range(max_retries):
            try:
                response = requests.get('http://ollama:11434/api/tags')
                if response.status_code == 200:
                    return True
            except requests.exceptions.RequestException:
                time.sleep(1)
        return False

    def chat(message, model_name, history):
        if not wait_for_ollama():
            return "Error: Ollama service is not available"

        try:
            response = requests.post(
                'http://ollama:11434/api/chat',
                json={
                    "model": model_name,
                    "messages": [{"role": "user", "content": message}]
                },
                timeout=60
            )
            response_content = response.json()['message']['content']
            
            conn = connect_db()
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO conversations (message, response, model) VALUES (%s, %s, %s)",
                (message, response_content, model_name)
            )
            conn.commit()
            cur.close()
            conn.close()
            
            return response_content
        except Exception as e:
            return f"Error: {str(e)}"

    # Create the interface with model selection
    with gr.Blocks() as demo:
        model_dropdown = gr.Dropdown(
            choices=["phi", "llama2", "wizardcoder"],
            value="phi",
            label="Select Model"
        )
        chatbot = gr.ChatInterface(
            fn=lambda message, history: chat(message, model_dropdown.value, history)
        )

    return demo

if __name__ == "__main__":
    demo = create_app()
    demo.launch()