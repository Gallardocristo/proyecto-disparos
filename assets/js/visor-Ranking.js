let jugadores = JSON.parse(localStorage.getItem("jugadores"))

const VisorRanking = document.querySelector(".Visor-Ranking");

function ActualizarVisibilidad() {
    const EsVisible = localStorage.getItem("Visibilidad_visor_Ranking") !== "oculto";

    if (EsVisible) {
        VisorRanking.classList.remove("oculto");
        VisorRanking.classList.add("visible");
    } else {
        VisorRanking.classList.remove("visible");
        VisorRanking.classList.add("oculto");
    }
}

// Escuchar cambios en localStorage
window.addEventListener("storage", (event) => {
    if (event.key === "jugadores") {
        cargarTabla();
    } else if (event.key === "Visibilidad_visor_Ranking") {
        ActualizarVisibilidad();
        console.log("se activo el visor")
    }
});

function cargarTabla() {
    let jugadores = JSON.parse(localStorage.getItem("jugadores")) || [];

    const tbody = document.querySelector("#tabla-jugadores tbody");
    tbody.innerHTML = ""; // Limpiar la tabla antes de insertar nuevos datos

    // Ordenar los jugadores por score en orden descendente
    jugadores.sort((a, b) => b.score - a.score);

    // Insertar los jugadores en la tabla con su posición
    jugadores.forEach((jugador, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${jugador.name}</td>
            <td>${jugador.score}</td>
        `;
        tbody.appendChild(fila);
    });
}

// Escuchar cambios en localStorage (solo funciona entre pestañas)
window.addEventListener("storage", (event) => {
    if (event.key === "jugadores") {
        cargarTabla();
    }
});

// Cargar al iniciar
cargarTabla();
ActualizarVisibilidad();