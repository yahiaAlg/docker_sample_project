// FAQ Toggle
document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", function () {
    const answer = this.nextElementSibling;
    const icon = this.querySelector(".fas");

    if (answer.style.display === "block") {
      answer.style.display = "none";
      icon.classList.remove("fa-chevron-up");
      icon.classList.add("fa-chevron-down");
    } else {
      answer.style.display = "block";
      icon.classList.remove("fa-chevron-down");
      icon.classList.add("fa-chevron-up");
    }
  });
});

// Form submission
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  // Add form submission logic here
  alert("Support request submitted. We'll get back to you soon!");
});
