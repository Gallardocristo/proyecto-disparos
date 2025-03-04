const VisorFlotante = document.querySelector(".Visor-Flotante");
const d1 = document.getElementById("d1");
const d2 = document.getElementById("d2");
const d3 = document.getElementById("d3");
const d4 = document.getElementById("d4");

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
    const d3Color = localStorage.getItem("d3");
    const d4Color = localStorage.getItem("d4");

    AplicarColor(d1, d1Color);
    AplicarColor(d2, d2Color);
    AplicarColor(d3, d3Color);
    AplicarColor(d4, d4Color);
}

// Función para actualizar la visibilidad del visor con animación
function ActualizarVisibilidad() {
    const EsVisible = localStorage.getItem("Visibilidad_visor_flotante") !== "oculto";

    if (EsVisible) {
        VisorFlotante.classList.remove("oculto");
        VisorFlotante.classList.add("visible");
    } else {
        VisorFlotante.classList.remove("visible");
        VisorFlotante.classList.add("oculto");
    }
}

// Al cargar la página, aplicar el estado inicial
ActualizarColor();
ActualizarVisibilidad();

// Escuchar cambios en localStorage
window.addEventListener("storage", (event) => {
    if (["d1", "d2", "d3", "d4"].includes(event.key)) {
        ActualizarColor();
    } else if (event.key === "Visibilidad_visor_flotante") {
        ActualizarVisibilidad();
    }
});