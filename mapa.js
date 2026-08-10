const map = L.map("map", {
  zoomControl: true,
  preferCanvas: true
});

// Imagen satelital para que la pantalla se parezca al modelo
const imagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 19, attribution: "Tiles © Esri" }
).addTo(map);

// Capa de referencia de calles, tenue
const labels = L.tileLayer(
  "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 19, opacity: 0.45, attribution: "Esri" }
).addTo(map);

const layers = {
  buses: L.layerGroup().addTo(map),
  energy: L.layerGroup().addTo(map),
  charge: L.layerGroup().addTo(map),
  tourism: L.layerGroup().addTo(map),
  stations: L.layerGroup().addTo(map)
};

let districtLayer = null;
let districtBounds = null;

// Fuente oficial IDEP/IGN: límite distrital referencial, UBIGEO 110304 = Marcona.
// Se carga por GeoJSON directamente desde el servicio oficial.
const districtURL =
  "https://www.idep.gob.pe/geoportal/rest/services/DATOS_GEOESPACIALES/L%C3%8DMITES/FeatureServer/5/query" +
  "?where=UBIGEO%3D%27110304%27" +
  "&outFields=UBIGEO%2CNOMBDIST%2CNOMBPROV%2CNOMBDEP%2CCAPITAL" +
  "&returnGeometry=true&outSR=4326&f=geojson";

async function loadDistrictBoundary() {
  try {
    const response = await fetch(districtURL);
    if (!response.ok) throw new Error("No se pudo consultar el límite distrital");
    const geojson = await response.json();

    districtLayer = L.geoJSON(geojson, {
      className: "district-outline",
      style: {
        color: "#48ef62",
        weight: 3,
        opacity: 1,
        fillColor: "#29c64d",
        fillOpacity: 0.055
      },
      onEachFeature: (feature, layer) => {
        const p = feature.properties || {};
        layer.bindPopup(`
          <div class="popup-title">DISTRITO DE SAN JUAN DE MARCONA</div>
          <b>UBIGEO:</b> ${p.UBIGEO || "110304"}<br>
          <b>Provincia:</b> ${p.NOMBPROV || "Nasca"}<br>
          <b>Departamento:</b> ${p.NOMBDEP || "Ica"}<br>
          <span class="popup-good">Límite distrital cargado desde IDEP</span>
        `);
      }
    }).addTo(map);

    districtBounds = districtLayer.getBounds();
    map.fitBounds(districtBounds, { padding: [25, 25] });
  } catch (error) {
    console.error(error);
    // Vista inicial de respaldo; no reemplaza el límite oficial.
    map.setView([-15.3618, -75.1637], 12.2);
  }
}

loadDistrictBoundary();

function icon(type, symbol) {
  return L.divIcon({
    className: "",
    html: `<div class="marker-icon marker-${type}">${symbol}</div>`,
    iconSize: [27, 27],
    iconAnchor: [13.5, 13.5],
    popupAnchor: [0, -13]
  });
}

function popup(title, rows) {
  return `<div class="popup-title">${title}</div>` +
    rows.map(([a,b]) => `<b>${a}:</b> ${b}<br>`).join("");
}

// Coordenadas demostrativas de infraestructura propuesta;
// reemplázalas por coordenadas reales cuando el equipo las valide.
const buses = [
  [-15.3618,-75.1637,"Bus Marcona 01","Ruta Costera","En circulación"],
  [-15.3650,-75.1670,"Bus Marcona 02","Ruta Turística","En circulación"],
  [-15.3585,-75.1570,"Bus Marcona 03","Ruta Natural","En circulación"],
  [-15.3690,-75.1720,"Bus Marcona 04","Ruta Industrial","En parada"],
  [-15.3555,-75.1605,"Bus Marcona 05","Ruta Costera","En circulación"],
  [-15.3720,-75.1690,"Bus Marcona 06","Ruta Industrial","En circulación"]
];

buses.forEach(b => {
  L.marker([b[0],b[1]], {icon:icon("bus","▣")})
    .bindPopup(popup("BUS · " + b[2], [
      ["Ruta", b[3]], ["Estado", `<span class="popup-good">${b[4]}</span>`]
    ]))
    .addTo(layers.buses);
});

const charges = [
  [-15.3598,-75.1595,"Electrolinera Centro","Centro de Marcona",4,"Disponible"],
  [-15.3508,-75.1630,"Electrolinera Norte","San Nicolás",4,"Disponible"],
  [-15.3695,-75.1695,"Marcona Sur","Zona Sur",2,"Disponible"],
  [-15.3635,-75.1740,"Puerto Marcona","Zona Portuaria",4,"Ocupado"],
  [-15.3470,-75.1770,"Lomas de Marcona","Lomas de Marcona",2,"Disponible"]
];

charges.forEach(c => {
  L.marker([c[0],c[1]], {icon:icon("charge","ϟ")})
    .bindPopup(popup("PUNTO DE CARGA · " + c[2], [
      ["Ubicación",c[3]],["Cargadores",c[4]],
      ["Estado",c[5] === "Disponible" ? `<span class="popup-good">${c[5]}</span>` : `<span style="color:#ff9f17">${c[5]}</span>`]
    ]))
    .addTo(layers.charge);
});

const solar = [
  [-15.3525,-75.1715,"Instalación Solar Norte","2.4 MW"],
  [-15.3645,-75.1810,"Sistema Solar Marcona","0.8 MW"],
  [-15.3730,-75.1580,"Sistema Solar Sur","0.6 MW"]
];

solar.forEach(s => {
  L.marker([s[0],s[1]], {icon:icon("solar","☼")})
    .bindPopup(popup("ENERGÍA SOLAR · " + s[2], [
      ["Generación",s[3]],["Estado",`<span class="popup-good">Operativo</span>`]
    ]))
    .addTo(layers.energy);
});

const wind = [
  [-15.2920,-75.1800,"Parque Eólico Marcona","8.7 MW"],
  [-15.2550,-75.1250,"Zona Eólica Este","5.0 MW"],
  [-15.3150,-75.0750,"Zona Eólica Norte","4.2 MW"]
];

wind.forEach(w => {
  L.marker([w[0],w[1]], {icon:icon("wind","♨")})
    .bindPopup(popup("ENERGÍA EÓLICA · " + w[2], [
      ["Generación",w[3]],["Estado",`<span class="popup-good">Operativo</span>`]
    ]))
    .addTo(layers.energy);
});

const stations = [
  [-15.21185,-75.11115,"Subestación Marcona","Referencia geográfica"],
  [-15.3330,-75.1510,"Subestación / Nodo","Infraestructura energética"]
];

stations.forEach(s => {
  L.marker([s[0],s[1]], {icon:icon("station","ϟ")})
    .bindPopup(popup("SUBESTACIÓN · " + s[2], [
      ["Tipo",s[3]],["Estado",`<span class="popup-good">Operativo</span>`]
    ]))
    .addTo(layers.stations);
});

const tourism = [
  [-15.3635,-75.1780,"Playa Yanyarina","Ruta Costera"],
  [-15.3520,-75.1630,"Centro de Marcona","Ruta Turística"],
  [-15.3060,-75.2150,"Lomas de Marcona","Ruta Natural"],
  [-15.3700,-75.1740,"Puerto San Juan","Ruta Industrial"]
];

tourism.forEach(t => {
  L.marker([t[0],t[1]], {icon:icon("tourism","▣")})
    .bindPopup(popup("PUNTO TURÍSTICO · " + t[2], [
      ["Ruta",t[3]],["Estado",`<span class="popup-good">Disponible</span>`]
    ]))
    .addTo(layers.tourism);
});

// Rutas visuales demostrativas
const route1 = [
  [-15.3618,-75.1637],[-15.3630,-75.1680],[-15.3600,-75.1730],[-15.3635,-75.1780]
];
const route2 = [
  [-15.3618,-75.1637],[-15.3560,-75.1600],[-15.3520,-75.1630]
];
L.polyline(route1,{color:"#31a8ff",weight:3,opacity:.85,dashArray:"7 6"}).addTo(layers.buses);
L.polyline(route2,{color:"#b65dff",weight:3,opacity:.75,dashArray:"7 6"}).addTo(layers.tourism);

function showLayer(name) {
  Object.entries(layers).forEach(([key,layer]) => {
    if (name === "all" || key === name) {
      if (!map.hasLayer(layer)) map.addLayer(layer);
    } else {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    }
  });

  document.querySelectorAll(".map-tabs button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.layer === name);
  });
}

document.querySelectorAll(".map-tabs button").forEach(btn => {
  btn.addEventListener("click", () => showLayer(btn.dataset.layer));
});

document.getElementById("fitDistrict").addEventListener("click", () => {
  if (districtBounds) map.fitBounds(districtBounds, {padding:[25,25], maxZoom:12.5});
});

document.getElementById("alertsLink").addEventListener("click", e => {
  e.preventDefault();
  alert("Módulo de novedades: aquí se mostrarán alertas y comunicados públicos.");
});

// Reloj
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2,"0");
  const m = String(now.getMinutes()).padStart(2,"0");
  const s = String(now.getSeconds()).padStart(2,"0");
  document.getElementById("clock").textContent = `${h}:${m}:${s}`;

  document.getElementById("date").textContent =
    now.toLocaleDateString("es-PE",{day:"2-digit",month:"2-digit",year:"numeric"}).replaceAll("/"," / ");

  document.getElementById("day").textContent =
    now.toLocaleDateString("es-PE",{weekday:"long"});
}
updateClock();
setInterval(updateClock,1000);

// Simulación visual de telemetría
function updateTelemetry() {
  const temp = (21 + Math.random()*3).toFixed(1);
  const windSpeed = Math.round(15 + Math.random()*7);
  const solarPower = (2.1 + Math.random()*0.7).toFixed(1);
  const windPower = (7.9 + Math.random()*1.7).toFixed(1);
  const humidity = Math.round(64 + Math.random()*8);

  document.getElementById("temperature").textContent = `${temp}°C`;
  document.getElementById("temperatureTop").textContent = `${temp}°C`;
  document.getElementById("wind").textContent = `${windSpeed} km/h`;
  document.getElementById("windTop").textContent = `${windSpeed} km/h`;
  document.getElementById("solarValue").textContent = solarPower;
  document.getElementById("windPower").textContent = windPower;
  document.getElementById("humidity").textContent = `${humidity}%`;
}
updateTelemetry();
setInterval(updateTelemetry,5000);

// Mostrar inicialmente todas las capas
showLayer("all");
