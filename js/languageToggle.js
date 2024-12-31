// js/languageToggle.js

// Translation dictionary
// Keys match 'data-translate-key' attributes in the HTML
const translations = {
  en: {
    site_title: "Holy City | Property Details",
    phone_number: "052-678-3539",
    email: "info@holycity-realestate.com",
    toggle_button: "Switch to Hebrew",

    nav_home: "HOME",
    nav_properties: "PROPERTIES",
    nav_about: "ABOUT US",
    nav_contact: "CONTACT",

    property_details_header: "Property Details",
    property_details_subheader: "Property Details",
    property_name: "Property Name",
    property_price: "$0",
    property_description: "Lorem ipsum dolor sit amet...",
    property_features_title: "Property Features",
    about_property_title: "About the property",
    popular_properties_title: "Popular Properties",

    footer_designed_by: "Designed by ",
    footer_home: "Home",
    footer_properties: "Properties",
    footer_about: "About Us",
    footer_contact: "Contact",
  },

  he: {
    site_title: "הולי סיטי | פרטי נכס",
    phone_number: "052-678-3539",
    email: "info@holycity-realestate.com",
    toggle_button: "עבור לאנגלית",

    nav_home: "בית",
    nav_properties: "נכסים",
    nav_about: "עלינו",
    nav_contact: "צור קשר",

    property_details_header: "פרטי נכס",
    property_details_subheader: "פרטי נכס",
    property_name: "שם הנכס",
    property_price: "0 ₪",
    property_description: "תיאור הנכס יופיע כאן...",
    property_features_title: "מאפייני הנכס",
    about_property_title: "אודות הנכס",
    popular_properties_title: "נכסים פופולריים",

    footer_designed_by: "עוצב על ידי ",
    footer_home: "בית",
    footer_properties: "נכסים",
    footer_about: "עלינו",
    footer_contact: "צור קשר",
  },
};

// Current language state
let currentLang = "en";

// On DOM ready, set initial language
document.addEventListener("DOMContentLoaded", () => {
  applyTranslations(currentLang);

  // Add event listener to toggle button
  const toggleBtn = document.getElementById("toggle-lang");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      currentLang = currentLang === "en" ? "he" : "en";
      applyTranslations(currentLang);

      // (Optional) switch the direction of the page if you want right-to-left
      document.documentElement.dir = currentLang === "he" ? "rtl" : "ltr";
    });
  }
});

/**
 * Replace the text content of elements that have [data-translate-key] 
 * with the appropriate text from `translations`.
 * @param {string} lang - Language code ('en' or 'he').
 */
function applyTranslations(lang) {
  // Find all elements with the data-translate-key attribute
  const translatableElements = document.querySelectorAll("[data-translate-key]");
  
  // For each element, find the translation text, and update
  translatableElements.forEach((el) => {
    const key = el.getAttribute("data-translate-key");
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Update <title> tag text as well (if needed)
  // Since we have data-translate-key on <title>, we can handle it the same way
}
