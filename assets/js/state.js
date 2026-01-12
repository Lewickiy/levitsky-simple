window.currentLang = "ru";
window.currentRole = "hr";

window.appReady = {
    i18n: false,
    experience: false
};

function tryShowApp() {
    if (window.appReady.i18n && window.appReady.experience) {
        document.documentElement.style.visibility = "visible";
    }
}