// JavaScript to toggle between English and Hebrew classes
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("language-toggle");
  const englishItems = document.querySelectorAll(".english");
  const hebrewItems = document.querySelectorAll(".hebrew");

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      englishItems.forEach(item => item.style.display = "block");
      hebrewItems.forEach(item => item.style.display = "none");
    } else {
      englishItems.forEach(item => item.style.display = "none");
      hebrewItems.forEach(item => item.style.display = "block");
    }
  });

  // Optional: Initialize based on default checkbox state
  if (toggle.checked) {
    englishItems.forEach(item => item.style.display = "block");
    hebrewItems.forEach(item => item.style.display = "none");
  } else {
    englishItems.forEach(item => item.style.display = "none");
    hebrewItems.forEach(item => item.style.display = "block");
  }
});