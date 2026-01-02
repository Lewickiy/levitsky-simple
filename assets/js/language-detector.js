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
    loadExperience();
}

document.addEventListener("DOMContentLoaded", () => {
    window.currentLang = detectUserLanguage();
    updateLangUI();

    document.getElementById("lang-ru").onclick = () => setLanguage("ru");
    document.getElementById("lang-en").onclick = () => setLanguage("en");
});
