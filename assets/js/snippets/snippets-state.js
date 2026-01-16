window.snippetsState = {
    mode: "list",      // list | view
    currentId: null
};

function setSnippetsState(mode, id = null) {
    if (mode === "view" && !id) {
        id = window.snippetsState.currentId;
    }

    window.snippetsState.mode = mode;
    window.snippetsState.currentId = id;

    // обновляем URL
    if (mode === "view" && id) {
        window.history.replaceState(null, "", `${window.location.pathname.split("/").pop()}#${id}`);
    } else if (mode === "list") {
        // сохраняем полный путь к странице
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    if (mode === "list") {
        renderSnippetsList();
    } else if (id) {
        renderSnippetView(id);
    }
}