// Загружаем meta.json
async function loadMeta() {
  try {
    const response = await fetch("/data/meta.json");
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

// Вычисляем количество лет опыта
function calculateExperienceYears(startDate) {
  const start = new Date(startDate);
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();

  // Если ещё не был день рождения в этом году
  const hasNotHadAnniversary =
    now.getMonth() < start.getMonth() ||
    (now.getMonth() === start.getMonth() && now.getDate() < start.getDate());

  if (hasNotHadAnniversary) years--;

  return Math.max(0, years);
}

// Рендерим опыт работы
async function renderExperienceYears() {
  const meta = await loadMeta();
  if (!meta || !meta.careerStart) return;

  const years = calculateExperienceYears(meta.careerStart);

  const elements = document.querySelectorAll("[data-experience-years]");
  elements.forEach(el => {
    el.textContent = `${years}+`;
  });
}

// Запуск после загрузки DOM
document.addEventListener("DOMContentLoaded", renderExperienceYears);
