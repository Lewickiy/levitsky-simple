async function loadTopMenu() {
    const res = await fetch("/partials/top-menu.html");
    document.getElementById("top-menu").innerHTML = await res.text();
}

document.addEventListener("DOMContentLoaded", loadTopMenu);
