// Payment method selection
document.querySelectorAll(".payment-method").forEach((method) => {
  method.addEventListener("click", () => {
    document
      .querySelectorAll(".payment-method")
      .forEach((m) => m.classList.remove("selected"));
    method.classList.add("selected");
  });
});

// Simple card number formatting
document
  .querySelector('input[placeholder="1234 5678 9012 3456"]')
  .addEventListener("input", function (e) {
    let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    let formattedValue = "";
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += " ";
      }
      formattedValue += value[i];
    }
    e.target.value = formattedValue;
  });
