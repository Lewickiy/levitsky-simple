async function loadTopMenu() {
    const container = document.getElementById("top-menu");
    if (!container) return;

    const res = await fetch("/partials/top-menu.html");
    container.innerHTML = await res.text();

    document.dispatchEvent(new Event("layout:ready"));
}

document.addEventListener("DOMContentLoaded", loadTopMenu);