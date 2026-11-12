
// ==================================================
// VARIABLES GLOBALES
// ==================================================

let translations = {};
let projects = [];
let quotes = [];
let words = [];

let currentLanguage = "es";
let currentWord = "";

let mediaQueryMobile;
let typingObserver = null;
let typingStates = new Map();

let scrollPendiente = false;


// ==================================================
// CARGAR ARCHIVOS JSON
// ==================================================

async function cargarJSON(ruta) {
  let response;

  try {
    response = await fetch(ruta);
  } catch (error) {
    throw new Error(
      `No se pudo acceder a ${ruta}. Comprueba la ruta y el servidor.`,
    );
  }

  if (!response.ok) {
    throw new Error(
      `${ruta} respondió con el error HTTP ${response.status}.`,
    );
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error(
      `${ruta} no contiene JSON válido. Detalle: ${error.message}`,
    );
  }
}


// ==================================================
// INICIALIZACIÓN
// ==================================================

async function init() {
  const gallery = document.getElementById("project-gallery");

  try {
    // 1. Cargar solamente los archivos esenciales.
    // Las frases y palabras no bloquean la galería.

    const [loadedTranslations, loadedProjects] = await Promise.all([
      cargarJSON("./data/translations.json"),
      cargarJSON("./data/projects.json"),
    ]);

    // Validar archivos esenciales.

    if (
      !loadedTranslations.es ||
      !loadedTranslations.en ||
      !Array.isArray(loadedProjects)
    ) {
      throw new Error("La estructura de los archivos principales no es válida.");
    }

    translations = loadedTranslations;
    projects = loadedProjects;

    // Recuperar idioma guardado.

    try {
      const savedLanguage = localStorage.getItem("preferredLanguage");

      if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
      }
    } catch (error) {
      // El sitio funciona aunque localStorage no esté disponible.
    }

    // Registrar eventos.

    activarCambioIdioma();
    activarNombreProyectoMobile();
    activarShuffle();

    // Preparar animaciones de frases.

    prepararObservadorFrases();

    // Mostrar la galería inmediatamente.

    renderPage();

    // 2. Cargar frases y palabras en segundo plano.
    // La galería ya está visible mientras esto sucede.

    const [quotesResult, wordsResult] = await Promise.allSettled([
      cargarJSON("./data/quotes.json"),
      cargarJSON("./data/words.json"),
    ]);

    // Procesar frases.

    if (quotesResult.status === "fulfilled") {
      if (Array.isArray(quotesResult.value)) {
        quotes = quotesResult.value;

        // Añadir frases sin reconstruir las tarjetas ni recargar imágenes.
        insertarFrases();
      } else {
        console.warn("quotes.json no contiene un arreglo.");
      }
    } else {
      console.warn("No se pudieron cargar las frases:", quotesResult.reason);
    }

    // Procesar palabras.

    if (wordsResult.status === "fulfilled") {
      if (Array.isArray(wordsResult.value.words)) {
        words = wordsResult.value.words;
        changeWord();
      } else {
        console.warn("words.json no contiene la estructura esperada.");
      }
    } else {
      console.warn("No se pudieron cargar las palabras:", wordsResult.reason);
    }

    // Cambiar palabra cada cinco segundos.

    if (words.length > 0) {
      setInterval(changeWord, 5000);
    }

  } catch (error) {
    console.error("Error al iniciar el sitio:", error);

    if (gallery) {
      gallery.textContent =
        "No se pudieron cargar los proyectos. Abre la consola del navegador para ver el error.";
    }
  }
}


// ==================================================
// CAMBIO DE IDIOMA
// ==================================================

function activarCambioIdioma() {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      const language = button.dataset.lang;

      if (!translations[language]) return;
      if (language === currentLanguage) return;

      currentLanguage = language;

      try {
        localStorage.setItem("preferredLanguage", language);
      } catch (error) {
        // El cambio de idioma sigue funcionando.
      }

      renderPage();
    });
  });
}


// ==================================================
// PALABRA ALEATORIA JUNTO AL NOMBRE
// ==================================================

function changeWord() {
  const randomWord = document.getElementById("random-word");

  if (!randomWord || words.length === 0) return;

  // Evita repetir la palabra anterior sin entrar en un bucle infinito.

  const availableWords = words
    .map((word) => word[currentLanguage] ?? word.es)
    .filter((word) => typeof word === "string" && word !== currentWord);

  if (availableWords.length === 0) return;

  const randomIndex = Math.floor(Math.random() * availableWords.length);

  currentWord = availableWords[randomIndex];
  randomWord.textContent = currentWord;
}


// ==================================================
// TRADUCCIONES
// ==================================================

function getTranslation(dictionary, key) {
  return key.split(".").reduce(
    (value, part) => value?.[part],
    dictionary,
  );
}


function renderPage() {
  const dictionary = translations[currentLanguage];

  if (!dictionary) return;

  document.documentElement.lang = currentLanguage;

  // Actualizar palabra.

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

  // Actualizar título.

  document.title =
    currentLanguage === "en"
      ? "Jaime Rodríguez Gómez — Portfolio"
      : "Jaime Rodríguez Gómez";

  // Renderizar proyectos y frases disponibles.

  renderProjects(dictionary);
}


// ==================================================
// DISTRIBUIR FRASES
// ==================================================

function distribuirFrases() {
  const quotesByPosition = new Map();

  const totalQuotes = quotes.length;
  const totalProjects = projects.length;

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


// ==================================================
// LIMPIAR ANIMACIONES ANTERIORES
// ==================================================

function limpiarEfectosEscritura() {
  if (typingObserver) {
    typingObserver.disconnect();
  }

  typingStates.forEach((state) => {
    if (state.timer) {
      clearTimeout(state.timer);
    }
  });

  typingStates.clear();
}


// ==================================================
// OBSERVADOR DE FRASES VISIBLES
// ==================================================

function prepararObservadorFrases() {
  if (!("IntersectionObserver" in window)) return;

  typingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const state = typingStates.get(entry.target);

        if (!state) return;

        if (entry.isIntersecting) {
          iniciarCicloFrase(state);
        } else {
          detenerCicloFrase(state);
        }
      });
    },
    {
      root: null,
      rootMargin: "100px 0px",
      threshold: 0,
    },
  );
}


// ==================================================
// RENDERIZAR GALERÍA
// ==================================================

function renderProjects(dictionary) {
  const gallery = document.getElementById("project-gallery");

  if (!gallery) return;

  limpiarEfectosEscritura();

  const fragment = document.createDocumentFragment();
  const quotesByPosition = distribuirFrases();

  projects.forEach((project, index) => {
    const title =
      project.title?.[currentLanguage] ??
      project.title?.es ??
      project.id ??
      "Proyecto sin título";

    const category =
      dictionary.categories?.[project.category] ??
      project.category ??
      "";

    const card = document.createElement("div");
    card.className = "gallery__item";

    const importance = [1, 2, 3, 4].includes(Number(project.importance))
      ? Number(project.importance)
      : 3;

    card.dataset.importance = importance;

    const link = document.createElement("a");

    link.href = project.url || "#";
    link.title = title;
    link.setAttribute(
      "aria-label",
      `${title}, ${project.year || ""}`,
    );

    // Imagen.

    const image = document.createElement("img");

    image.src = project.image || "";
    image.alt = title;
    image.className = "gallery__img";
    image.decoding = "async";

    // Priorizar las imágenes iniciales.
    // Las siguientes se descargan al acercarse al viewport.

    image.loading = index < 2 ? "eager" : "lazy";
    image.fetchPriority = index === 0 ? "high" : "auto";

    // Información del proyecto.

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

    // Insertar las frases correspondientes.

    if (quotesByPosition.has(index)) {
      quotesByPosition.get(index).forEach((quote) => {
        fragment.append(crearFrase(quote));
      });
    }
  });

  gallery.replaceChildren(fragment);

  // Activar animaciones solo para frases cercanas al viewport.

  observarFrases();

  actualizarNombreProyectoMobile();
}


// ==================================================
// INSERTAR FRASES EN SEGUNDO PLANO
// ==================================================

function insertarFrases() {
  const gallery = document.getElementById("project-gallery");

  if (!gallery || quotes.length === 0) return;

  const projectCards = Array.from(gallery.children).filter((element) =>
    element.classList.contains("gallery__item"),
  );

  const quotesByPosition = distribuirFrases();

  quotesByPosition.forEach((quotesAtPosition, position) => {
    // Insertar después del proyecto correspondiente.

    const nextCard = projectCards[position + 1] || null;

    quotesAtPosition.forEach((quote) => {
      const phrase = crearFrase(quote);

      if (nextCard) {
        gallery.insertBefore(phrase, nextCard);
      } else {
        gallery.appendChild(phrase);
      }
    });
  });

  observarFrases();
}


// ==================================================
// CREAR FRASES
// ==================================================

function crearFrase(quote) {
  const element = document.createElement("div");

  element.className = "gallery__quote";
  element.dataset.importance = quote.importance || 2;
  element.dataset.quote = quote.id || "";

  const paragraph = document.createElement("p");

  const fullText = quote[currentLanguage] ?? quote.es ?? "";

  paragraph.className = "typing-text";
  paragraph.textContent = "";

  element.setAttribute("aria-label", fullText);

  element.appendChild(paragraph);

  iniciarEfectoEscritura(paragraph, fullText);

  return element;
}


// ==================================================
// EFECTO DE ESCRITURA
// ==================================================

function iniciarEfectoEscritura(element, text) {
  const characters = Array.from(text);

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reducedMotion || characters.length === 0) {
    element.textContent = text;
    return;
  }

  const state = {
    element,
    characters,
    index: 0,
    deleting: false,
    timer: null,
  };

  typingStates.set(element, state);

  // Si no existe IntersectionObserver, iniciar normalmente.

  if (!typingObserver) {
    iniciarCicloFrase(state);
  }
}


function iniciarCicloFrase(state) {
  if (state.timer) return;

  function tick() {
    const { element, characters } = state;

    if (!element.isConnected) {
      detenerCicloFrase(state);
      return;
    }

    if (!state.deleting) {
      state.index++;

      element.textContent = characters
        .slice(0, state.index)
        .join("");

      if (state.index >= characters.length) {
        state.deleting = true;
        programar(2500);
        return;
      }

      programar(65);

    } else {
      state.index--;

      element.textContent = characters
        .slice(0, state.index)
        .join("");

      if (state.index <= 0) {
        state.deleting = false;
        programar(700);
        return;
      }

      programar(35);
    }
  }

  function programar(delay) {
    state.timer = setTimeout(() => {
      state.timer = null;
      tick();
    }, delay);
  }

  // Guardar la función para iniciar el ciclo.

  state.tick = tick;

  // Primer retraso aleatorio.

  state.timer = setTimeout(() => {
    state.timer = null;
    tick();
  }, Math.random() * 1500);
}


function detenerCicloFrase(state) {
  if (state.timer) {
    clearTimeout(state.timer);
    state.timer = null;
  }
}


// ==================================================
// OBSERVAR FRASES
// ==================================================

function observarFrases() {
  if (!typingObserver) return;

  document.querySelectorAll(".typing-text").forEach((element) => {
    if (typingStates.has(element)) {
      typingObserver.observe(element);
    }
  });
}


// ==================================================
// NOMBRES DE PROYECTOS EN MÓVIL
// ==================================================

function actualizarNombreProyectoMobile() {
  if (!mediaQueryMobile) return;

  const items = document.querySelectorAll(".gallery__item");

  if (!mediaQueryMobile.matches) {
    items.forEach((item) => {
      const overlay = item.querySelector(
        ".contenedor-nombre-proyecto",
      );

      if (overlay) {
        overlay.style.opacity = "";
      }

      item.classList.remove("near-viewport-edge");
    });

    return;
  }

  items.forEach((item) => {
    const rect = item.getBoundingClientRect();

    const overlay = item.querySelector(
      ".contenedor-nombre-proyecto",
    );

    if (!overlay) return;

    const nearViewportEdge =
      (rect.top <= 80 && rect.top > -80) ||
      (rect.bottom >= window.innerHeight - 60 &&
        rect.bottom < window.innerHeight + 80);

    overlay.style.opacity = nearViewportEdge ? "1" : "0";

    item.classList.toggle(
      "near-viewport-edge",
      nearViewportEdge,
    );
  });
}


// ==================================================
// OPTIMIZAR SCROLL CON REQUESTANIMATIONFRAME
// ==================================================

function programarActualizacionMobile() {
  if (scrollPendiente) return;

  scrollPendiente = true;

  requestAnimationFrame(() => {
    actualizarNombreProyectoMobile();
    scrollPendiente = false;
  });
}


function activarNombreProyectoMobile() {
  mediaQueryMobile = window.matchMedia("(max-width: 980px)");

  window.addEventListener(
    "scroll",
    programarActualizacionMobile,
    { passive: true },
  );

  window.addEventListener(
    "resize",
    programarActualizacionMobile,
    { passive: true },
  );

  actualizarNombreProyectoMobile();
}


// ==================================================
// BARAJAR GALERÍA
// ==================================================

function activarShuffle() {
  const shuffleButton = document.getElementById("shuffle-gallery");

  if (!shuffleButton) return;

  shuffleButton.addEventListener("click", () => {
    // Fisher-Yates: barajar directamente el arreglo.
    // No es necesario reconstruirlo buscando títulos.

    for (let i = projects.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [projects[i], projects[j]] = [
        projects[j],
        projects[i],
      ];
    }

    renderProjects(translations[currentLanguage]);
  });
}


// ==================================================
// INICIAR
// ==================================================

init();
