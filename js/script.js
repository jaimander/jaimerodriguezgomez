let translations = {};
let projects = [];
let currentLanguage = "es";
let mediaQueryMobile;

async function cargarJSON(ruta) {
  let response;

  try {
    response = await fetch(ruta);
  } catch (error) {
    throw new Error(
      `No se pudo acceder a ${ruta}. Comprueba que estás usando un servidor local y que la ruta existe.`,
    );
  }

  if (!response.ok) {
    throw new Error(`${ruta} respondió con el error HTTP ${response.status}.`);
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error(
      `${ruta} no contiene JSON válido. Detalle: ${error.message}`,
    );
  }
}

async function init() {
  try {
    const [loadedTranslations, loadedProjects] = await Promise.all([
      cargarJSON("./data/translations.json"),
      cargarJSON("./data/projects.json"),
    ]);

    // Comprobar que los archivos tienen la estructura esperada.
    if (
      !loadedTranslations.es ||
      !loadedTranslations.en ||
      !Array.isArray(loadedProjects)
    ) {
      throw new Error(
        "La estructura de translations.json o projects.json no es la esperada.",
      );
    }

    translations = loadedTranslations;
    projects = loadedProjects;

    try {
      const savedLanguage = localStorage.getItem("preferredLanguage");

      if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
      }
    } catch (error) {
      // El sitio sigue funcionando sin localStorage.
    }

    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.addEventListener("click", () => {
        const language = button.dataset.lang;

        if (!translations[language]) return;

        currentLanguage = language;

        try {
          localStorage.setItem("preferredLanguage", language);
        } catch (error) {
          // El cambio de idioma sigue funcionando sin almacenamiento.
        }

        renderPage();
      });
    });

    // Registrar los eventos una sola vez.
    activarNombreProyectoMobile();
    renderPage();
  } catch (error) {
    console.error("Error al iniciar el sitio:", error);

    const gallery = document.getElementById("project-gallery");

    if (gallery) {
      gallery.textContent =
        "No se pudieron cargar los proyectos. Abre la consola del navegador para ver el error exacto.";
    }
  }
}

function getTranslation(dictionary, key) {
  return key.split(".").reduce((value, part) => value?.[part], dictionary);
}

function renderPage() {
  const dictionary = translations[currentLanguage];

  if (!dictionary) return;

  document.documentElement.lang = currentLanguage;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = getTranslation(dictionary, element.dataset.i18n);

    if (typeof value === "string") {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.lang === currentLanguage),
    );
  });

  document.title =
    currentLanguage === "en"
      ? "Jaime Rodríguez Gómez — Portfolio"
      : "Jaime Rodríguez Gómez";

  renderProjects(dictionary);
}

function renderProjects(dictionary) {
  const gallery = document.getElementById("project-gallery");

  if (!gallery) return;

  const fragment = document.createDocumentFragment();

  projects.forEach((project) => {
    const title =
      project.title?.[currentLanguage] ??
      project.title?.es ??
      project.id ??
      "Proyecto sin título";

    const category =
      dictionary.categories?.[project.category] ?? project.category ?? "";

    const card = document.createElement("div");
    card.className = "gallery__item";

    const link = document.createElement("a");
    link.href = project.url || "#";
    link.title = title;
    link.setAttribute("aria-label", `${title}, ${project.year || ""}`);

    const image = document.createElement("img");
    image.src = project.image || "";
    image.alt = title;
    image.className = "gallery__img";
    image.loading = "lazy";
    image.decoding = "async";

    const details = document.createElement("div");
    details.className = "contenedor-nombre-proyecto";

    const projectTitle = document.createElement("div");
    projectTitle.className = "nombre-proyecto";
    projectTitle.textContent = title;

    const year = document.createElement("div");
    year.className = "tiempo-proyecto";
    year.textContent = project.year || "";

    const projectCategory = document.createElement("div");
    projectCategory.className = "tipo-proyecto";
    projectCategory.textContent = category;

    details.append(projectTitle, year, projectCategory);
    link.append(image, details);
    card.append(link);
    fragment.append(card);
  });

  gallery.replaceChildren(fragment);

  // Actualizar las capas también después de cambiar de idioma.
  actualizarNombreProyectoMobile();
}

function actualizarNombreProyectoMobile() {
  if (!mediaQueryMobile) return;

  const overlays = document.querySelectorAll(
    ".gallery__item .contenedor-nombre-proyecto",
  );

  if (!mediaQueryMobile.matches) {
    overlays.forEach((overlay) => {
      overlay.style.opacity = "";
    });

    return;
  }

  document.querySelectorAll(".gallery__item").forEach((item) => {
    const rect = item.getBoundingClientRect();
    const overlay = item.querySelector(".contenedor-nombre-proyecto");

    if (!overlay) return;

    const nearViewportEdge =
      (rect.top <= 80 && rect.top > -80) ||
      (rect.bottom >= window.innerHeight - 60 &&
        rect.bottom < window.innerHeight + 80);

    overlay.style.opacity = nearViewportEdge ? "1" : "0";
  });
}

function activarNombreProyectoMobile() {
  mediaQueryMobile = window.matchMedia("(max-width: 980px)");

  window.addEventListener("scroll", actualizarNombreProyectoMobile, {
    passive: true,
  });

  window.addEventListener("resize", actualizarNombreProyectoMobile);

  actualizarNombreProyectoMobile();
}

init();

////

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".gallery-container");
  const shuffleButton = document.querySelector("#shuffle-gallery");

  if (!gallery || !shuffleButton) return;

  shuffleButton.addEventListener("click", () => {
    const projects = Array.from(gallery.children);

    // Barajar los proyectos con Fisher-Yates
    for (let i = projects.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [projects[i], projects[j]] = [projects[j], projects[i]];
    }

    // Reinsertarlos en el nuevo orden
    projects.forEach((project) => gallery.appendChild(project));
  });
});
