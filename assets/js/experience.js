console.log("loaded: experience.js");

async function loadExperienceData() {
  try {
    const res = await fetch("data/experience.json");
    if (!res.ok) {
      console.error("Failed to load experience.json:", res.status);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching experience.json:", err);
    return null;
  }
}

function getCareerStartFromExperience(experienceList) {
  if (!Array.isArray(experienceList) || experienceList.length === 0) {
    return null;
  }

  return experienceList
    .map(job => job?.period?.from)
    .filter(Boolean)
    .map(date => new Date(date))
    .sort((a, b) => a - b)[0];
}

async function renderExperienceYears() {
  const data = await loadExperienceData();
  if (!data || !data.experience) return;

  const careerStartDate = getCareerStartFromExperience(data.experience);
  if (!careerStartDate) return;

  const years = calculateExperienceYears(careerStartDate);

  const elements = document.querySelectorAll("[data-experience-years]");
  elements.forEach(el => {
    el.textContent = `${years}+`;
  });
}

document.addEventListener("DOMContentLoaded", renderExperienceYears);


function calculateExperienceYears(startDate) {
    const page = document.body.dataset.page;
    if (page !== "resume") return;

    const start = new Date(startDate);
    const now = new Date();

    let years = now.getFullYear() - start.getFullYear();

    const hasNotHadAnniversary =
        now.getMonth() < start.getMonth() ||
        (now.getMonth() === start.getMonth() && now.getDate() < start.getDate());

    if (hasNotHadAnniversary) years--;

    return Math.max(0, years);
}