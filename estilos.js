// --- CONTROLADOR DE PESTAÑAS INTERACTIVAS (TABS) ---

function showTab(tabId) {
    // 1. Obtener todas las secciones de contenido de las herramientas
    const contents = document.querySelectorAll('.tab-content');
    
    // Ocultar cada una de las secciones removiendo la clase activa
    contents.forEach(content => {
        content.classList.remove('active-content');
    });

    // 2. Obtener todos los botones de navegación de la barra de herramientas
    const buttons = document.querySelectorAll('.nav-btn');
    
    // Desactivar el estado visual seleccionado de todos los botones
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Mostrar la sección específica de la herramienta seleccionada
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
        targetContent.classList.add('active-content');
    }

    // 4. Activar visualmente el botón al que se le hizo clic
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    console.log(`[SOC] Cambiando vista activa al módulo: ${tabId.toUpperCase()}`);
}

// Opcional: Inicializar logs decorativos en la consola del navegador para simular un SOC
document.addEventListener("DOMContentLoaded", () => {
    console.log("==================================================");
    console.log("🛡️ PURPLE TEAM LABORATORY - PORTFOLIO INTERACTIVO");
    console.log("SIEM/IDS Monitorizado. Estado del Feed: CURRENT.");
    console.log("==================================================");
});
