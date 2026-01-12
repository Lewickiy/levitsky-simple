async function loadExperience() {
  const res = await fetch("data/experience.json");
  const { experience } = await res.json();
  renderExperience(experience);
    window.appReady.experience = true;
    tryShowApp();
}

function renderExperience(list) {
  const container = document.getElementById("experience-list");
  if (!container) return;

  container.innerHTML = "";

  list.forEach(job => {
    const html = renderExperienceItem(job);
    if (html) container.insertAdjacentHTML("beforeend", html);
  });
}

function renderExperienceItem(job) {
  const content = job.content?.[currentRole]?.[currentLang];
  if (!content) return "";

  const responsibilities = content.responsibilities || [];
  const summary = content.summary || "";

  const techLine = (job.technologies || []).join(", ");

  // Команда
  let teamLine = "";
  if (job.team) {
    const parts = [];
    if (job.team.backend) parts.push(`Backend: ${job.team.backend}`);
    if (job.team.frontend) parts.push(`Frontend: ${job.team.frontend}`);
    if (job.team.qa) parts.push(`QA: ${job.team.qa}`);
    if (parts.length) teamLine = parts.join(" | ");
  }

  return `
    <div class="experienceItem">
      <div class="experienceHeader">
        <span class="experienceDates">
          ${formatPeriod(job.period.from, job.period.to)}
        </span>
        <span class="experienceCompany">
          <strong>${job.company}</strong>
        </span>
      </div>

      <div class="experienceProject">
        ${job.project.name[currentLang]}
        ${job.project.architecture ? `(${job.project.architecture})` : ""}
      </div>

      ${teamLine ? `<div class="experienceTeam"><b>${currentLang === "ru" ? "Команда" : "Team"}:</b> ${teamLine}</div>` : ""}

      <div class="experienceDescription">
        ${summary ? `<p>${summary}</p>` : ""}
        ${responsibilities.length
          ? `<ul>${responsibilities.map(r => `<li>${r}</li>`).join("")}</ul>`
          : ""}
        ${techLine
          ? `<p class="techLine"><b>${currentLang === "ru" ? "Стек проекта" : "Tech stack"}:</b> ${techLine}</p>`
          : ""}
      </div>
    </div>
  `;
}

function formatPeriod(from, to) {
  const opts = { year: "numeric", month: "short" };
  const fromStr = new Date(from).toLocaleDateString(currentLang, opts);
  const toStr =
    to && to !== "present"
      ? new Date(to).toLocaleDateString(currentLang, opts)
      : currentLang === "ru"
        ? "настоящее время"
        : "Present";

  return `${fromStr} — ${toStr}`;
}

document.addEventListener("DOMContentLoaded", loadExperience);