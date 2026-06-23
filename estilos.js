function showTab(tabId) {

    // ocultar todo
    document.querySelectorAll('.tab-content').forEach(sec => {
        sec.classList.remove('active');
    });

    // quitar active botones
    document.querySelectorAll('.hud-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // mostrar sección
    const activeSection = document.getElementById(tabId);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    // activar botón
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }
}
function showTab(tabId, element) {

    document.querySelectorAll('.tab-content').forEach(sec => {
        sec.classList.remove('active');
    });

    document.querySelectorAll('.hud-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');

    element.classList.add('active');
}