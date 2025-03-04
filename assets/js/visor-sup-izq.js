const visorLeft = document.querySelector(".visor-left");
const D1 = document.getElementById("D1");
const D2 = document.getElementById("D2");

// Función para actualizar el color de un círculo
function AplicarColor(CirculoActual_VisorSup, color) {
    CirculoActual_VisorSup.classList.remove("rojo", "verde");
    if (color) {
        CirculoActual_VisorSup.classList.add(color);
    }
}

// Función para actualizar los colores según el estado en localStorage
function ActualizarColor() {
    const D1Color = localStorage.getItem("D1");
    const D2Color = localStorage.getItem("D2");

    AplicarColor(D1, D1Color);
    AplicarColor(D2, D2Color);
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
    if (event.key === "D1" || event.key === "D2") {
        ActualizarColor();
    } else if (event.key === "Visibilidad_visor_sup") {
        ActualizarVisibilidad();
    }
});