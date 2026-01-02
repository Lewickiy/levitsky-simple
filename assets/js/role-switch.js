function updateRoleUI() {
    document
        .querySelectorAll(".role-switch button")
        .forEach(b => b.classList.remove("active"));

    document
        .getElementById(`role-${currentRole}`)
        ?.classList.add("active");
}

function setRole(role) {
    if (role === currentRole) return;
    window.currentRole = role;
    updateRoleUI();
    loadExperience();
}

document.addEventListener("DOMContentLoaded", () => {
    updateRoleUI();
    document.getElementById("role-hr").onclick = () => setRole("hr");
    document.getElementById("role-cto").onclick = () => setRole("cto");
});
