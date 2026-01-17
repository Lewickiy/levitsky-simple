console.log("loaded: state.js");

window.currentLang = "ru";
window.currentRole = "hr";

window.appReady = {
    i18n: false,
    experience: false,
    snippets: false
};

function tryShowApp() {
    const page = document.body.dataset.page;

    if (page === "resume" && window.appReady.i18n && window.appReady.experience) {
        document.documentElement.style.visibility = "visible";
    }

    if (page === "snippets" && window.appReady.i18n && window.appReady.snippets) {
        document.documentElement.style.visibility = "visible";
    }

    if (page === "mentor") {
        document.documentElement.style.visibility = "visible";
    }
}