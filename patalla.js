/* =========================================================
   MAPA DE MARCONA
========================================================= */

// Coordenadas de San Juan de Marcona
const marcona = [-15.3618294, -75.1637323];


// Crear mapa
const map = L.map("map", {

    center: marcona,

    zoom: 14,

    minZoom: 12,

    maxZoom: 18

});


// Mapa base
L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);



/* =========================================================
   ICONOS
========================================================= */

function crearIcono(color, icono) {

    return L.divIcon({

        className: "",

        html: `
            <div style="
                width:34px;
                height:34px;
                border-radius:50%;
                background:${color};
                border:3px solid #07111c;
                box-shadow:0 0 14px ${color};
                display:flex;
                align-items:center;
                justify-content:center;
                color:#07111c;
                font-size:14px;
            ">
                <i class="${icono}"></i>
            </div>
        `,

        iconSize: [34, 34],

        iconAnchor: [17, 17],

        popupAnchor: [0, -17]

    });

}



/* =========================================================
   ICONOS
========================================================= */

const iconBus = crearIcono(
    "#00d9ff",
    "fa-solid fa-bus"
);

const iconSolar = crearIcono(
    "#ffd84d",
    "fa-solid fa-sun"
);

const iconWind = crearIcono(
    "#27e58b",
    "fa-solid fa-wind"
);

const iconCharge = crearIcono(
    "#ff9f43",
    "fa-solid fa-bolt"
);

const iconTourism = crearIcono(
    "#c77dff",
    "fa-solid fa-camera"
);



/* =========================================================
   CAPAS
========================================================= */

const busesLayer = L.layerGroup();

const energyLayer = L.layerGroup();

const chargeLayer = L.layerGroup();

const tourismLayer = L.layerGroup();



/* =========================================================
   BUSES
========================================================= */

const buses = [

    {
        name: "Bus Marcona 01",
        position: [-15.3615, -75.1620],
        route: "Ruta Costera",
        status: "En circulación"
    },

    {
        name: "Bus Marcona 02",
        position: [-15.3650, -75.1670],
        route: "Ruta Turística",
        status: "En circulación"
    },

    {
        name: "Bus Marcona 03",
        position: [-15.3585, -75.1570],
        route: "Ruta Natural",
        status: "En circulación"
    },

    {
        name: "Bus Marcona 04",
        position: [-15.3690, -75.1720],
        route: "Ruta Costera",
        status: "En parada"
    }

];


buses.forEach(bus => {

    L.marker(
        bus.position,
        {
            icon: iconBus
        }
    )
    .bindPopup(`
        <strong>🚌 ${bus.name}</strong>
        <br><br>
        <b>Ruta:</b> ${bus.route}
        <br>
        <b>Estado:</b> ${bus.status}
        <br>
        <br>
        <span style="color:#27e58b">
            ● Telemetría activa
        </span>
    `)
    .addTo(busesLayer);

});


busesLayer.addTo(map);



/* =========================================================
   ENERGÍA SOLAR
========================================================= */

L.marker(
    [-15.3540, -75.1740],
    {
        icon: iconSolar
    }
)
.bindPopup(`
    <strong>☀️ Infraestructura Solar</strong>
    <br><br>
    Generación estimada:
    <strong>2.4 MW</strong>
    <br>
    Estado:
    <span style="color:#27e58b">
        Operativo
    </span>
`)
.addTo(energyLayer);



/* =========================================================
   ENERGÍA EÓLICA
========================================================= */

L.marker(
    [-15.3420, -75.1850],
    {
        icon: iconWind
    }
)
.bindPopup(`
    <strong>🌬️ Parque Eólico</strong>
    <br><br>
    Generación actual:
    <strong>8.7 MW</strong>
    <br>
    Velocidad del viento:
    <strong>18 km/h</strong>
    <br>
    Estado:
    <span style="color:#27e58b">
        Operativo
    </span>
`)
.addTo(energyLayer);



energyLayer.addTo(map);



/* =========================================================
   PUNTOS DE CARGA
========================================================= */

const chargingPoints = [

    {
        position: [-15.3610, -75.1600],
        name: "Electrolinera Centro"
    },

    {
        position: [-15.3670, -75.1660],
        name: "Punto de carga Marcona Sur"
    },

    {
        position: [-15.3560, -75.1690],
        name: "Punto de carga Turístico"
    },

    {
        position: [-15.3700, -75.1730],
        name: "Electrolinera Norte"
    }

];


chargingPoints.forEach(point => {

    L.marker(
        point.position,
        {
            icon: iconCharge
        }
    )
    .bindPopup(`
        <strong>🔌 ${point.name}</strong>
        <br><br>
        Estado:
        <span style="color:#27e58b">
            Disponible
        </span>
        <br>
        Cargadores:
        4
    `)
    .addTo(chargeLayer);

});


chargeLayer.addTo(map);



/* =========================================================
   TURISMO
========================================================= */

L.marker(
    [-15.3600, -75.1770],
    {
        icon: iconTourism
    }
)
.bindPopup(`
    <strong>🏖️ Punto turístico</strong>
    <br><br>
    Ruta Costera
    <br>
    Estado:
    <span style="color:#27e58b">
        Disponible
    </span>
`)
.addTo(tourismLayer);


tourismLayer.addTo(map);



/* =========================================================
   RUTA TURÍSTICA
========================================================= */

const rutaCostera = [

    [-15.3618, -75.1637],

    [-15.3630, -75.1680],

    [-15.3600, -75.1730],

    [-15.3570, -75.1770]

];


L.polyline(
    rutaCostera,
    {
        color: "#c77dff",
        weight: 4,
        opacity: .8,
        dashArray: "8 7"
    }
)
.bindPopup(
    "<strong>Ruta Turística Costera</strong>"
)
.addTo(tourismLayer);



/* =========================================================
   CONTROLES
========================================================= */

function mostrarBuses() {

    map.addLayer(busesLayer);

    map.removeLayer(energyLayer);

    map.removeLayer(chargeLayer);

    map.removeLayer(tourismLayer);

}


function mostrarEnergia() {

    map.removeLayer(busesLayer);

    map.addLayer(energyLayer);

    map.removeLayer(chargeLayer);

    map.removeLayer(tourismLayer);

}


function mostrarCarga() {

    map.removeLayer(busesLayer);

    map.removeLayer(energyLayer);

    map.addLayer(chargeLayer);

    map.removeLayer(tourismLayer);

}


function mostrarTurismo() {

    map.removeLayer(busesLayer);

    map.removeLayer(energyLayer);

    map.removeLayer(chargeLayer);

    map.addLayer(tourismLayer);

}



/* =========================================================
   RELOJ
========================================================= */

function actualizarReloj() {

    const ahora = new Date();

    const horas =
        String(ahora.getHours()).padStart(2, "0");

    const minutos =
        String(ahora.getMinutes()).padStart(2, "0");

    const segundos =
        String(ahora.getSeconds()).padStart(2, "0");


    document.getElementById("clock").textContent =
        `${horas}:${minutos}:${segundos}`;


    document.getElementById("date").textContent =
        ahora.toLocaleDateString("es-PE");

}


actualizarReloj();

setInterval(actualizarReloj, 1000);



/* =========================================================
   SIMULACIÓN DE TELEMETRÍA
========================================================= */

function actualizarTelemetria() {

    // Simulación de temperatura
    const temperatura =
        (21 + Math.random() * 3).toFixed(1);

    document.getElementById("temperature").textContent =
        temperatura + "°C";


    // Simulación del viento
    const viento =
        Math.floor(15 + Math.random() * 8);

    document.getElementById("wind").textContent =
        viento + " km/h";


    // Simulación solar
    const solar =
        (2.1 + Math.random() * .7).toFixed(1);

    document.getElementById("solarPower").textContent =
        solar;


    // Simulación eólica
    const eolico =
        (7.8 + Math.random() * 2).toFixed(1);

    document.getElementById("windPower").textContent =
        eolico;

}


actualizarTelemetria();

setInterval(
    actualizarTelemetria,
    5000
);