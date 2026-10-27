let cvData = {};
let currentLanguage = "es";

async function initCV() {
  const response = await fetch("./data/cv.json");

  if (!response.ok) {
    throw new Error(`No se pudo cargar cv.json: ${response.status}`);
  }

  cvData = await response.json();

  try {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if ((savedLanguage === "es" || savedLanguage === "en") && cvData[savedLanguage]) {
      currentLanguage = savedLanguage;
    }
  } catch (error) {
    // Se mantiene español si localStorage no está disponible.
  }

  document.querySelectorAll("[data-lang]").forEach(button => {
    button.addEventListener("click", () => {
      const language = button.dataset.lang;
      if (!cvData[language]) return;
      currentLanguage = language;

      try {
        localStorage.setItem("preferredLanguage", language);
      } catch (error) {
        // El cambio de idioma sigue funcionando sin almacenamiento.
      }

      renderCV();
    });
  });

  renderCV();
}

function renderCV() {
  const content = cvData[currentLanguage];
  const container = document.getElementById("cv-content");
  if (!content || !container) return;

  document.documentElement.lang = currentLanguage;
  document.getElementById("cv-title").textContent = content.title;
  container.replaceChildren();

  Object.entries(content.sections).forEach(([key, title]) => {
    const heading = document.createElement("h3");
    heading.textContent = title;
    container.appendChild(heading);

    const entries = content.entries?.[key] || [];
    if (!entries.length) return;

    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    entries.forEach(entry => {
      const row = document.createElement("tr");
      const date = document.createElement("th");
      const description = document.createElement("td");

      date.className = "an";
      date.textContent = entry.date || "";
      description.innerHTML = entry.description || "";
      description.style.whiteSpace = "pre-line";

      row.append(date, description);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
    const spacer = document.createElement("br");
    container.appendChild(spacer);
  });

  document.querySelectorAll("[data-lang]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === currentLanguage));
  });
}

initCV().catch(error => {
  console.error("Error al cargar el CV:", error);
  const container = document.getElementById("cv-content");
  if (container) {
    const message = document.createElement("p");
    message.textContent = "No se pudo cargar el CV. Revisa la consola del navegador.";
    container.prepend(message);
  }
});
