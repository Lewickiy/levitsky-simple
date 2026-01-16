let snippetsIndex = [];

async function loadSnippetsIndex() {
    const res = await fetch("/data/snippets/index.json");
    snippetsIndex = await res.json();
}

function renderSnippetsList() {
    const root = document.getElementById("snippets-root");
    if (!root) return;

    const readText = currentLang === "ru" ? "Читать →" : "Read →";

    root.innerHTML = `
        ${snippetsIndex.map(snippet => `
            <div class="snippet-preview">
                <h3>${snippet.title[currentLang]}</h3>
                <p>${snippet.description[currentLang]}</p>
                <button data-id="${snippet.id}">
                    ${readText}
                </button>
            </div>
        `).join("")}
    `;

    root.querySelectorAll("button").forEach(btn => {
        btn.onclick = () => {
            setSnippetsState("view", btn.dataset.id);
        };
    });
}
