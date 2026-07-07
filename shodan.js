// --- CONFIGURACIÓN DE DATOS SIMULADOS ---
const countries = ["US (United States)", "CN (China)", "BR (Brazil)", "DE (Germany)", "PE (Peru)", "JP (Japan)", "RU (Russia)"];
const ports =;
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

// --- ACTUALIZADOR DE TRÁFICO EN TIEMPO REAL ---
function updateLiveFeed() {
    const tbody = document.querySelector(".feed-table tbody");
    if (!tbody) return;

    // Crear nueva fila
    const tr = document.createElement("tr");
    const vuln = getRandomElement(vulnerabilities);

    tr.innerHTML = `
        <td>${getTimestamp()}</td>
        <td class="text-cyan">${generateRandomIP()}</td>
        <td>${getRandomElement(countries)}</td>
        <td>${getRandomElement(ports)}</td>
        <td class="${vuln.level}">${vuln.name}</td>
    `;

    // Insertar al inicio de la tabla
    tbody.insertBefore(tr, tbody.firstChild);

    // Mantener solo las últimas 5 filas para no saturar la pantalla
    if (tbody.children.length > 5) {
        tbody.removeChild(tbody.lastChild);
    }
}

// --- SIMULADOR DE CONSOLA DE TEXTO ---
const hackerCommands = [
    "shodan honeypot score ",
    "shodan download leaks_dataset ",
    "shodan alert list",
    "shodan myip"
];

function injectConsoleLogs() {
    const consoleContent = document.querySelector(".console-panel .panel-content");
    const cursorLine = document.querySelector(".cursor-line");
    if (!consoleContent || !cursorLine) return;

    // Generar entrada aleatoria de comando o sistema
    const isCommand = Math.random() > 0.5;
    const newLog = document.createElement("div");

    if (isCommand) {
        newLog.className = "log-entry command-line";
        newLog.innerText = getRandomElement(hackerCommands) + generateRandomIP();
    } else {
        newLog.className = "log-entry";
        newLog.style.color = "#888";
        newLog.innerText = `[SYS_EVENT] Audit check complete on node ${Math.floor(Math.random() * 9000 + 1000)}`;
    }

    // Insertar justo antes del prompt del cursor
    consoleContent.insertBefore(newLog, cursorLine);

    // Limitar histórico de logs en consola para legibilidad
    const entries = consoleContent.querySelectorAll(".log-entry, .log-result");
    if (entries.length > 10) {
        entries[0].remove();
    }
}

// --- INICIALIZADOR DE BUCLE ---
document.addEventListener("DOMContentLoaded", () => {
    // Actualizar tabla cada 3 segundos
    setInterval(updateLiveFeed, 3000);
    
    // Actualizar logs de consola cada 4.5 segundos
    setInterval(injectConsoleLogs, 4500);
});
