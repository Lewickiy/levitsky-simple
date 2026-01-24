console.log("loaded: language-detector.js");

const LANG_STORAGE_KEY = "selectedLang";

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
    localStorage.setItem(LANG_STORAGE_KEY, lang);

    updateLangUI();
    applyI18n();
    applyOG();

    const page = document.body.dataset.page;
    if (page === "resume") {
        loadExperience();
    }

    if (page === "snippets") {
        if (window.snippetsState.mode === "list") {
            renderSnippetsList();
        } else if (window.snippetsState.mode === "view") {
            setSnippetsState("view");
        }
    }
}

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const value = i18nDict?.[key]?.[currentLang];
    if (!value) return;

    if (Array.isArray(value)) {
      // Если value — массив, создаём <li> для каждого элемента
      el.innerHTML = value.map(item => `<li>${item}</li>`).join("");
    } else if (value.includes("\n")) {
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
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
    window.currentLang = savedLang || detectUserLanguage();

    if (!savedLang) {
        localStorage.setItem(LANG_STORAGE_KEY, window.currentLang);
    }

    await loadI18n();
    await loadOG()
    applyI18n();

    updateLangUI();

    window.appReady.i18n = true;
    tryShowApp();
});

document.addEventListener("layout:ready", () => {
    const ru = document.getElementById("lang-ru");
    const en = document.getElementById("lang-en");

    if (!ru || !en) return;

    ru.onclick = () => setLanguage("ru");
    en.onclick = () => setLanguage("en");
});
