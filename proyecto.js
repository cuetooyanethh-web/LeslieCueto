document.addEventListener("DOMContentLoaded", () => {

    /*========================================
      HEADER EFECTO SCROLL
    ========================================*/
    const header = document.querySelector(".hud-header");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            header.style.background = "rgba(5,8,15,.98)";
            header.style.boxShadow = "0 8px 25px rgba(255,46,46,.15)";
        } else {
            header.style.background = "rgba(6,8,14,.95)";
            header.style.boxShadow = "none";
        }
    });

    /*========================================
      MENÚ ACTIVO
    ========================================*/
    const links = document.querySelectorAll(".hud-nav a");

    links.forEach(link => {

        link.addEventListener("click", function (e) {

            links.forEach(l => l.classList.remove("active"));
            this.classList.add("active");

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {

                e.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    });

    /*========================================
      APARICIÓN AL HACER SCROLL
    ========================================*/
    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

            }

        });

    }, {
        threshold: 0.15
    });

    document.querySelectorAll(
        ".hero-dashboard,.info-card,.risk-card,.progress-card"
    ).forEach(el => {

        el.classList.add("hidden");

        observer.observe(el);

    });

    /*========================================
      MATRIX
    ========================================*/
    const canvas = document.getElementById("matrix");

    if (canvas) {

        const ctx = canvas.getContext("2d");

        const letters = "010101010101";

        const fontSize = 14;

        let columns;

        let drops = [];

        function resize() {

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            columns = Math.floor(canvas.width / fontSize);

            drops = Array(columns).fill(1);

        }

        resize();

        window.addEventListener("resize", resize);

        function draw() {

            ctx.fillStyle = "rgba(0,0,0,.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#ff2e2e";
            ctx.font = fontSize + "px monospace";

            for (let i = 0; i < drops.length; i++) {

                const text = letters[Math.floor(Math.random() * letters.length)];

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > .975) {

                    drops[i] = 0;

                }

                drops[i]++;

            }

        }

        setInterval(draw, 35);

    }

    /*========================================
      CÍRCULO RIESGO
    ========================================*/
    const circle = document.querySelector(".circle-progress");

    if (circle) {

        const radius = 55;

        const circumference = 2 * Math.PI * radius;

        circle.style.strokeDasharray = circumference;

        const percent = 26;

        const offset = circumference - (percent / 100) * circumference;

        setTimeout(() => {

            circle.style.strokeDashoffset = offset;

        }, 300);

    }

    /*========================================
      CONTADOR 2.6
    ========================================*/
    const score = document.querySelector(".score");

    if (score) {

        let value = 0;

        const timer = setInterval(() => {

            value += 0.1;

            score.textContent = value.toFixed(1);

            if (value >= 2.6) {

                score.textContent = "2.6";

                clearInterval(timer);

            }

        }, 45);

    }

    /*========================================
      PROGRESO
    ========================================*/
    const progress = document.querySelector(".progress-fill");

    if (progress) {

        setTimeout(() => {

            progress.style.width = "100%";

        }, 500);

    }

    /*========================================
      HERO
    ========================================*/
    const hero = document.querySelector(".hero-dashboard");

    if (hero) {

        hero.style.opacity = "0";
        hero.style.transform = "translateY(30px)";
        hero.style.transition = "1s";

        setTimeout(() => {

            hero.style.opacity = "1";
            hero.style.transform = "translateY(0)";

        }, 250);

    }

    /*========================================
      TARJETA OBJETIVO
    ========================================*/
    const target = document.querySelector(".hero-target");

    if (target) {

        setInterval(() => {

            target.style.boxShadow = "0 0 18px rgba(255,40,40,.35)";

            setTimeout(() => {

                target.style.boxShadow = "0 0 6px rgba(255,40,40,.10)";

            }, 500);

        }, 2500);

    }

    /*========================================
      PUNTO MAPA
    ========================================*/
    const dot = document.querySelector(".center-dot");

    if (dot) {

        setInterval(() => {

            dot.style.boxShadow = "0 0 25px red";

            setTimeout(() => {

                dot.style.boxShadow = "0 0 8px red";

            }, 400);

        }, 1800);

    }

    /*========================================
      SCANNER
    ========================================*/
    const scanner = document.querySelector(".scanner-light");

    if (scanner) {

        let pos = -30;

        let dir = 1;

        setInterval(() => {

            pos += dir * 2;

            if (pos >= 30) dir = -1;
            if (pos <= -30) dir = 1;

            scanner.style.transform =
                `translateX(calc(-50% + ${pos}px))`;

        }, 30);

    }

    /*========================================
      PARPADEO MAPA
    ========================================*/
    const map = document.querySelector(".hero-map img");

    if (map) {

        setInterval(() => {

            map.style.filter =
                "drop-shadow(0 0 18px rgba(255,0,0,.65))";

            setTimeout(() => {

                map.style.filter =
                    "drop-shadow(0 0 10px rgba(255,0,0,.25))";

            }, 400);

        }, 3000);

    }

    /*========================================
      SISTEMA ACTIVO
    ========================================*/
    const status = document.querySelector(".status-dot");

    if (status) {

        setInterval(() => {

            status.style.opacity =
                status.style.opacity === "0.3" ? "1" : "0.3";

        }, 700);

    }

});
 