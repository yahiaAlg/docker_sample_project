// Mobile menu toggle

document.querySelector(".mobile-menu-toggle").addEventListener("click", () => {
  document.body.classList.toggle("show-sidebar");
});

// Copy button functionality
document.querySelectorAll(".copy-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const codeBlock = button.nextElementSibling;
    const code = codeBlock.textContent;

    navigator.clipboard.writeText(code).then(() => {
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = "Copy";
      }, 2000);
    });
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});
