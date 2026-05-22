window.onload = function () {

    const canvas = document.getElementById("matrix");
    const ctx = canvas.getContext("2d");

    function ajustarCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    ajustarCanvas();

    const letras = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;

    let columnas;
    let gotas;

    function iniciar() {
        columnas = Math.floor(canvas.width / fontSize);
        gotas = [];

        for (let i = 0; i < columnas; i++) {
            gotas[i] = Math.random() * canvas.height;
        }
    }

    iniciar();

    function dibujar() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ff1a1a";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < gotas.length; i++) {
            let texto = letras[Math.floor(Math.random() * letras.length)];

            ctx.fillText(texto, i * fontSize, gotas[i]);

            if (gotas[i] > canvas.height && Math.random() > 0.975) {
                gotas[i] = 0;
            }

            gotas[i] += fontSize;
        }
    }

    setInterval(dibujar, 35);

    window.addEventListener("resize", () => {
        ajustarCanvas();
        iniciar();
    });

};