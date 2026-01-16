async function renderSnippetView(id) {
    const snippet = snippetsIndex.find(s => s.id === id);
    if (!snippet) return;

    const lang = window.currentLang || "ru";
    const file = snippet.files[lang] || snippet.files.ru;

    const res = await fetch(`/data/snippets/${file}`);
    const md = await res.text();
    const html = marked.parse(md);

    const root = document.getElementById("snippets-root");
    if (!root) return;

    root.innerHTML = `
        <button id="back-btn">
            ${lang === "ru" ? "← Назад" : "← Back"}
        </button>
        <article class="snippet-view">
            ${html}
        </article>
    `;

    document.getElementById("back-btn").onclick = () => {
        setSnippetsState("list");
    };

    Prism.highlightAll();
    addCopyButtons();
    window.scrollTo(0, 0);
}

function addCopyButtons() {
    document.querySelectorAll("pre code").forEach(codeBlock => {
        const pre = codeBlock.parentElement;

        if (pre.querySelector(".copy-btn")) return;

        const button = document.createElement("div");
        button.className = "copy-btn";
        button.innerHTML = '<i class="fas fa-copy"></i>';

        button.onclick = () => {
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                button.classList.add("copied");
                button.innerHTML = '<i class="fas fa-check"></i>';

                setTimeout(() => {
                    button.classList.remove("copied");
                    button.innerHTML = '<i class="fas fa-copy"></i>';
                }, 1500);
            });
        };

        pre.appendChild(button);
    });
}
