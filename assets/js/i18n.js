let i18nDict = {};

async function loadI18n() {
  const res = await fetch("data/i18n.json");
  if (!res.ok) {
    console.error("Failed to load i18n.json");
    return;
  }
  i18nDict = await res.json();
}
