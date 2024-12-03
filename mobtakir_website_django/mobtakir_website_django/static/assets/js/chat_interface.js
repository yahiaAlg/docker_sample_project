// Mobile menu toggle
document.querySelector(".mobile-menu-toggle").addEventListener("click", () => {
  document.querySelector(".history-sidebar").classList.toggle("show");
});

// Textarea auto-resize
const textarea = document.querySelector(".text-input");
textarea.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
});

// Send message function
document.querySelector(".send-button").addEventListener("click", () => {
  const message = textarea.value.trim();
  if (message) {
    addMessage(message, "user");
    textarea.value = "";
    textarea.style.height = "auto";
    // Simulate bot response
    showTypingIndicator();
    setTimeout(() => {
      hideTypingIndicator();
      addMessage("This is a sample response from the AI assistant.", "bot");
    }, 2000);
  }
});

// Add message to chat
function addMessage(text, sender) {
  const messagesContainer = document.querySelector(".chat-messages");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", `${sender}-message`);
  messageDiv.innerHTML = `
                ${text}
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            `;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Typing indicator
function showTypingIndicator() {
  document.querySelector(".typing-indicator").style.display = "block";
  document.querySelector(".chat-messages").scrollTop =
    document.querySelector(".chat-messages").scrollHeight;
}

function hideTypingIndicator() {
  document.querySelector(".typing-indicator").style.display = "none";
}

// File upload preview
document
  .querySelector('input[type="file"]')
  .addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.querySelector(".preview-image").src = e.target.result;
        document.querySelector(".upload-preview").style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

// Remove upload preview
document.querySelector(".remove-upload").addEventListener("click", () => {
  document.querySelector(".upload-preview").style.display = "none";
  document.querySelector('input[type="file"]').value = "";
});
