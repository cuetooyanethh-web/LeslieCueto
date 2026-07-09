// --- CONFIGURACIÓN DE DATOS SIMULADOS ---
const countries = ["US (United States)", "CN (China)", "BR (Brazil)", "DE (Germany)", "PE (Peru)", "JP (Japan)", "RU (Russia)"];

const vulnerabilities = [
    { name: "EternalBlue (MS17-010)", level: "alert-red" },
    { name: "SSH Brute Force Attempt", level: "alert-orange" },
    { name: "Anonymous FTP Access", level: "alert-yellow" },
    { name: "Exposed RDP Port", level: "alert-orange" },
    { name: "Log4Shell Exploit Try", level: "alert-red" },
    { name: "Unencrypted Telnet Node", level: "alert-yellow" }
];

// --- FUNCIONES AUXILIARES ---
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomIP() {
    return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`;
}

function getTimestamp() {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
}

// --- ACTUALIZADOR DE TRÁFICO (MANTIENE LA IP DE LA UNI FIJA EN LA PRIMERA FILA) ---
function updateLiveFeed() {
    const tbody = document.querySelector(".feed-table tbody");
    if (!tbody) return;

    // Crear una nueva fila aleatoria de fondo
    const tr = document.createElement("tr");
    const vuln = getRandomElement(vulnerabilities);

    tr.innerHTML = `
        <td>${getTimestamp()}</td>
        <td class="text-cyan">${generateRandomIP()}</td>
        <td>${getRandomElement(countries)}</td>
        <td>${getRandomElement(ports)}</td>
        <td class="${vuln.level}">${vuln.name}</td>
    `;

    // Insertar la nueva actividad JUSTO DEBAJO de la fila fija de la UNI (que es el índice 1)
    if (tbody.children.length > 1) {
        tbody.insertBefore(tr, tbody.children[1]);
    } else {
        tbody.appendChild(tr);
    }

    // Mantener un límite de 6 filas en total para no romper el layout
    if (tbody.children.length > 6) {
        tbody.removeChild(tbody.lastChild);
    }
}

// --- SIMULADOR DE CONSOLA INTERACTIVA OSINT ---
const hackerCommands = [
    "shodan count country:PE product:Apache",
    "shodan download uni_recon_dataset",
    "shodan alert list",
    "shodan info",
    "shodan honeypot score "
];

function injectConsoleLogs() {
    const consoleContent = document.querySelector(".console-panel .panel-content");
    const cursorLine = document.querySelector(".cursor-line");
    if (!consoleContent || !cursorLine) return;

    const isCommand = Math.random() > 0.5;
    const newLog = document.createElement("div");

    if (isCommand) {
        newLog.className = "log-entry command-line";
        newLog.innerText = getRandomElement(hackerCommands);
    } else {
        newLog.className = "log-entry";
        newLog.style.color = "#555555";
        newLog.innerText = `[SYS_EVENT] Escaneo pasivo en ejecución...`;
    }

    // Inyectar el log arriba de la línea de comandos activa
    consoleContent.insertBefore(newLog, cursorLine);

    // Evitar scroll infinito limpiando logs viejos pero manteniendo tu búsqueda inicial fija
    const entries = consoleContent.querySelectorAll(".log-entry, .log-result");
    if (entries.length > 12) {
        // Remueve el primer log dinámico creado para proteger tu cabecera fija
        if(entries[5]) entries[5].remove();
    }
}

// --- INICIALIZADOR ---
document.addEventListener("DOMContentLoaded", () => {
    // Genera tráfico de red simulado cada 3.5 segundos sin tocar el renglón de la UNI
    setInterval(updateLiveFeed, 3500);
    
    // Agrega comandos complementarios a la terminal cada 5 segundos
    setInterval(injectConsoleLogs, 5000);
});
