
let translations = {};
let projects = [];
let quotes = [];
let words = [];

let currentLanguage = "es";
let currentWord = "";
let mediaQueryMobile;

// --------------------------------------------------
// CARGAR ARCHIVOS JSON
// --------------------------------------------------

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

// --------------------------------------------------
// INICIALIZACIÓN
// --------------------------------------------------

async function init() {
  try {
    const [
      loadedTranslations,
      loadedProjects,
      loadedQuotes,
      loadedWords,
    ] = await Promise.all([
      cargarJSON("./data/translations.json"),
      cargarJSON("./data/projects.json"),
      cargarJSON("./data/quotes.json"),
      cargarJSON("./data/words.json"),
    ]);

    // Comprobar estructura de los archivos.
    if (
      !loadedTranslations.es ||
      !loadedTranslations.en ||
      !Array.isArray(loadedProjects) ||
      !Array.isArray(loadedQuotes) ||
      !Array.isArray(loadedWords.words)
    ) {
      throw new Error(
        "La estructura de los archivos JSON no es la esperada.",
      );
    }

    translations = loadedTranslations;
    projects = loadedProjects;
    quotes = loadedQuotes;
    words = loadedWords.words;

    // Recuperar idioma guardado.
    try {
      const savedLanguage = localStorage.getItem("preferredLanguage");

      if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
      }
    } catch (error) {
      // El sitio sigue funcionando sin localStorage.
    }

    // Eventos para cambiar idioma.
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

    // Registrar eventos una sola vez.
    activarNombreProyectoMobile();
    activarShuffle();

    // Mostrar primera palabra.
    changeWord();

    // Cambiar palabra cada cinco segundos.
    setInterval(changeWord, 500);

    // Renderizar página.
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

// --------------------------------------------------
// PALABRA ALEATORIA JUNTO AL NOMBRE
// --------------------------------------------------

function changeWord() {
  const randomWord = document.getElementById("random-word");

  if (!randomWord || words.length === 0) return;

  let nextWord;

  do {
    const randomIndex = Math.floor(Math.random() * words.length);

    nextWord =
      words[randomIndex][currentLanguage] ??
      words[randomIndex].es;

  } while (words.length > 1 && nextWord === currentWord);

  currentWord = nextWord;
  randomWord.textContent = currentWord;
}

// --------------------------------------------------
// TRADUCCIONES
// --------------------------------------------------

function getTranslation(dictionary, key) {
  return key.split(".").reduce((value, part) => value?.[part], dictionary);
}

function renderPage() {
  const dictionary = translations[currentLanguage];

  if (!dictionary) return;

  // Actualizar idioma del documento.
  document.documentElement.lang = currentLanguage;

  // Actualizar palabra aleatoria.
  changeWord();

  // Actualizar textos traducibles.
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = getTranslation(dictionary, element.dataset.i18n);

    if (typeof value === "string") {
      element.textContent = value;
    }
  });

  // Actualizar botones de idioma.
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.lang === currentLanguage),
    );
  });

  // Actualizar título de página.
  document.title =
    currentLanguage === "en"
      ? "Jaime Rodríguez Gómez — Portfolio"
      : "Jaime Rodríguez Gómez";

  renderProjects(dictionary);
}

// --------------------------------------------------
// DISTRIBUIR TODAS LAS FRASES
// --------------------------------------------------

function distribuirFrases() {
  const totalQuotes = quotes.length;
  const totalProjects = projects.length;

  const quotesByPosition = new Map();

  if (totalQuotes === 0 || totalProjects === 0) {
    return quotesByPosition;
  }

  quotes.forEach((quote, index) => {
    const position = Math.floor(
      ((index + 1) * totalProjects) / (totalQuotes + 1),
    );

    if (!quotesByPosition.has(position)) {
      quotesByPosition.set(position, []);
    }

    quotesByPosition.get(position).push(quote);
  });

  return quotesByPosition;
}

// --------------------------------------------------
// RENDERIZAR GALERÍA
// --------------------------------------------------

function renderProjects(dictionary) {
  const gallery = document.getElementById("project-gallery");

  if (!gallery) return;

  const fragment = document.createDocumentFragment();

  // Calcular posiciones de todas las frases.
  const quotesByPosition = distribuirFrases();

  projects.forEach((project, index) => {
    const title =
      project.title?.[currentLanguage] ??
      project.title?.es ??
      project.id ??
      "Proyecto sin título";

    const category =
      dictionary.categories?.[project.category] ?? project.category ?? "";

    const card = document.createElement("div");
    card.className = "gallery__item";

    // Importancia del proyecto: valores de 1 a 4.
    const importance = [1, 2, 3, 4].includes(Number(project.importance))
      ? Number(project.importance)
      : 3;

    card.dataset.importance = importance;

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

    // Insertar frases en posiciones distribuidas.
    if (quotesByPosition.has(index)) {
      quotesByPosition.get(index).forEach((quote) => {
        fragment.appendChild(crearFrase(quote));
      });
    }
  });

  gallery.replaceChildren(fragment);

  // Actualizar capas después de renderizar.
  actualizarNombreProyectoMobile();
}

// --------------------------------------------------
// CREAR FRASES
// --------------------------------------------------

function crearFrase(quote) {
  const element = document.createElement("div");

  element.className = "gallery__quote";
  element.dataset.importance = quote.importance || 2;
  element.dataset.quote = quote.id;

  const paragraph = document.createElement("p");

  const fullText = quote[currentLanguage] ?? quote.es ?? "";

  paragraph.className = "typing-text";
  paragraph.textContent = "";

  element.setAttribute("aria-label", fullText);

  element.appendChild(paragraph);

  iniciarEfectoEscritura(paragraph, fullText);

  return element;
}

// Efecto de escritura y borrado continuo.
function iniciarEfectoEscritura(element, text) {
  const characters = Array.from(text);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    element.textContent = text;
    return;
  }

  let index = 0;
  let deleting = false;

  function tick() {
    // Detener el ciclo si la frase ya no está en la galería.
    if (!element.isConnected) return;

    if (!deleting) {
      index++;
      element.textContent = characters.slice(0, index).join("");

      if (index >= characters.length) {
        deleting = true;
        setTimeout(tick, 2500);
        return;
      }

      setTimeout(tick, 65);

    } else {
      index--;
      element.textContent = characters.slice(0, index).join("");

      if (index <= 0) {
        deleting = false;
        setTimeout(tick, 700);
        return;
      }

      setTimeout(tick, 35);
    }
  }

  // Pequeño retraso inicial aleatorio.
  setTimeout(tick, Math.random() * 1500);
}

// --------------------------------------------------
// NOMBRES DE PROYECTOS EN MOBILE
// --------------------------------------------------

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

    item.classList.toggle("near-viewport-edge", nearViewportEdge);
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

// --------------------------------------------------
// BARAJAR GALERÍA
// --------------------------------------------------

function activarShuffle() {
  const gallery = document.querySelector(".gallery-container");
  const shuffleButton = document.querySelector("#shuffle-gallery");

  if (!gallery || !shuffleButton) return;

  shuffleButton.addEventListener("click", () => {
    // Barajar únicamente los proyectos.
    const projectCards = Array.from(gallery.children).filter((element) =>
      element.classList.contains("gallery__item"),
    );

    // Fisher-Yates.
    for (let i = projectCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [projectCards[i], projectCards[j]] = [
        projectCards[j],
        projectCards[i],
      ];
    }

    // Volver a renderizar para conservar todas las frases
    // distribuidas entre los proyectos.
    projects = projectCards
      .map((card) => {
        const title = card.querySelector(".nombre-proyecto")?.textContent;

        return projects.find((project) => {
          const projectTitle =
            project.title?.[currentLanguage] ??
            project.title?.es ??
            project.id;

          return projectTitle === title;
        });
      })
      .filter(Boolean);

    renderProjects(translations[currentLanguage]);
  });
}

// --------------------------------------------------
// INICIAR
// --------------------------------------------------

init();
