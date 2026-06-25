document.addEventListener("DOMContentLoaded", () => {
    // 🌌 CARACTERES ESTILO TERMINAL HACKER
    const cyberChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%-=+*[]{}<>/";
    
    // FUNCIÓN PRINCIPAL: Efecto descifrado / Matrix
    function decryptText(element, finalValue) {
        if (!element) return;
        let iteration = 0;
        clearInterval(element.cyberInterval);
        
        element.cyberInterval = setInterval(() => {
            element.innerText = finalValue
                .split("")
                .map((char, index) => {
                    // Respetar espacios, puntos y el emoji de la bandera de Perú para no descuadrar el diseño
                    if (char === " " || char === "." || char === "🇵🇪") return char;
                    if (index < iteration) return finalValue[index];
                    return cyberChars[Math.floor(Math.random() * cyberChars.length)];
                })
                .join("");
            
            if (iteration >= finalValue.length) {
                clearInterval(element.cyberInterval);
                element.innerText = finalValue; // Asegura el texto real al finalizar
            }
            iteration += 1 / 3; // Velocidad del descifrado (más alto es más rápido)
        }, 20);
    }

    // 🟢 SELECCIONAR EXCLUSIVAMENTE LOS TEXTOS DEL PANEL IZQUIERDO
    const leftPanelItems = document.querySelectorAll(".left-panel .info-item p");
    
    leftPanelItems.forEach(p => {
        const originalText = p.innerText;
        
        // 1. Ejecutar el efecto de descifrado automático al cargar la página
        decryptText(p, originalText);
        
        // 2. Efecto interactivo: Se vuelve a escanear/descifrar si pasas el mouse por encima de la fila
        p.parentElement.addEventListener("mouseenter", () => decryptText(p, originalText));
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // 🌌 CARACTERES ESTILO TERMINAL HACKER
    const cyberChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%-=+*[]{}<>/";
    
    // FUNCION PRINCIPAL: Efecto descifrado / Matrix
    function decryptText(element, finalValue) {
        let iteration = 0;
        clearInterval(element.cyberInterval);
        
        element.cyberInterval = setInterval(() => {
            element.innerText = finalValue
                .split("")
                .map((char, index) => {
                    // Si el carácter original es un espacio o punto, lo respetamos para mantener la estructura fija
                    if (char === " " || char === ".") return char;
                    
                    // Si ya pasó la iteración, muestra la letra real
                    if (index < iteration) {
                        return finalValue[index];
                    }
                    // Si no, muestra un carácter aleatorio de la terminal
                    return cyberChars[Math.floor(Math.random() * cyberChars.length)];
                })
                .join("");
            
            if (iteration >= finalValue.length) {
                clearInterval(element.cyberInterval);
                element.innerText = finalValue; // Asegura el valor exacto al final
            }
            
            iteration += 1 / 3; // Velocidad del efecto de descifrado
        }, 25);
    }

    // 🔴 1. INTERCEPTAR ELEMENTOS USANDO TUS CLASES CSS EXISTENTES
    const targetDomain = document.querySelector(".domain");
    const targetIp = document.querySelector(".ip");
    const leftIp = document.querySelector(".ip-green");

    // Guardamos los textos reales antes de iniciar la simulación de escaneo
    if (targetDomain) {
        const originalDomain = targetDomain.innerText;
        decryptText(targetDomain, originalDomain);
        // Se reactiva el efecto si pasas el mouse por encima
        targetDomain.addEventListener("mouseenter", () => decryptText(targetDomain, originalDomain));
    }

    if (targetIp) {
        const originalIp = targetIp.innerText;
        decryptText(targetIp, originalIp);
        targetIp.addEventListener("mouseenter", () => decryptText(targetIp, originalIp));
    }

    if (leftIp) {
        const originalLeftIp = leftIp.innerText;
        decryptText(leftIp, originalLeftIp);
    }


    // 🟢 2. INTERACTIVIDAD EN EL CUADRO DE MANDO INFERIOR
    // Busca automáticamente cualquier tarjeta o botón dentro de la barra de comandos
    const dashboardItems = document.querySelectorAll("[class*='RECONOCIMIENTO'], [class*='ESCANEO'], [class*='GESTIÓN'], [class*='ANÁLISIS'], [class*='INGENIERÍA'], .info-item");

    dashboardItems.forEach(item => {
        item.style.cursor = "pointer";
        item.style.transition = "transform 0.1s ease, filter 0.1s ease";

        item.addEventListener("click", () => {
            // Animación física táctica al presionar el botón (Feedback HUD)
            item.style.transform = "scale(0.96)";
            item.style.filter = "brightness(1.6) contrast(1.1)";
            
            // Simula el envío de comandos en la consola oculta del navegador (F12)
            console.log(`%c[EXE] INICIANDO CONTROLES: ${item.innerText.split('\n')[0]}`, "color: #ff3a3a; font-family: monospace; font-weight: bold;");

            setTimeout(() => {
                item.style.transform = "none";
                item.style.filter = "none";
            }, 120);
        });
    });
});
