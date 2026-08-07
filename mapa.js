// Coordenadas centro Marcona
var marcona = [-15.3618294, -75.1637323];

// Crear mapa
var map = L.map('map', {
    center: marcona,
    zoom: 16,
    minZoom: 14,
    maxZoom: 18,
    fullscreenControl: true
});
// Límites SOLO Marcona (más ajustado)
var bounds = [
    [-15.39, -75.20],
    [-15.33, -75.13]
];

// Mapa satélite
L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0','mt1','mt2','mt3']
}).addTo(map);

// Función para puntos con nombre visible
function marcador(coords, nombre) {
    return L.marker(coords).addTo(map)
        .bindPopup(nombre)
        .bindTooltip(nombre, {
            permanent: true,
            direction: "top",
            offset: [0, -10],
            className: "label-mapa"
        });
}



// 🏖️ Playa Hermosa (dentro del distrito)
var iconoPlaya = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
    iconSize: [28, 28]
});

L.marker([-15.3564104, -75.1707721], { icon: iconoPlaya })
    .addTo(map)
    .bindTooltip("Playa Hermosa", {
        permanent: false,
        direction: "top",
        offset: [0, -10],
        className: "label-mapa"
    });
var faroSanJuan = [-15.3612604, -75.180763];
// Icono para faro
var iconoFaro = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [28, 28]
});

// Marcador Faro San Juan
L.marker(faroSanJuan, { icon: iconoFaro })
    .addTo(map)
    .bindTooltip("Faro San Juan", {
        permanent: false,
        direction: "top",
        offset: [0, -10],
        className: "label-mapa"
    });
    // 📍 Mirador Turístico de Punta San Juan
var miradorPuntaSanJuan = [-15.3606306, -75.1878082];

var iconoMirador = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    iconSize: [28, 28]
});

L.marker(miradorPuntaSanJuan, { icon: iconoMirador })
.addTo(map)
.bindTooltip("Mirador Punta San Juan", {
    permanent:false,
    direction: "top",
    offset: [0, -10],
    className: "label-mapa"
});
// 📍 Zona Reservada Punta San Juan
var zonaReservada = [-15.3638208, -75.1880986];

var iconoReserva = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
    iconSize: [28, 28]
});

L.marker(zonaReservada, { icon: iconoReserva })
.addTo(map)
.bindTooltip("Zona Reservada Punta San Juan", {
    permanent: false,
    direction: "top",
    offset: [0, -10],
    className: "label-mapa"
});
// 📍 Parque G Alta
var parqueGAlta = [-15.3615908, -75.174428];

var iconoParque = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    iconSize: [28, 28]
});

L.marker(parqueGAlta, { icon: iconoParque })
.addTo(map)
.bindTooltip("Parque G Alta", {
    permanent: false,
    direction: "top",
    offset: [0, -10],
    className: "label-mapa"
});
// 📍 Parque Zona H
var parqueZonaH = [-15.3583347, -75.1656193];

var iconoParqueH = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    iconSize: [28, 28]
});

L.marker(parqueZonaH, { icon: iconoParqueH })
.addTo(map)
.bindTooltip("Parque Zona H", {
    permanent: false,
    direction: "top",
    offset: [0, -10],
    className: "label-mapa"
});
// 📍 I.E. Ricardo Palma
var colegioRicardoPalma = [-15.3580665, -75.1690605];

var iconoColegio = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/167/167707.png",
    iconSize: [28, 28]
});

L.marker(colegioRicardoPalma, { icon: iconoColegio })
.addTo(map)
.bindTooltip("I.E. Ricardo Palma", {
    permanent: false,
    direction: "top",
    offset: [0, -10],
    className: "label-mapa"
});
// 📍 I.E. Miguel Grau
var colegioMiguelGrau = [-15.3593477, -75.1667593];

var iconoColegioGrau = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/167/167707.png",
    iconSize: [28, 28]
});

L.marker(colegioMiguelGrau, { icon: iconoColegioGrau })
.addTo(map)
.bindTooltip("I.E. Miguel Grau", {
    permanent: false,
    direction: "top",
    offset: [0, -10],
    className: "label-mapa"
});
// 📍 Estadio Maracaná
var estadioMaracana = [-15.3658489, -75.1707637];

var iconoEstadio = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/53/53283.png",
    iconSize: [28, 28]
});

L.marker(estadioMaracana, { icon: iconoEstadio })
.addTo(map)
.bindTooltip("Estadio Maracaná", {
    permanent: false,
    direction: "top",
    offset: [0, -10],
    className: "label-mapa"
});
// 📍 Los Morritos de la Zona "P"
var morritosZonaP = [-15.3664684, -75.1742248];

var iconoTurismo = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    iconSize: [28, 28]
});

L.marker(morritosZonaP, { icon: iconoTurismo })
.addTo(map)
.bindTooltip("Los Morritos Zona P", {
    permanent: false,
    direction: "top",
    offset: [0, -10],
    className: "label-mapa"
});
// 📍 Marmol - Marcona
var marmolMarcona = [-15.3636268, -75.1830583];

var iconoMineria = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2203/2203186.png",
    iconSize: [28, 28]
});

L.marker(marmolMarcona, { icon: iconoMineria })
.addTo(map)
.bindTooltip("Marmol - Marcona", {
    permanent:false,
    direction: "top",
    offset: [0, -10],
    className: "label-mapa"
});
// 📍 Playa La Herradura
var playaHerradura = [-15.3714053, -75.1789796];

var iconoPlayaHerradura = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
    iconSize: [28, 28]
});

L.marker(playaHerradura, { icon: iconoPlayaHerradura })
.addTo(map)
.bindTooltip("Playa La Herradura", {
    permanent: false,
    direction: "top",
    offset: [0, -10],
    className: "label-mapa"
});
// 📍 San Carlos
var sanCarlos = [-15.3706912, -75.1713876];

var iconoZona = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [28, 28]
});

L.marker(sanCarlos, { icon: iconoZona })
.addTo(map)
.bindTooltip("San Carlos", {
    permanent: false,
    direction: "top",
    offset: [0, -10],
    className: "label-mapa"
});
// 📍 Playa La Herradura
var playaHerradura = [-15.3714053, -75.1789796];

var iconoPlayaHerradura = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
    iconSize: [28, 28]
});
L.marker(playaHerradura, { icon: iconoPlayaHerradura })
.addTo(map)
.bindPopup(" Playa La Herradura")
.bindTooltip(`
    <div class="tooltip-lugar">
        <img src="images/PLAYAHERRADURA.jpg">
        <br>
        <b> Playa La Herradura</b>
    </div>
`, {
    permanent: false,
    direction: "top",
    offset: [0, -10],
    className: "label-mapa"
});
// 📍 PUNTO 1
var punto1 = [-15.411695, -75.060116];

var iconoPunto = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [28, 28]
});

L.marker(punto1, { icon: iconoPunto })
.addTo(map)
.bindPopup("📍 Punto 1")
.bindTooltip(`
    <div class="tooltip-lugar">
        <img src="images/punto1.jpg">
        <br>
        <b>📍 Punto 1</b>
    </div>
`, {
    permanent: false,
    direction: "top",
    offset: [0, -10],
    className: "label-mapa"
});
// 📍 El Elefante
var elElefante = [-15.3918244, -75.1592276];

var iconoTurismo = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    iconSize: [28, 28]
});

L.marker(elElefante, { icon: iconoTurismo })
.addTo(map)
.bindPopup("🐘 El Elefante")
.bindTooltip(`
    <div class="tooltip-lugar">
        <img src="images/elefante.jpg">
        <br>
        <b>🐘 El Elefante</b>
    </div>
`, {
    permanent: false,
    direction: "top",
    offset: [0, -10],
    className: "label-mapa"
});
// 📍 Parque eólico Marcona
var parqueEolico = [-15.3917662, -75.0538969];

var iconoEolico = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
    iconSize: [28, 28]
});

L.marker(parqueEolico, { icon: iconoEolico })
.addTo(map)
.bindPopup("⚡ Parque Eólico Marcona")
.bindTooltip(`
    <div class="tooltip-lugar">
        <img src="images/parqueeloico.jpg">
        <br>
        <b>⚡ Parque Eólico Marcona</b>
    </div>
`, {
    permanent: false,
    direction: "top",
    offset: [0, -10],
    className: "label-mapa"
});

// 📍 Parque Eólico Tres Hermanas
var tresHermanas = [-15.382047, -75.04898];

var iconoEolico2 = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  iconSize: [28, 28]
});

L.marker(tresHermanas, { icon: iconoEolico2 })
  .addTo(map)
  .bindPopup("⚡ Parque Eólico Tres Hermanas")
  .bindTooltip(`
    <div class="tooltip-lugar">
      <img src="images/treshermanas.jpg" width="120">
      <br>
      <b>⚡ Parque Eólico Tres Hermanas</b>
    </div>
  `, {
    permanent: false,
    direction: "top",
    offset: [0, -10],
    className: "label-mapa"
  });