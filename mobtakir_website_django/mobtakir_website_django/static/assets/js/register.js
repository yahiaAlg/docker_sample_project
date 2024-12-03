// Toggle password visibility
document.querySelectorAll(".password-toggle").forEach((toggle) => {
  toggle.addEventListener("click", function () {
    const input = this.previousElementSibling;
    if (input.type === "password") {
      input.type = "text";
      this.classList.remove("fa-eye");
      this.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      this.classList.remove("fa-eye-slash");
      this.classList.add("fa-eye");
    }
  });
});

// Form submission handlers
document.getElementById("signinForm").addEventListener("submit", function (e) {
  e.preventDefault();
  // Add sign in logic here
});

document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();
  // Add sign up logic here
});

// Toggle between sign in and sign up forms
const signInSection = document.querySelector(".auth-container");
const signUpSection = document.querySelector("#signup");

document.querySelectorAll(".auth-switch a").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    if (this.getAttribute("href") === "#signup") {
      signInSection.style.display = "none";
      signUpSection.style.display = "block";
    } else {
      signInSection.style.display = "block";
      signUpSection.style.display = "none";
    }
  });
});
