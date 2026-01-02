let i18nDict = {};

async function loadI18n() {
  const res = await fetch("data/i18n.json");
  if (!res.ok) {
    console.error("Failed to load i18n.json");
    return;
  }
  i18nDict = await res.json();
}

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const value = i18nDict?.[key]?.[currentLang];
    if (value) {
      el.textContent = value;
    }
  });
}
