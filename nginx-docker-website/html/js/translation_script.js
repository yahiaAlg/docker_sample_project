let originalTexts = new Map(); // Store original texts
let isArabic = false;

async function translateText(text) {
  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: "en",
        target: "ar",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

async function translatePage() {
  const translateButton = document.getElementById("translateToArabic");
  const elementsToTranslate = document.querySelectorAll(
    "h1, h2, h3, p, a, button, span"
  );

  if (!isArabic) {
    translateButton.disabled = true;
    translateButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> جاري الترجمة...';

    for (let element of elementsToTranslate) {
      if (!element.closest("#translateToArabic")) {
        // Skip the translate button itself
        const originalText = element.textContent.trim();
        if (originalText && !originalTexts.has(element)) {
          originalTexts.set(element, originalText);
          const translatedText = await translateText(originalText);
          element.textContent = translatedText;
          element.style.direction = "rtl"; // Right to left for Arabic
        }
      }
    }

    document.dir = "rtl"; // Set document direction to RTL
    isArabic = true;
    translateButton.innerHTML = '<i class="fas fa-language"></i> English';
  } else {
    // Restore original texts
    for (let [element, originalText] of originalTexts) {
      element.textContent = originalText;
      element.style.direction = "ltr";
    }

    document.dir = "ltr";
    isArabic = false;
    translateButton.innerHTML = '<i class="fas fa-language"></i> عربي';
  }

  translateButton.disabled = false;
}

document.addEventListener("DOMContentLoaded", () => {
  const translateButton = document.getElementById("translateToArabic");
  translateButton.addEventListener("click", translatePage);
});
