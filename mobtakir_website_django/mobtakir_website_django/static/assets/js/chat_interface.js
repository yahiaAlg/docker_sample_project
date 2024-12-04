document.addEventListener("DOMContentLoaded", function () {
  const chatContainer = document.getElementById("chatContainer");
  const chatForm = document.getElementById("chatForm");
  const userInput = document.getElementById("userInput");
  const typingIndicator = document.getElementById("typingIndicator");
  const csrfToken = document.querySelector("[name=csrfmiddlewaretoken]").value;
  const sessionsList = document.getElementById("sessionsList");

  let currentSessionId = null;

  // Function to add a message to the chat
  function addMessage(content, isUser = false) {
    const messageDiv = document.createElement("div");
    const date =  new Date()
    messageDiv.className = `message ${
      isUser ? "user-message" : "bot-message"
    }`;
    // contain the time and content of the new message
    
    messageDiv.innerHTML = `
      ${content}
      <div class="message-time">${date.toLocaleTimeString()}</div> 
    `;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // Function to show/hide typing indicator
  function toggleTypingIndicator(show) {
    typingIndicator.style.display = show ? "block" : "none";
  }

  // Function to load chat history
  async function loadChatHistory(sessionId) {
    try {
      const response = await fetch(`/chat/history/${sessionId}/`);
      const data = await response.json();

      // Clear current chat
      chatContainer.innerHTML = "";

      // Load messages
      data.messages.forEach((msg) => {
        addMessage(msg.content, msg.role === "user");
      });

      currentSessionId = sessionId;

      // Update visual indication of selected session
      document.querySelectorAll(".chat-session").forEach((session) => {
        session.classList.remove("active");
        if (session.dataset.sessionId === sessionId.toString()) {
          session.classList.add("active");
        }
      });
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  }

  // Function to load chat sessions
  async function loadChatSessions() {
    try {
      const response = await fetch("/chat/sessions/");
      const data = await response.json();

      sessionsList.innerHTML = ""; // Clear existing sessions

      data.sessions.forEach((session) => {
        const sessionElement = document.createElement("div");
        sessionElement.className = "chat-session";
        sessionElement.dataset.sessionId = session.id;

        const title = session.title || "Untitled Chat";
        const date = new Date(session.updated_at).toLocaleString();

        sessionElement.innerHTML = `
                  <div class="history-item active" >
                    <i class="fas fa-comment"></i>
                    ${title}
                    <div class="message-time" >${date.toLocaleLowerCase()}</div>
                  </div>
                `;

        sessionElement.addEventListener("click", () =>
          loadChatHistory(session.id)
        );
        sessionsList.appendChild(sessionElement);
      });
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  }

  // Load initial chat sessions
  loadChatSessions();

  // Handle "New Chat" button click
  document.getElementById("newChatBtn").addEventListener("click", () => {
    currentSessionId = null;
    chatContainer.innerHTML = "";
    addMessage(
      "Hello! I'm your AI assistant. I can help you with text, images, code, and more.",
      false
    );

    // Update visual indication
    document.querySelectorAll(".chat-session").forEach((session) => {
      session.classList.remove("active");
    });
  });

  // Handle form submission
  chatForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, true);
    userInput.value = "";
    toggleTypingIndicator(true);

    try {
      const formData = new FormData();
      formData.append("prompt", userMessage);
      if (currentSessionId) {
        formData.append("session_id", currentSessionId);
      }

      const response = await fetch("/chat/", {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
        },
        body: formData,
      });

      const data = await response.json();
      toggleTypingIndicator(false);

      if (data.content) {
        addMessage(data.content);
        if (!currentSessionId) {
          currentSessionId = data.session_id;
          // Reload sessions list to show the new session
          loadChatSessions();
        }
      } else if (data.error) {
        addMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toggleTypingIndicator(false);
      addMessage("Sorry, there was an error processing your request.");
    }
  });

  // Auto-focus input field
  userInput.focus();

  // Handle input height adjustment
  userInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });
});
