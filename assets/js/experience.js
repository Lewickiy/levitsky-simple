async function loadMeta() {
  try {
    const response = await fetch("data/meta.json");
    if (!response.ok) {
      console.error("Failed to load meta.json:", response.status, response.statusText);
      return null;
    }
    return await response.json();
  } catch (err) {
    console.error("Error fetching meta.json:", err);
    return null;
  }
}

function calculateExperienceYears(startDate) {
  const start = new Date(startDate);
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();

  const hasNotHadAnniversary =
    now.getMonth() < start.getMonth() ||
    (now.getMonth() === start.getMonth() && now.getDate() < start.getDate());

  if (hasNotHadAnniversary) years--;

  return Math.max(0, years);
}

async function renderExperienceYears() {
  const meta = await loadMeta();
  if (!meta || !meta.careerStart) return;

  const years = calculateExperienceYears(meta.careerStart);

  const elements = document.querySelectorAll("[data-experience-years]");
  elements.forEach(el => {
    el.textContent = `${years}+`;
  });
}

document.addEventListener("DOMContentLoaded", renderExperienceYears);
