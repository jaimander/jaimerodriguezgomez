
let translations = {};
let projectPages = {};
let currentLanguage = "es";

async function loadJSON(path) {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(
      `Error ${response.status} al cargar ${path}`
    );
  }

  return response.json();
}

function translated(value) {
  if (value && typeof value === "object") {
    return value[currentLanguage] ?? value.es ?? "";
  }

  return value ?? "";
}

async function initProjectPage() {
  try {
    // Cargar traducciones generales y contenido de los proyectos.
    const [loadedTranslations, loadedPages] = await Promise.all([
      loadJSON("../data/translations.json"),
      loadJSON("../data/project-pages.json")
    ]);

    translations = loadedTranslations;
    projectPages = loadedPages;

    // Identificar el proyecto a partir del atributo del body.
    const projectId = document.body.dataset.projectId;
    const project = projectPages[projectId];

    if (!project) {
      throw new Error(
        `No se encontró "${projectId}" en project-pages.json`
      );
    }

    // Recuperar el idioma seleccionado anteriormente.
    try {
      const savedLanguage = localStorage.getItem("preferredLanguage");

      if (
        (savedLanguage === "es" || savedLanguage === "en") &&
        translations[savedLanguage]
      ) {
        currentLanguage = savedLanguage;
      }
    } catch (error) {
      // Si localStorage no está disponible, se utiliza español.
    }

    // Registrar los botones ES / EN.
    document.querySelectorAll("[data-lang]").forEach(button => {
      button.addEventListener("click", () => {
        const language = button.dataset.lang;

        if (!translations[language]) return;

        currentLanguage = language;

        try {
          localStorage.setItem("preferredLanguage", language);
        } catch (error) {
          // El cambio de idioma sigue funcionando sin almacenamiento.
        }

        renderProjectPage(project);
      });
    });

    renderProjectPage(project);
  } catch (error) {
    console.error("Error al cargar la página del proyecto:", error);

    const main = document.querySelector("main");

    if (main) {
      const message = document.createElement("p");
      message.textContent =
        "No se pudo cargar el proyecto. Consulta la consola del navegador para ver el error.";
      main.prepend(message);
    }
  }
}

function renderProjectPage(project) {
  const dictionary = translations[currentLanguage];

  if (!dictionary) return;

  // Actualizar el idioma del documento.
  document.documentElement.lang = currentLanguage;

  // Traducir los elementos generales de navegación.
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;

    const value = key.split(".").reduce(
      (obj, part) => obj?.[part],
      dictionary
    );

    if (typeof value === "string") {
      element.textContent = value;
    }
  });

  // Actualizar los campos del proyecto: título, año y descripción.
  document.querySelectorAll("[data-project-field]").forEach(element => {
    const field = element.dataset.projectField;

    if (project[field] !== undefined) {
      element.textContent = translated(project[field]);
    }
  });

  // Actualizar el enlace externo del proyecto.
  const projectLink = document.querySelector("[data-project-link]");

  if (projectLink) {
    projectLink.href = project.projectUrl || "#";
    projectLink.textContent = translated(project.projectLink);
  }

  // Renderizar una imagen o una galería de imágenes.
  const imageContainer = document.querySelector("[data-project-images]");

  if (imageContainer) {
    imageContainer.replaceChildren();

    // Admite tanto "images" (galería) como "image" (imagen única).
    const images = project.images || (
      project.image
        ? [{
            src: project.image,
            alt: project.imageAlt || project.title
          }]
        : []
    );

    images.forEach(item => {
      const wrapper = document.createElement("div");
      wrapper.className = "contenedor-img";

      const img = document.createElement("img");
      img.src = item.src || "";
      img.alt = translated(item.alt);
      img.loading = "lazy";
      img.decoding = "async";

      wrapper.appendChild(img);
      imageContainer.appendChild(wrapper);
    });
  }

  // Compatibilidad con el HTML anterior de Julia,
  // que utiliza un elemento con data-project-image.
  const singleImage = document.querySelector("[data-project-image]");

  if (singleImage && project.image) {
    singleImage.src = project.image;
    singleImage.alt = translated(project.imageAlt);
  }

  // Actualizar el estado accesible de los botones de idioma.
  document.querySelectorAll("[data-lang]").forEach(button => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.lang === currentLanguage)
    );
  });

  // Actualizar el título de la pestaña.
  document.title =
    `${translated(project.title)} — Jaime Rodríguez Gómez`;
}

initProjectPage();
