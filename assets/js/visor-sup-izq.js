const visorLeft = document.querySelector(".visor-left");
const d1 = document.getElementById("d1");
const d2 = document.getElementById("d2");

// Función para actualizar el color de un círculo
function AplicarColor(CirculoActual, color) {
    CirculoActual.classList.remove("rojo", "verde");
    if (color) {
        CirculoActual.classList.add(color);
    }
}

// Función para actualizar los colores según el estado en localStorage
function ActualizarColor() {
    const d1Color = localStorage.getItem("d1");
    const d2Color = localStorage.getItem("d2");

    AplicarColor(d1, d1Color);
    AplicarColor(d2, d2Color);
}

// Función para actualizar la visibilidad del visor con animación
function ActualizarVisibilidad() {
    const EsVisible = localStorage.getItem("Visibilidad_visor_sup") !== "oculto";

    if (EsVisible) {
        visorLeft.classList.remove("oculto");
        visorLeft.classList.add("visible");
    } else {
        visorLeft.classList.remove("visible");
        visorLeft.classList.add("oculto");
    }
}

// Al cargar la página, aplicar el estado inicial
ActualizarColor();
ActualizarVisibilidad();

// Escuchar cambios en localStorage
window.addEventListener("storage", (event) => {
    if (event.key === "d1" || event.key === "d2") {
        ActualizarColor();
    } else if (event.key === "Visibilidad_visor_sup") {
        ActualizarVisibilidad();
    }
});