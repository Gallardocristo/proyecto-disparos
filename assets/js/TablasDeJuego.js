// Definimos Variables
let TotalDisparos = 20;
let Jugadores = []; // Lista de jugadores
let IndexJugadorActual = 0; // Índice del jugador actual
let DisparosEnRonda = 0; // Contador de disparos por ronda
let ConteoDisparosJugador = 0; // Contador disparos del Jugador
let InicioElJuego = false

// Función para iniciar el juego
function IniciarJuego() {
    InicioElJuego = true

    // Obtenemos el número de jugadores
    let NumeroDeJugadores = parseInt(document.getElementById("NumeroDeJugadores").value);

    // Validamos que el número de jugadores esté dentro del rango 1-10
    if (NumeroDeJugadores < 1 || NumeroDeJugadores > 10 || isNaN(NumeroDeJugadores)) {
        alert("Por favor, ingresa un número válido entre 1 y 10.");
        return;
    } else {
        // oculta el boton inicial
        let BotonIniciar = document.getElementById("BotonIniciar")
        BotonIniciar.style.display = "none"
    }

    // Limpiamos la lista de jugadores antes de crear nuevos
    Jugadores = [];

    // Creamos los campos de entrada para los nombres de los jugadores
    const playerNameContainer = document.getElementById("playerNamesContainer");
    playerNameContainer.innerHTML = ""; // Limpiamos cualquier contenido anterior

    for (let i = 0; i < NumeroDeJugadores; i++) {
        let nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = `Jugador ${i + 1}`;
        nameInput.placeholder = `Nombre del Jugador ${i + 1}`;
        nameInput.addEventListener("input", (event) => {
            // Limpiamos el valor para evitar "+" y "-"
            event.target.value = event.target.value.replace(/[+-]/g, "");

            // Actualizamos el nombre del jugador sin "+" ni "-"
            Jugadores[i].name = event.target.value;
            updatePlayerNameInTables(i, event.target.value);
        });

        nameInput.addEventListener("input", function() {
            this.value = this.value.replace(/[+-]/g, "");
        });

        // Agregamos el campo de entrada para cada jugador
        let inputWrapper = document.createElement("div");
        inputWrapper.appendChild(nameInput);
        playerNameContainer.appendChild(inputWrapper);

        // Inicializamos cada jugador con el nombre desde el input
        Jugadores.push({ name: nameInput.value, score: 0, currentShot: 0 });
    }

    localStorage.setItem("Jugador_Activo", Jugadores[IndexJugadorActual].name);

    // Activamos las tablas de puntajes y disparos
    renderTables();
    createControlButtons();
}

// Función para Activar las tablas de puntajes y disparos
function renderTables() {
    const scoreBody = document.getElementById("scoreBody");
    const shotsTable = document.getElementById("shotsTable");

    // Limpiamos el contenido de las tablas
    scoreBody.innerHTML = "";
    shotsTable.innerHTML = "";

    // Creamos la fila de encabezado para los disparos
    let headerRow = document.createElement("tr");
    let headerCell = document.createElement("th");
    headerCell.textContent = "Jugador / Disparos";
    headerRow.appendChild(headerCell);

    // Agregamos las columnas de disparos a la tabla
    for (let i = 1; i <= TotalDisparos; i++) {
        let th = document.createElement("th");
        th.textContent = i;
        headerRow.appendChild(th);
    }
    shotsTable.appendChild(headerRow);

    // Por cada jugador, creamos una fila en la tabla de puntajes y disparos
    Jugadores.forEach((player, index) => {
        let scoreRow = document.createElement("tr");

        // Crear un input para el nombre del jugador, permitiendo cambiarlo
        let nameCell = document.createElement("td");
        nameCell.textContent = player.name; // Aquí el nombre se muestra como texto, no como input
        nameCell.id = `name-${index}`; // Asignamos un ID para actualizarlo dinámicamente
        scoreRow.appendChild(nameCell);

        let scoreCell = document.createElement("td");
        scoreCell.id = `score-${index}`; // Asignamos un ID al puntaje
        scoreCell.textContent = "0"; // Iniciamos el puntaje en 0
        scoreRow.appendChild(scoreCell);
        scoreBody.appendChild(scoreRow);

        // Fila para los disparos del jugador
        let shotRow = document.createElement("tr");
        let playerNameCell = document.createElement("td");
        playerNameCell.textContent = player.name;
        playerNameCell.classList.add("Color-NombreJugador"); // Añadimos la clase para color blanco
        playerNameCell.id = `shot-name-${index}`;
        shotRow.appendChild(playerNameCell);

        // Creamos las celdas para cada disparo del jugador
        for (let j = 0; j < TotalDisparos; j++) {
            let cell = document.createElement("td");
            cell.id = `shot-${index}-${j}`; // ID para cada disparo
            shotRow.appendChild(cell);
        }
        shotsTable.appendChild(shotRow);
    });
}

// Función para actualizar los nombres de los jugadores en las tablas cuando cambian
function updatePlayerNameInTables(index, newName) {
    let cleanName = newName.replace(/[+-]/g, ""); // Elimina los signos

    let nameCell = document.getElementById(`name-${index}`);
    if (nameCell) nameCell.textContent = cleanName;

    let shotNameCell = document.getElementById(`shot-name-${index}`);
    if (shotNameCell) shotNameCell.textContent = cleanName;

    localStorage.setItem("Jugador_Activo", Jugadores[IndexJugadorActual].name);
}

// Función para crear los botones
function createControlButtons() {
    const gameArea = document.getElementById("AreaDeJuego");

    // Si ya existen los botones, los eliminamos
    let existingControls = document.getElementById("controlButtons");
    if (existingControls) {
        existingControls.remove();
    }

    // Creamos el contenedor para los botones
    const controlDiv = document.createElement("div");
    controlDiv.id = "controlButtons"; // Asignamos un ID para identificarlo

    // Botón para acertar
    const hitButton = document.createElement("button");
    hitButton.textContent = "Acertar";
    hitButton.onclick = () => updateShot(true);
    controlDiv.appendChild(hitButton);

    // Botón para errar
    const missButton = document.createElement("button");
    missButton.textContent = "Errar";
    missButton.onclick = () => updateShot(false);
    controlDiv.appendChild(missButton);

    // Agregamos los botones al área de juego
    gameArea.appendChild(controlDiv);
}

// Función para actualizar el resultado del disparo
function updateShot(hit) {
    let player = Jugadores[IndexJugadorActual];

    if (player.currentShot >= TotalDisparos) {
        return; // Si el jugador ya ha realizado todos sus disparos, no hacer nada
    }

    // Seleccionamos la celda correspondiente al disparo actual
    let cell = document.getElementById(`shot-${IndexJugadorActual}-${player.currentShot}`);

    // Si acertó, cambiamos el color de la celda a verde y sumamos un punto
    if (hit) {
        cell.style.backgroundColor = "green";
        cell.dataset.result = "hit"; // Guardamos el resultado en un atributo
    } else {
        // en caso de error se puede borrar
        cell.style.backgroundColor = "";
        cell.dataset.result = "miss";
    }

    // Recalculamos el puntaje real
    updateScore();
}

// Nueva función para actualizar el puntaje correcto
function updateScore() {
    let player = Jugadores[IndexJugadorActual];

    // Contamos cuántas celdas verdes tiene el jugador
    let hits = 0;
    for (let j = 0; j < TotalDisparos; j++) {
        let cell = document.getElementById(`shot-${IndexJugadorActual}-${j}`);
        if (cell && cell.dataset.result === "hit") {
            hits++;
        }
    }

    // Asignamos el puntaje real
    player.score = hits;
    document.getElementById(`score-${IndexJugadorActual}`).textContent = player.score;
}


// Función para pasar al siguiente tiro
function moveToNextShot() {
    let player = Jugadores[IndexJugadorActual];

    // Si el jugador ya ha completado todos sus disparos, no hacer nada
    if (player.currentShot >= TotalDisparos) return;

    // Remover la clase active de la celda anterior
    let prevCell = document.getElementById(`shot-${IndexJugadorActual}-${player.currentShot}`);
    if (prevCell) prevCell.classList.remove("active-shot");

    // Pasar al siguiente disparo
    player.currentShot++;
    ConteoDisparosJugador++;

    if (ConteoDisparosJugador == 4) {
        moveToNextPlayer();
    } else {
        // Agregar la clase active a la nueva celda
        let newCell = document.getElementById(`shot-${IndexJugadorActual}-${player.currentShot}`);
        if (newCell) newCell.classList.add("active-shot");
    }
}

// Función para mover al siguiente jugador
function moveToNextPlayer() {
    let prevPlayer = Jugadores[IndexJugadorActual];

    // Verificamos si todos los jugadores han terminado
    if (Jugadores.every(player => player.currentShot >= TotalDisparos)) {
        showRanking();
        InicioElJuego = false
        return;
    }

    // Remover la clase active de la última celda del jugador anterior
    let prevCell = document.getElementById(`shot-${IndexJugadorActual}-${prevPlayer.currentShot}`);
    if (prevCell) prevCell.classList.remove("active-shot");

    // Pasar al siguiente jugador
    IndexJugadorActual++;
    ConteoDisparosJugador = 0;

    // Si se pasó del último jugador, volver al primero que no ha terminado
    if (IndexJugadorActual >= Jugadores.length) {
        IndexJugadorActual = 0;
    }

    let newPlayer = Jugadores[IndexJugadorActual];

    // Asegurar que el nuevo jugador empieza en la primera casilla disponible
    let newCell = document.getElementById(`shot-${IndexJugadorActual}-${newPlayer.currentShot}`);
    if (newCell) newCell.classList.add("active-shot");

    localStorage.setItem("Jugador_Activo", Jugadores[IndexJugadorActual].name);
}

// Función para mostrar el ranking final
function showRanking() {
    const rankingBody = document.getElementById("rankingBody");

    rankingBody.innerHTML = ""; // Limpiamos el contenido del ranking

    // Ordenamos los jugadores por puntaje de mayor a menor
    let sortedPlayers = [...Jugadores].sort((a, b) => b.score - a.score);

    // Creamos las filas del ranking
    sortedPlayers.forEach((player, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${index + 1}</td><td>${player.name}</td><td>${player.score}</td>`;
        rankingBody.appendChild(row);
    });
}

// Función para reiniciar el juego
function resetGame() {
    InicioElJuego = false

    //aparece el boton iniciar
    let BotonIniciar = document.getElementById("BotonIniciar")
    BotonIniciar.style.display = ""

    // Limpiamos los datos y reiniciamos las variables
    document.getElementById("NumeroDeJugadores").value = "";
    Jugadores = [];
    IndexJugadorActual = 0;
    DisparosEnRonda = 0;
    ConteoDisparosJugador = 0;

    localStorage.setItem("Jugador_Activo", "Nombre");

    // Limpiar los inputs de nombres de jugadores
    document.getElementById("playerNamesContainer").innerHTML = "";

    // Limpiar la tabla de puntajes y disparos
    document.getElementById("scoreBody").innerHTML = "";
    document.getElementById("shotsTable").innerHTML = "";

    // Limpiar la tabla de ranking
    document.getElementById("rankingBody").innerHTML = "";

    // Eliminar los botones "Acertar" y "Errar"
    let existingControls = document.getElementById("controlButtons");
    if (existingControls) {
        existingControls.remove();
    }

    ReiniciarColor();
    ReiniciarColor_VisorSup();
}

function resetShot() {
    let player = Jugadores[IndexJugadorActual];

    // Seleccionamos la celda del disparo actual
    let cell = document.getElementById(`shot-${IndexJugadorActual}-${player.currentShot}`);

    // Si la celda existe y tenía un resultado previo
    if (cell) {
        // Si era un acierto, restamos un punto al jugador
        if (cell.dataset.result === "hit") {
            player.score--;
            document.getElementById(`score-${IndexJugadorActual}`).textContent = player.score;
        }

        // cambia el color y actualia el resultado
        cell.style.backgroundColor = "red";
        delete cell.dataset.result;
    }
}

// Detectamos las teclas "+" y "-" para marcar un disparo como acertado o errado
document.addEventListener("keydown", function(event) {
    if (event.key === "+") {
        updateShot(true); // Acertar
    } else if (event.key === "Backspace") {
        updateShot(false); // Errar
    } else if (event.key === "Enter") {
        // Cuando se presiona "Enter", pasamos al siguiente disparo
        moveToNextShot();
    } else if (event.key === "-") {
        // Si se presiona Backspace, reiniciamos el disparo
        resetShot();
    }
});





//Control-visores


// Variables para el estado actual
let CirculoActivo_VisorSup = "D1";
let CirculoActivo = "d1";

// Función para actualizar el estado en localStorage
function CambiarColor(circulo, color) {
    localStorage.setItem(circulo, color);
}

// Función para reiniciar todo
function ReiniciarColor() {
    localStorage.removeItem("d1");
    localStorage.removeItem("d2");
    localStorage.removeItem("d3");
    localStorage.removeItem("d4");
    CirculoActivo = "d1"; // Volver a d1 al reiniciar
    localStorage.setItem("CirculoActivo", "d1");
}

function ReiniciarColor_VisorSup() {
    localStorage.removeItem("D1");
    localStorage.removeItem("D2");
    CirculoActivo_VisorSup = "D1"; // Volver a d1 al reiniciar
    localStorage.setItem("CirculoActivo_VisorSup", "D1");
}

//Reinicio individual
function ReinicioIndividual(circulo) {
    localStorage.removeItem(circulo);
}

// Función para alternar la visibilidad del visor
function Mostrar_Visor_sup() {
    const EsVisible = localStorage.getItem("Visibilidad_visor_sup") !== "oculto";
    localStorage.setItem("Visibilidad_visor_sup", EsVisible ? "oculto" : "visible");
}

function Mostrar_Visor_flotante() {
    const EsVisible = localStorage.getItem("Visibilidad_visor_flotante") !== "oculto";
    localStorage.setItem("Visibilidad_visor_flotante", EsVisible ? "oculto" : "visible");
}

//Pasar al siguiente circulo


// Escuchar las teclas
document.addEventListener("keydown", (event) => {
    if (InicioElJuego === true) {
        if (event.key === "+") {
            CambiarColor(CirculoActivo, "verde");
            CambiarColor(CirculoActivo_VisorSup, "verde");
        } else if (event.key === "-") {
            CambiarColor(CirculoActivo, "rojo");
            CambiarColor(CirculoActivo_VisorSup, "rojo");
        } else if (event.key === "Backspace") {
            ReinicioIndividual(CirculoActivo);
            ReinicioIndividual(CirculoActivo_VisorSup);
        } else if (event.key === "0") {
            ReiniciarColor();
        } else if (CirculoActivo === "d4" && event.key === "Enter") {
            ReiniciarColor();
            ReiniciarColor_VisorSup();
        } else if (event.key === "Enter" && CirculoActivo === "d1") {
            CirculoActivo = "d2";
            CirculoActivo_VisorSup = "D2";
            localStorage.setItem("CirculoActivo", "d2");
            localStorage.setItem("CirculoActivo_VisorSup", "D2");
        } else if (CirculoActivo_VisorSup === "D2" && event.key === "Enter") {
            ReiniciarColor_VisorSup();
            CirculoActivo = "d3";
            localStorage.setItem("CirculoActivo", "d3");
        } else if (event.key === "Enter" && CirculoActivo === "d3") {
            CirculoActivo = "d4";
            CirculoActivo_VisorSup = "D2";
            localStorage.setItem("CirculoActivo", "d4");
        }
    }
});
// Botón de On/Off visor sup iq
const toggleButton = document.getElementById("Boton_On/Off");
toggleButton.addEventListener("click", Mostrar_Visor_sup);

// Botón de On/Off visor flotante
const ActivarBoton = document.getElementById("Boton_On/Off_flotante");
ActivarBoton.addEventListener("click", Mostrar_Visor_flotante);