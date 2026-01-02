function detectUserLanguage() {
    const lang = navigator.language || "en";
    return lang.toLowerCase().startsWith("ru") ? "ru" : "en";
}

function updateLangUI() {
    document
        .querySelectorAll(".lang-switch button")
        .forEach(b => b.classList.remove("active"));

    document
        .getElementById(`lang-${currentLang}`)
        ?.classList.add("active");
}

function setLanguage(lang) {
    if (lang === currentLang) return;
    window.currentLang = lang;
    updateLangUI();
    applyI18n();
    loadExperience();
}

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const value = i18nDict?.[key]?.[currentLang];
    if (!value) return;

    if (value.includes("\n")) {
      el.innerHTML = value
        .split("\n\n")
        .map(p => `<p>${p}</p>`)
        .join("");
    } else {
      el.textContent = value;
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
    window.currentLang = detectUserLanguage();
    await loadI18n();
    applyI18n();
    updateLangUI();

    document.getElementById("lang-ru").onclick = () => setLanguage("ru");
    document.getElementById("lang-en").onclick = () => setLanguage("en");
});
