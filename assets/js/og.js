let ogDict = {};

async function loadOG() {
    try {
        const res = await fetch("/data/og.json");
        if (!res.ok)
            throw new Error("Failed to load og.json");
        ogDict = await res.json();
        applyOG();
    } catch (err) {
        console.error(err);
    }
}

function applyOG() {
    const page = document.body.dataset.page;
    if (!ogDict[page] || !ogDict[page][currentLang]) return;

    const data = ogDict[page][currentLang];

    const metaTags = [
        {property: "og:title", content: data.title},
        {property: "og:description", content: data.description},
        {property: "og:image", content: data.image},
        {property: "og:url", content: data.url},
        {property: "og:type", content: "website"}
    ];

    metaTags.forEach(({property, content}) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
            tag = document.createElement("meta");
            tag.setAttribute("property", property);
            document.head.appendChild(tag);
        }
        tag.setAttribute("content", content);
    });
}