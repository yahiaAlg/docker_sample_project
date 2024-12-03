// Particles Animation
function createParticles() {
  const particles = document.getElementById("particles");
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.width = Math.random() * 5 + "px";
    particle.style.height = particle.style.width;
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 5 + "s";
    particles.appendChild(particle);
  }
}

// Scroll Animations
function handleScroll() {
  const elements = document.querySelectorAll(".fade-in");
  const navbar = document.querySelector(".navbar");

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight * 0.75) {
      element.classList.add("visible");
    }
  });

  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  createParticles();
  handleScroll();
  window.addEventListener("scroll", handleScroll);
});
