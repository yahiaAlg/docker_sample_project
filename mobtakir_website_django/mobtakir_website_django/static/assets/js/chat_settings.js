// Update slider values
const sliders = ["temperature", "length", "context"];
sliders.forEach((slider) => {
  const sliderElement = document.getElementById(`${slider}Slider`);
  const valueElement = document.getElementById(`${slider}Value`);

  sliderElement.addEventListener("input", function () {
    valueElement.textContent = this.value;
  });
});

// Save changes
document.querySelector(".btn-primary").addEventListener("click", function () {
  // Collect all parameters
  const parameters = {
    model: document.querySelector("select").value,
    temperature: document.getElementById("temperatureSlider").value,
    maxLength: document.getElementById("lengthSlider").value,
    contextMemory: document.getElementById("contextSlider").value,
    autoCorrect: document.querySelector(".toggle-switch input").checked,
    apiKey: document.querySelector('input[type="password"]').value,
    endpoint: document.querySelector('input[type="text"]').value,
  };

  // Save parameters (example)
  console.log("Saving parameters:", parameters);
  alert("Parameters saved successfully!");
});

// Reset to defaults
document.querySelector(".btn-outline").addEventListener("click", function () {
  if (
    confirm("Are you sure you want to reset all parameters to default values?")
  ) {
    document.getElementById("temperatureSlider").value = 0.7;
    document.getElementById("temperatureValue").textContent = 0.7;
    document.getElementById("lengthSlider").value = 500;
    document.getElementById("lengthValue").textContent = 500;
    document.getElementById("contextSlider").value = 5;
    document.getElementById("contextValue").textContent = 5;
    document.querySelector(".toggle-switch input").checked = true;
    document.querySelector("select").value = "gpt4";
    document.querySelector('input[type="password"]').value = "";
    document.querySelector('input[type="text"]').value = "";
  }
});
