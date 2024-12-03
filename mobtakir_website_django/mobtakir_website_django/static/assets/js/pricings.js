// Pricing Switch Toggle
document.querySelectorAll(".pricing-switch button").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelector(".pricing-switch button.active")
      .classList.remove("active");
    button.classList.add("active");
  });
});
