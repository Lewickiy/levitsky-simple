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

    localStorage.setItem("selectedRole", role);
}

document.addEventListener("DOMContentLoaded", () => {

    const savedRole = localStorage.getItem("selectedRole");
    window.currentRole = savedRole || "hr";

    updateRoleUI();

    document.getElementById("role-hr").onclick = () => setRole("hr");
    document.getElementById("role-cto").onclick = () => setRole("cto");
});
