(function () {
    function init() {
        const STORAGE_KEY = "bugCount";
    let bugCount = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);

    const SPAWN_INTERVAL = 10000;
    const BUG_LIFETIME = 2000;
    const GLITCH_TIME = 1200;

    let currentBug = null;

    const msg = document.createElement("div");
    msg.id = "bug-message";
    document.body.appendChild(msg);

    function showMessage(text) {
        msg.textContent = text;
        msg.classList.add("show");
        setTimeout(() => msg.classList.remove("show"), 1500);
    }

    function getGlitchLevel(count) {
        if (count >= 50) return "glitch-broken";
        if (count >= 40) return "glitch-5";
        if (count >= 30) return "glitch-4";
        if (count >= 20) return "glitch-3";
        if (count >= 10) return "glitch-2";
        return "glitch-1";
    }

    function applyGlitch() {
        const levelClass = getGlitchLevel(bugCount);

        document.body.classList.remove(
            "glitch-1",
            "glitch-2",
            "glitch-3",
            "glitch-4",
            "glitch-5",
            "glitch-broken"
        );

        if (bugCount >= 50) {
            document.body.classList.add("glitch-broken");
            showMessage("𖢥 System down. Detected " + bugCount + " bugs");
            return;
        }

        document.body.classList.add(levelClass);

        setTimeout(() => {
            document.body.classList.remove(levelClass);
        }, GLITCH_TIME);
    }

    function catchBug() {
        bugCount++;
        localStorage.setItem(STORAGE_KEY, bugCount.toString());

        showMessage("𖢥 Detected " + bugCount + " bugs");
        applyGlitch();

        if (currentBug) {
            currentBug.remove();
            currentBug = null;
        }
    }

    function spawnBug() {
        if (currentBug) return;

        const bug = document.createElement("div");
        bug.className = "bug";
        bug.textContent = "𖢥";
        bug.style.position = "fixed";
        bug.style.fontSize = "24px";
        bug.style.color = "#000c50";
        bug.style.zIndex = "9999";

        const padding = 30;
        const x = Math.random() * (window.innerWidth - padding * 2) + padding;
        const y = Math.random() * (window.innerHeight - padding * 2) + padding;

        bug.style.left = x + "px";
        bug.style.top = y + "px";

        bug.addEventListener("click", catchBug);

        document.body.appendChild(bug);
        currentBug = bug;

        setTimeout(() => {
            if (currentBug === bug) {
                bug.remove();
                currentBug = null;
            }
        }, BUG_LIFETIME);
    }

    setInterval(spawnBug, SPAWN_INTERVAL);
    }

    if ("requestIdleCallback" in window) {
        requestIdleCallback(init);
    } else {
        setTimeout(init, 2000);
    }
})();