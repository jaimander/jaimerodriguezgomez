function activarNombreProyectoMobile() {
  const mediaQuery = window.matchMedia("(max-width: 980px)");
  const items = document.querySelectorAll(".gallery__item");

  function onScroll() {
    if (!mediaQuery.matches) return;

    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const overlay = item.querySelector(".contenedor-nombre-proyecto");

      if (!overlay) return;

      // cuando el item toca el top del viewport
      if ((rect.top <= 80 && rect.top > -100) || (rect.bottom >= window.innerHeight - 80 && rect.bottom < window.innerHeight + 100)) {
        overlay.style.opacity = "1";
      } else {
        overlay.style.opacity = "0";
      }
    });
  }

  window.addEventListener("scroll", onScroll);
}

activarNombreProyectoMobile();