/*/* ============================================================
   MARCONA TELEMETRÍA
   Sistema Inteligente de Monitoreo
   San Juan de Marcona - Perú
   ============================================================ */

const App = {

  map: null,
  markers: {},
  busMarkers: {},
  state: null,
  count: 0,

  /* ==========================================================
     INICIALIZACIÓN
     ========================================================== */

  async init() {

    try {

      this.state = await this.fetchState();

      if (!this.state) {

        this.showError(
          "No se pudo cargar la información del sistema."
        );

        return;
      }

      /* --------------------------------------------------------
         ASEGURAR ESTRUCTURAS
         -------------------------------------------------------- */

      this.state.solar =
        this.state.solar || [];

      this.state.electrolineras =
        this.state.electrolineras || [];

      this.state.buses =
        this.state.buses || [];

      this.state.lighting =
        this.state.lighting || [];

      this.state.scooters =
        this.state.scooters || [];

      this.state.bateries =
        this.state.bateries || [];

      this.state.benches =
        this.state.benches || [];

      this.state.water_treatment =
        this.state.water_treatment || [];

      this.state.port =
        this.state.port || [];

      this.state.alerts =
        this.state.alerts || [];

      this.state.kpis =
        this.state.kpis || {};

      this.state.grid =
        this.state.grid || {};

      this.state.weather =
        this.state.weather || {};

      /* --------------------------------------------------------
         INICIAR SISTEMA
         -------------------------------------------------------- */

      this.initMap();

      this.renderMap();

      this.bindEvents();

      this.startClock();

      this.startUpdates();

      this.refreshUI();

      /* --------------------------------------------------------
         OCULTAR LOADER
         -------------------------------------------------------- */

      const loader =
        document.getElementById("loader");

      if (loader) {

        loader.style.opacity = "0";

        setTimeout(() => {

          loader.remove();

        }, 300);

      }

    } catch (error) {

      console.error(
        "ERROR EN App.init():",
        error
      );

      this.showError(
        "Error al iniciar el sistema: " +
        error.message
      );

    }

  },


  /* ==========================================================
     CARGAR DATOS
     ========================================================== */

  async fetchState() {

    try {

      const response =
        await fetch("./api/index.json", {
          cache: "no-store"
        });

      if (!response.ok) {

        throw new Error(
          `HTTP ${response.status}`
        );

      }

      return await response.json();

    } catch (error) {

      console.error(
        "Error cargando API:",
        error
      );

      return null;

    }

  },


  /* ==========================================================
     ERROR
     ========================================================== */

  showError(message) {

    const loader =
      document.getElementById("loader");

    if (loader) {

      loader.style.opacity = "1";

      loader.innerHTML = `

        <div style="
          text-align:center;
          color:#e8f4fd;
          font-family:system-ui,sans-serif;
          padding:30px;
        ">

          <div style="
            font-size:40px;
            margin-bottom:12px;
          ">
            ⚠
          </div>

          <h2 style="
            margin-bottom:8px;
          ">
            Error del sistema
          </h2>

          <p style="
            color:#8fa8b8;
            font-size:14px;
          ">
            ${message}
          </p>

        </div>

      `;

    }

  },


  /* ==========================================================
     MAPA
     ========================================================== */

  initMap() {

    this.map = L.map("map", {

      scrollWheelZoom: true,

      zoomControl: true,

      minZoom: 12,

      maxZoom: 19

    }).setView(
      [-15.357, -75.135],
      13
    );


    /* --------------------------------------------------------
       SATÉLITE
       -------------------------------------------------------- */

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {

        maxZoom: 19,

        attribution: "Esri"

      }
    ).addTo(this.map);


    /* --------------------------------------------------------
       ETIQUETAS
       -------------------------------------------------------- */

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
      {

        maxZoom: 19,

        subdomains: "abcd",

        pane: "shadowPane"

      }
    ).addTo(this.map);


    /* --------------------------------------------------------
       ACTUALIZAR TAMAÑO
       -------------------------------------------------------- */

    setTimeout(() => {

      this.map.invalidateSize();

    }, 200);


    setTimeout(() => {

      this.map.invalidateSize();

    }, 800);


    setTimeout(() => {

      this.map.invalidateSize();

    }, 2000);


    /* --------------------------------------------------------
       BADGE DEL MAPA
       -------------------------------------------------------- */

    const badge =
      document.getElementById("map-badge");

    if (badge) {

      badge.textContent =
        "CARGANDO";

      badge.classList.add(
        "loading"
      );

    }


    this.map.whenReady(() => {

      if (badge) {

        badge.textContent =
          "EN VIVO";

        badge.classList.remove(
          "loading"
        );

      }

    });

  },


  /* ==========================================================
     ICONOS DEL MAPA
     ========================================================== */

  icon(color, symbol) {

    return L.divIcon({

      html: `

        <div style="
          background:${color};
          width:30px;
          height:30px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          border:2px solid rgba(255,255,255,.9);
          box-shadow:0 2px 8px rgba(0,0,0,.5);
          font-size:14px;
        ">

          <span style="
            font-size:13px;
            line-height:1;
          ">
            ${symbol}
          </span>

        </div>

      `,

      className: "",

      iconSize: [
        30,
        30
      ],

      iconAnchor: [
        15,
        15
      ]

    });

  },


  /* ==========================================================
     RENDERIZAR MAPA
     ========================================================== */

  renderMap() {

    if (!this.map || !this.state) {

      return;

    }


    /* --------------------------------------------------------
       ELIMINAR MARCADORES ANTERIORES
       -------------------------------------------------------- */

    Object.values(
      this.markers
    ).forEach(marker => {

      this.map.removeLayer(
        marker
      );

    });


    Object.values(
      this.busMarkers
    ).forEach(marker => {

      this.map.removeLayer(
        marker
      );

    });


    this.markers = {};

    this.busMarkers = {};


    /* ========================================================
       PLANTAS SOLARES
       ======================================================== */

    (this.state.solar || [])
      .forEach(s => {

        const maintenance =
          s.mode === "maintenance";


        const color =
          maintenance
            ? "#f59e0b"
            : s.status === "online"
              ? "#22c55e"
              : "#ef4444";


        const marker =
          L.marker(
            [
              s.lat,
              s.lng
            ],
            {
              icon:
                this.icon(
                  color,
                  "☀"
                )
            }
          )
          .addTo(this.map);


        marker
          .on("click", () => {

            this.openDetail(
              "solar",
              s.id
            );

          })
          .bindPopup(`

            <b>${s.name}</b><br>

            ${
              maintenance
                ? "EN MANTENIMIENTO"
                : `${Number(
                    s.power_kw || 0
                  ).toFixed(1)} kW`
            }

          `);


        this.markers[s.id] =
          marker;

      });


    /* ========================================================
       ELECTROLINERAS
       ======================================================== */

    (this.state.electrolineras || [])
      .forEach(e => {

        const maintenance =
          e.mode === "maintenance";


        const color =
          maintenance
            ? "#f59e0b"
            : (
                e.status === "available" ||
                e.status === "online"
              )
              ? "#22c55e"
              : e.status === "charging"
                ? "#f59e0b"
                : "#ef4444";


        const marker =
          L.marker(
            [
              e.lat,
              e.lng
            ],
            {
              icon:
                this.icon(
                  color,
                  "⚡"
                )
            }
          )
          .addTo(this.map);


        marker
          .on("click", () => {

            this.openDetail(
              "ev",
              e.id
            );

          })
          .bindPopup(`

            <b>${e.name}</b><br>

            ${
              maintenance
                ? "EN MANTENIMIENTO"
                : e.status
            }

          `);


        this.markers[e.id] =
          marker;

      });


    /* ========================================================
       BUSES
       ======================================================== */

    (this.state.buses || [])
      .forEach(bus => {

        const maintenance =
          bus.mode === "maintenance";


        const color =
          maintenance
            ? "#f59e0b"
            : bus.status === "moving"
              ? "#22c55e"
              : bus.status === "stopped"
                ? "#f59e0b"
                : "#64748b";


        const marker =
          L.marker(
            [
              bus.lat,
              bus.lng
            ],
            {
              icon:
                this.icon(
                  color,
                  "🚌"
                )
            }
          )
          .addTo(this.map);


        marker
          .on("click", () => {

            this.openDetail(
              "bus",
              bus.id
            );

          })
          .bindPopup(`

            <b>${bus.plate}</b><br>

            ${
              maintenance
                ? "EN MANTENIMIENTO"
                : bus.route
            }

          `);


        this.busMarkers[bus.id] =
          marker;

      });


    /* ========================================================
       ALUMBRADO
       ======================================================== */

    (this.state.lighting || [])
      .forEach(light => {

        const maintenance =
          light.mode === "maintenance";


        const color =
          maintenance
            ? "#f59e0b"
            : light.status === "on"
              ? "#38bdf8"
              : "#475569";


        const marker =
          L.circleMarker(
            [
              light.lat,
              light.lng
            ],
            {

              radius: 5,

              fillColor: color,

              color: "#ffffff",

              weight: 1.5,

              fillOpacity: 0.9

            }
          )
          .addTo(this.map);


        marker
          .on("click", () => {

            this.openDetail(
              "lighting",
              light.id
            );

          })
          .bindPopup(`

            <b>${light.id}</b><br>

            ${
              maintenance
                ? "EN MANTENIMIENTO"
                : `${light.status} | Batt ${light.battery_pct}%`
            }

          `);


        this.markers[light.id] =
          marker;

      });


    /* ========================================================
       SCOOTERS
       ======================================================== */

    (this.state.scooters || [])
      .forEach(sc => {

        const maintenance =
          sc.mode === "maintenance";


        const color =
          maintenance
            ? "#f59e0b"
            : sc.status === "available"
              ? "#22c55e"
              : sc.status === "riding"
                ? "#38bdf8"
                : "#64748b";


        const marker =
          L.marker(
            [
              sc.lat,
              sc.lng
            ],
            {
              icon:
                this.icon(
                  color,
                  "🛴"
                )
            }
          )
          .addTo(this.map);


        marker
          .on("click", () => {

            this.openDetail(
              "scooter",
              sc.id
            );

          })
          .bindPopup(`

            <b>${sc.id}</b><br>

            ${
              maintenance
                ? "EN MANTENIMIENTO"
                : sc.status
            }

          `);


        this.markers[sc.id] =
          marker;

      });


    /* ========================================================
       PLANTAS DE TRATAMIENTO DE AGUA
       ======================================================== */

    (this.state.water_treatment || [])
      .forEach(w => {

        const maintenance =
          w.mode === "maintenance";


        const color =
          maintenance
            ? "#f59e0b"
            : w.status === "running"
              ? "#06b6d4"
              : "#ef4444";


        const marker =
          L.marker(
            [
              w.lat,
              w.lng
            ],
            {
              icon:
                this.icon(
                  color,
                  "💧"
                )
            }
          )
          .addTo(this.map);


        marker
          .on("click", () => {

            this.openDetail(
              "water",
              w.id
            );

          })
          .bindPopup(`

            <b>${w.name}</b><br>

            ${
              maintenance
                ? "EN MANTENIMIENTO"
                : `${w.current_flow_l_s} L/s`
            }

          `);


        this.markers[w.id] =
          marker;

      });


    /* ========================================================
       PUERTO
       ======================================================== */

    (this.state.port || [])
      .forEach(port => {

        const marker =
          L.marker(
            [
              port.lat,
              port.lng
            ],
            {
              icon:
                this.icon(
                  "#f97316",
                  "⚓"
                )
            }
          )
          .addTo(this.map);


        marker
          .on("click", () => {

            this.openDetail(
              "port",
              port.id
            );

          })
          .bindPopup(`

            <b>${port.name}</b><br>

            Buques:
            ${port.vessels_today}

          `);


        this.markers[port.id] =
          marker;

      });

  },


  /* ==========================================================
     EVENTOS
     ========================================================== */

  bindEvents() {

    document.addEventListener(
      "click",
      event => {


        /* RESOLVER ALERTA */

        if (
          event.target.classList.contains(
            "al-res"
          )
        ) {

          this.resolveAlert(
            event.target.dataset.id,
            event.target
          );

          return;

        }


        /* CERRAR PANEL */

        if (
          event.target.id === "dp-close" ||
          event.target.id === "detail-overlay"
        ) {

          this.closeDetail();

          return;

        }


        /* SOPORTE */

        if (
          event.target.id === "supportBtn" ||
          event.target.id === "supportClose" ||
          event.target.id === "supportOverlay"
        ) {

          this.toggleSupport();

          return;

        }


        /* LOGOUT */

        if (
          event.target.id === "logoutBtn"
        ) {

          this.logout();

          return;

        }


        /* TARJETAS */

        const card =
          event.target.closest(
            ".mc[data-id]"
          );

        if (card) {

          this.openDetail(
            card.dataset.type,
            card.dataset.id
          );

          return;

        }


        /* ALUMBRADO */

        const light =
          event.target.closest(
            ".ld[data-id]"
          );

        if (light) {

          this.openDetail(
            "lighting",
            light.dataset.id
          );

          return;

        }


        /* BUS */

        const busRow =
          event.target.closest(
            "tr[data-bus]"
          );

        if (busRow) {

          this.openDetail(
            "bus",
            busRow.dataset.bus
          );

        }

      }
    );

  },


  /* ==========================================================
     SOPORTE
     ========================================================== */

  toggleSupport() {

    const overlay =
      document.getElementById(
        "supportOverlay"
      );

    const modal =
      document.getElementById(
        "supportModal"
      );

    if (!overlay || !modal) {

      return;

    }


    const isOpen =
      overlay.classList.contains(
        "open"
      );


    if (isOpen) {

      overlay.classList.remove(
        "open"
      );

      modal.classList.remove(
        "open"
      );

    } else {

      overlay.classList.add(
        "open"
      );

      modal.classList.add(
        "open"
      );

    }

  },


  /* ==========================================================
     CERRAR SESIÓN
     ========================================================== */

  logout() {

    if (
      confirm(
        "¿Cerrar sesión del panel SCADA?"
      )
    ) {

      document.body.innerHTML = `

        <div style="
          display:flex;
          align-items:center;
          justify-content:center;
          height:100vh;
          background:#050b10;
          color:#e8f4fd;
          font-family:sans-serif;
        ">

          <div style="
            text-align:center;
          ">

            <h1>
              Sesión cerrada
            </h1>

            <p style="
              color:#8fa8b8;
              margin-top:8px;
            ">
              Puede cerrar esta pestaña.
            </p>

          </div>

        </div>

      `;

    }

  },


  /* ==========================================================
     PANEL DE DETALLE
     ========================================================== */

  openDetail(type, id) {

    let item = null;
    let title = "";
    let typeLabel = "";
    let status = "";


    const find = array =>
      (array || []).find(
        item =>
          String(item.id) ===
          String(id)
      );


    switch (type) {

      case "solar":

        item =
          find(this.state.solar);

        typeLabel =
          "PLANTA SOLAR";

        status =
          item?.mode === "maintenance"
            ? "maintenance"
            : item?.status;

        title =
          item?.name;

        break;


      case "ev":

        item =
          find(
            this.state.electrolineras
          );

        typeLabel =
          "ESTACIÓN DE CARGA";

        status =
          item?.mode === "maintenance"
            ? "maintenance"
            : item?.status;

        title =
          item?.name;

        break;


      case "bus":

        item =
          find(
            this.state.buses
          );

        typeLabel =
          "BUS HÍBRIDO";

        status =
          item?.mode === "maintenance"
            ? "maintenance"
            : item?.status;

        title =
          `${item?.plate || ""} ${item?.route || ""}`;

        break;


      case "lighting":

        item =
          find(
            this.state.lighting
          );

        typeLabel =
          "POSTE SOLAR";

        status =
          item?.mode === "maintenance"
            ? "maintenance"
            : item?.status;

        title =
          item?.id;

        break;


      case "battery":

        item =
          find(
            this.state.bateries
          );

        typeLabel =
          "BANCO DE BATERÍAS";

        status =
          item?.mode === "maintenance"
            ? "maintenance"
            : item?.status;

        title =
          item?.name;

        break;


      case "scooter":

        item =
          find(
            this.state.scooters
          );

        typeLabel =
          "SCOOTER";

        status =
          item?.mode === "maintenance"
            ? "maintenance"
            : item?.status;

        title =
          item?.id;

        break;


      case "bench":

        item =
          find(
            this.state.benches
          );

        typeLabel =
          "BANCA INTELIGENTE";

        status =
          item?.mode === "maintenance"
            ? "maintenance"
            : item?.status;

        title =
          item?.location;

        break;


      case "water":

        item =
          find(
            this.state.water_treatment
          );

        typeLabel =
          "PLANTA POTABILIZADORA";

        status =
          item?.mode === "maintenance"
            ? "maintenance"
            : item?.status;

        title =
          item?.name;

        break;


      case "port":

        item =
          find(
            this.state.port
          );

        typeLabel =
          "PUERTO";

        status =
          item?.status;

        title =
          item?.name;

        break;

    }


    if (!item) {

      console.warn(
        "Elemento no encontrado:",
        type,
        id
      );

      return;

    }


    const typeElement =
      document.getElementById(
        "dp-type"
      );

    const titleElement =
      document.getElementById(
        "dp-title"
      );

    const statusElement =
      document.getElementById(
        "dp-status"
      );

    const bodyElement =
      document.getElementById(
        "dp-body"
      );


    if (
      !typeElement ||
      !titleElement ||
      !statusElement ||
      !bodyElement
    ) {

      return;

    }


    typeElement.textContent =
      typeLabel ||
      "DISPOSITIVO";


    titleElement.textContent =
      title ||
      "Sin nombre";


    statusElement.textContent =
      status ||
      "unknown";


    statusElement.className =
      "dp-status " +
      (status || "unknown");


    bodyElement.innerHTML =
      this.renderDetailBody(
        type,
        item
      );


    document
      .getElementById(
        "detail-panel"
      )
      ?.classList.add("open");


    document
      .getElementById(
        "detail-overlay"
      )
      ?.classList.add("open");

  },


  /* ==========================================================
     CERRAR DETALLE
     ========================================================== */

  closeDetail() {

    document
      .getElementById(
        "detail-panel"
      )
      ?.classList.remove(
        "open"
      );


    document
      .getElementById(
        "detail-overlay"
      )
      ?.classList.remove(
        "open"
      );

  },


  /* ==========================================================
     CUERPO DEL PANEL
     ========================================================== */

  renderDetailBody(type, data) {

    let html = "";


    const maintenance =
      data.mode === "maintenance";


    /* --------------------------------------------------------
       MODO DE OPERACIÓN
       -------------------------------------------------------- */

    html += `

      <div class="dp-section">

        <div class="dp-section-title">
          Modo de Operación
        </div>

        <div class="dp-btn-group">

    `;


    const modes =
      type === "bus"
        ? [
            {
              key: "service",
              label: "Servicio"
            },
            {
              key: "charging",
              label: "Cargando"
            },
            {
              key: "maintenance",
              label: "Mantenimiento"
            }
          ]
        : [
            {
              key: "auto",
              label: "Automático"
            },
            {
              key: "maintenance",
              label: "Mantenimiento"
            }
          ];


    modes.forEach(mode => {

      html += `

        <button
          class="dp-btn ${
            data.mode === mode.key
              ? "active"
              : ""
          }"
          data-mode="${mode.key}"
          data-type="${type}"
          data-id="${data.id}"
        >
          ${mode.label}
        </button>

      `;

    });


    html += `

        </div>

      </div>

    `;


    /* --------------------------------------------------------
       AVISO MANTENIMIENTO
       -------------------------------------------------------- */

    if (maintenance) {

      html += `

        <div class="dp-maint-warning">

          ⚠ EN MANTENIMIENTO

          <br>

          Inicio:
          ${data.maint_start || "Desconocido"}

          <br>

          Técnico:
          ${data.maint_tech || "No asignado"}

        </div>

      `;

    }


    /* --------------------------------------------------------
       PARÁMETROS
       -------------------------------------------------------- */

    html += `

      <div class="dp-section">

        <div class="dp-section-title">

          ${
            maintenance
              ? "Últimos Datos"
              : "Parámetros en Vivo"
          }

        </div>

        <div class="dp-metrics">

    `;


    const metric =
      (label, value) => {

        html += `

          <div class="dp-metric">

            <span>
              ${label}
            </span>

            <strong>
              ${value}
            </strong>

          </div>

        `;

      };


    if (maintenance) {

      metric(
        "Estado previo",
        data.pre_maint_status || "N/A"
      );

      metric(
        "Potencia / Valor",
        data.pre_maint_value || "N/A"
      );

      metric(
        "Alertas",
        "DESACTIVADAS"
      );

      metric(
        "Última lectura",
        data.pre_maint_time || "N/A"
      );

    } else {


      /* ALUMBRADO */

      if (type === "lighting") {

        metric(
          "Estado",
          data.status === "on"
            ? "Encendido"
            : "Apagado"
        );

        metric(
          "Batería",
          `${data.battery_pct ?? 0}%`
        );

        metric(
          "Hoy encendido",
          `${data.on_today_h ?? 0} h`
        );

        metric(
          "Panel",
          `${data.panel_wp ?? 0} Wp`
        );

        metric(
          "Ubicación",
          data.location || "-"
        );

      }


      /* SOLAR */

      else if (type === "solar") {

        metric(
          "Potencia",
          `${Number(
            data.power_kw || 0
          ).toFixed(1)} kW`
        );

        metric(
          "PR",
          `${Number(
            data.pr_pct || 0
          ).toFixed(1)}%`
        );

        metric(
          "Diario",
          `${Number(
            data.daily_kwh || 0
          ).toFixed(1)} kWh`
        );

        metric(
          "Inversor",
          data.inverter?.model ||
          "N/A"
        );

        metric(
          "Strings",
          data.strings?.length ||
          0
        );

      }


      /* ELECTROLINERA */

      else if (type === "ev") {

        metric(
          "Potencia",
          `${Number(
            data.power_kw || 0
          ).toFixed(1)} kW`
        );

        metric(
          "Sesiones hoy",
          data.sessions_today ?? 0
        );

        metric(
          "kWh entregados",
          `${Number(
            data.kwh_delivered_today || 0
          ).toFixed(1)} kWh`
        );

        metric(
          "Uptime",
          `${data.uptime_pct ?? 0}%`
        );

      }


      /* BUS */

      else if (type === "bus") {

        metric(
          "Velocidad",
          `${data.speed_kmh ?? 0} km/h`
        );

        metric(
          "Batería",
          `${data.battery_pct ?? 0}%`
        );

        metric(
          "Pasajeros",
          `${data.passengers ?? 0}/${data.capacity ?? 0}`
        );

        metric(
          "Conductor",
          data.driver || "N/A"
        );

        metric(
          "Próxima parada",
          data.next_stop || "N/A"
        );

      }


      /* SCOOTER */

      else if (type === "scooter") {

        metric(
          "Estado",
          data.status || "N/A"
        );

        metric(
          "Batería",
          `${data.battery_pct ?? 0}%`
        );

        metric(
          "Autonomía",
          `${data.range_km ?? 0} km`
        );

        metric(
          "Viajes hoy",
          data.rides_today ?? 0
        );

      }


      /* AGUA */

      else if (type === "water") {

        metric(
          "Caudal",
          `${data.current_flow_l_s ?? 0} L/s`
        );

        metric(
          "pH salida",
          data.ph_out ?? "N/A"
        );

        metric(
          "Turbidez",
          `${data.turbidity_ntu_out ?? 0} NTU`
        );

        metric(
          "Cloro",
          `${data.chlorine_mg_l ?? 0} mg/L`
        );

        metric(
          "UV",
          `${data.uv_intensity_pct ?? 0}%`
        );

      }


      /* PUERTO */

      else if (type === "port") {

        metric(
          "Buques hoy",
          data.vessels_today ?? 0
        );

        metric(
          "Hierro / día",
          `${data.iron_ore_daily_tons ?? 0} ton`
        );

        metric(
          "Último zarpe",
          data.last_departure || "N/A"
        );

        metric(
          "Próxima llegada",
          data.next_arrival || "N/A"
        );

      }

    }


    html += `

        </div>

      </div>

    `;


    /* ========================================================
       HISTORIAL DE MANTENIMIENTO
       ======================================================== */

    if (
      data.maintenance_log &&
      data.maintenance_log.length
    ) {

      html += `

        <div class="dp-section">

          <div class="dp-section-title">
            Historial de Mantenimiento
          </div>

          <div class="dp-log">

      `;


      data.maintenance_log.forEach(log => {

        html += `

          <div class="dp-log-entry ${log.type}">

            <span class="dp-log-date">
              ${log.date}
            </span>

            <span class="dp-log-type ${log.type}">
              ${log.type}
            </span>

            <div class="dp-log-note">
              ${log.note}
            </div>

            <div class="dp-log-tech">
              Técnico:
              ${log.tech}
            </div>

          </div>

        `;

      });


      html += `

          </div>

        </div>

      `;

    }


    /* ========================================================
       FECHAS DE SERVICIO
       ======================================================== */

    if (data.install_date) {

      html += `

        <div class="dp-section">

          <div class="dp-section-title">
            Fechas de Servicio
          </div>

          <div class="dp-metrics">

            <div class="dp-metric">

              <span>
                Instalación
              </span>

              <strong>
                ${data.install_date}
              </strong>

            </div>

      `;


      if (data.last_service) {

        html += `

          <div class="dp-metric">

            <span>
              Último servicio
            </span>

            <strong>
              ${data.last_service}
            </strong>

          </div>

        `;

      }


      if (data.next_service) {

        html += `

          <div class="dp-metric">

            <span>
              Próximo servicio
            </span>

            <strong>
              ${data.next_service}
            </strong>

          </div>

        `;

      }


      html += `

          </div>

        </div>

      `;

    }


    /* ========================================================
       AGREGAR MANTENIMIENTO
       ======================================================== */

    html += `

      <div class="dp-section">

        <div class="dp-section-title">
          Agregar Registro
        </div>

        <div class="dp-form-row">

          <label>
            Tipo
          </label>

          <select id="new-maint-type">

            <option value="preventivo">
              Preventivo
            </option>

            <option value="correctivo">
              Correctivo
            </option>

          </select>

        </div>


        <div class="dp-form-row">

          <label>
            Nota
          </label>

          <textarea
            id="new-maint-note"
            placeholder="Qué se reparó, qué falló, qué cambió..."
          ></textarea>

        </div>


        <div class="dp-form-row">

          <label>
            Técnico
          </label>

          <input
            type="text"
            id="new-maint-tech"
            placeholder="Nombre del técnico"
          >

        </div>


        <button
          class="dp-save-btn"
          data-type="${type}"
          data-id="${data.id}"
        >
          Guardar Registro
        </button>

      </div>

    `;


    setTimeout(() => {

      this.bindDetailEvents(
        type,
        data.id
      );

    }, 50);


    return html;

  },


  /* ==========================================================
     EVENTOS PANEL DETALLE
     ========================================================== */

  bindDetailEvents(type, id) {

    document
      .querySelectorAll(
        ".dp-btn[data-mode]"
      )
      .forEach(button => {

        button.onclick = () => {

          document
            .querySelectorAll(
              ".dp-btn[data-mode]"
            )
            .forEach(btn => {

              btn.classList.remove(
                "active"
              );

            });


          button.classList.add(
            "active"
          );


          this.setDeviceMode(
            type,
            id,
            button.dataset.mode
          );

        };

      });


    const saveButton =
      document.querySelector(
        `.dp-save-btn[data-id="${id}"]`
      );


    if (saveButton) {

      saveButton.onclick = () => {

        this.addMaintenanceEntry(
          type,
          id
        );

      };

    }

  },


  /* ==========================================================
     CAMBIAR MODO DEL EQUIPO
     ========================================================== */

  setDeviceMode(type, id, mode) {

    const collections = {

      lighting:
        this.state.lighting,

      bus:
        this.state.buses,

      solar:
        this.state.solar,

      ev:
        this.state.electrolineras,

      battery:
        this.state.bateries,

      scooter:
        this.state.scooters,

      bench:
        this.state.benches,

      water:
        this.state.water_treatment,

      port:
        this.state.port

    };


    const item =
      (collections[type] || [])
        .find(
          x =>
            String(x.id) ===
            String(id)
        );


    if (!item) {

      return;

    }


    /* ENTRAR A MANTENIMIENTO */

    if (mode === "maintenance") {

      item.pre_maint_status =
        item.status;


      if (type === "lighting") {

        item.pre_maint_value =
          item.status === "on"
            ? "Encendido"
            : "Apagado";

      }

      else if (
        typeof item.power_kw ===
        "number"
      ) {

        item.pre_maint_value =
          `${item.power_kw.toFixed(1)} kW`;

      }

      else if (
        typeof item.speed_kmh ===
        "number"
      ) {

        item.pre_maint_value =
          `${item.speed_kmh} km/h`;

      }

      else {

        item.pre_maint_value =
          "N/A";

      }


      item.pre_maint_time =
        new Date()
          .toLocaleTimeString(
            "es-PE"
          );


      item.maint_start =
        new Date()
          .toLocaleDateString(
            "es-PE"
          );


      item.maint_tech =
        "Técnico en campo";


      if (type === "lighting") {

        item.status =
          "off";

      }


      if (type === "ev") {

        item.status =
          "offline";

      }


      if (type === "solar") {

        item.status =
          "offline";

      }

    }


    /* SALIR DE MANTENIMIENTO */

    else {

      item.status =
        item.pre_maint_status ||
        "online";

    }


    item.mode =
      mode;


    this.renderMap();

    this.refreshUI();

    this.openDetail(
      type,
      id
    );

  },


  /* ==========================================================
     AGREGAR MANTENIMIENTO
     ========================================================== */

  addMaintenanceEntry(type, id) {

    const note =
      document
        .getElementById(
          "new-maint-note"
        )
        ?.value
        .trim();


    const technician =
      document
        .getElementById(
          "new-maint-tech"
        )
        ?.value
        .trim() ||
      "Operaciones";


    const maintenanceType =
      document
        .getElementById(
          "new-maint-type"
        )
        ?.value ||
      "preventivo";


    if (!note) {

      alert(
        "Escribe una nota de mantenimiento."
      );

      return;

    }


    const collections = {

      lighting:
        this.state.lighting,

      bus:
        this.state.buses,

      solar:
        this.state.solar,

      ev:
        this.state.electrolineras,

      battery:
        this.state.bateries,

      scooter:
        this.state.scooters,

      bench:
        this.state.benches,

      water:
        this.state.water_treatment,

      port:
        this.state.port

    };


    const item =
      (collections[type] || [])
        .find(
          x =>
            String(x.id) ===
            String(id)
        );


    if (!item) {

      return;

    }


    if (!item.maintenance_log) {

      item.maintenance_log =
        [];

    }


    item.maintenance_log.unshift({

      date:
        new Date()
          .toISOString()
          .split("T")[0],

      type:
        maintenanceType,

      tech:
        technician,

      note:
        note

    });


    this.openDetail(
      type,
      id
    );


    this.refreshUI();

  },


  /* ==========================================================
     RESOLVER ALERTA
     ========================================================== */

  resolveAlert(id, button) {

    const row =
      document.querySelector(
        `.al[data-id="${id}"]`
      );


    if (!row) {

      return;

    }


    button.disabled =
      true;


    button.textContent =
      "Procesando...";


    setTimeout(() => {

      row.classList.add(
        "resolved"
      );


      const resolveButton =
        row.querySelector(
          ".al-res"
        );


      if (resolveButton) {

        resolveButton.textContent =
          "Resuelta";

        resolveButton.style.background =
          "rgba(34,197,94,0.25)";

        resolveButton.disabled =
          true;

      }


      const alert =
        (this.state.alerts || [])
          .find(
            x =>
              String(x.id) ===
              String(id)
          );


      if (alert) {

        alert.resolved =
          true;

      }


      const pending =
        document.getElementById(
          "al-pend"
        );


      if (pending) {

        pending.textContent =
          (this.state.alerts || [])
            .filter(
              x =>
                !x.resolved
            )
            .length;

      }

    }, 400);

  },


  /* ==========================================================
     RELOJ
     ========================================================== */

  startClock() {

    const updateClock = () => {

      const e =
        document.getElementById(
          "clock"
        );


      if (e) {

        const now =
          new Date();


        e.textContent =
          now.toLocaleTimeString(
            "es-PE",
            {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false
            }
          );

      }

    };


    updateClock();


    setInterval(
      updateClock,
      1000
    );

  },


  /* ==========================================================
     SIMULACIÓN DE TELEMETRÍA
     ========================================================== */

  simulate() {

    if (!this.state) {

      return;

    }


    this.count++;


    /* --------------------------------------------------------
       CLIMA
       -------------------------------------------------------- */

    if (this.state.weather) {

      this.state.weather.irradiance_wm2 =
        Math.max(
          100,
          Math.min(
            1100,
            this.state.weather.irradiance_wm2 +
            (Math.random() - 0.48) * 30
          )
        );


      this.state.weather.temp_ambient_c =
        Math.max(
          20,
          Math.min(
            38,
            this.state.weather.temp_ambient_c +
            (Math.random() - 0.5) * 0.2
          )
        );


      this.state.weather.temp_panel_c =
        this.state.weather.temp_ambient_c +
        10 +
        Math.random() * 5;

    }


    /* --------------------------------------------------------
       SOLAR
       -------------------------------------------------------- */

    (this.state.solar || [])
      .forEach(solar => {

        if (
          solar.mode ===
          "maintenance"
        ) {

          return;

        }


        solar.power_kw =
          Math.max(
            0,
            Math.min(
              solar.power_max_kw,
              solar.power_kw +
              (Math.random() - 0.42) * 1.8
            )
          );


        solar.efficiency =
          Math.max(
            85,
            Math.min(
              96,
              solar.efficiency +
              (Math.random() - 0.5) * 0.2
            )
          );


        solar.temp_c =
          this.state.weather.temp_panel_c +
          Math.random() * 3;


        solar.daily_kwh =
          Math.max(
            0,
            solar.daily_kwh +
            solar.power_kw * 0.0006
          );


        solar.pr_pct =
          Math.max(
            70,
            Math.min(
              90,
              solar.pr_pct +
              (Math.random() - 0.5) * 0.3
            )
          );


        (solar.strings || [])
          .forEach(string => {

            string.current_a =
              Math.max(
                0,
                Math.min(
                  10,
                  string.current_a +
                  (Math.random() - 0.5) * 0.2
                )
              );


            string.voltage_v =
              Math.max(
                300,
                Math.min(
                  400,
                  string.voltage_v +
                  (Math.random() - 0.5) * 2
                )
              );


            string.power_w =
              Math.round(
                string.current_a *
                string.voltage_v
              );

          });

      });


    /* --------------------------------------------------------
       BUSES
       -------------------------------------------------------- */

    (this.state.buses || [])
      .forEach(bus => {

        if (
          bus.mode !== "service"
        ) {

          return;

        }


        if (
          bus.status === "moving"
        ) {

          bus.lat +=
            (Math.random() - 0.5) *
            0.0003;


          bus.lng +=
            (Math.random() - 0.5) *
            0.0003;


          bus.speed_kmh =
            Math.max(
              10,
              Math.min(
                65,
                bus.speed_kmh +
                Math.round(
                  (Math.random() - 0.5) * 4
                )
              )
            );


          bus.battery_pct =
            Math.max(
              10,
              bus.battery_pct -
              Math.random() * 0.08
            );


          bus.passengers =
            Math.max(
              0,
              Math.min(
                bus.capacity,
                bus.passengers +
                Math.round(
                  (Math.random() - 0.5) * 2
                )
              )
            );

        }


        else if (
          bus.status === "stopped" &&
          Math.random() < 0.012
        ) {

          bus.status =
            "moving";

        }


        else if (
          bus.status === "moving" &&
          Math.random() < 0.006
        ) {

          bus.status =
            "stopped";

          bus.speed_kmh =
            0;

        }

      });


    /* --------------------------------------------------------
       ELECTROLINERAS
       -------------------------------------------------------- */

    (this.state.electrolineras || [])
      .forEach(ev => {

        if (
          ev.mode === "maintenance"
        ) {

          return;

        }


        if (
          ev.status === "charging"
        ) {

          ev.power_kw =
            Math.max(
              5,
              Math.min(
                ev.power_max_kw,
                ev.power_kw +
                (Math.random() - 0.5) * 2
              )
            );


          if (
            Math.random() < 0.02
          ) {

            ev.status =
              "available";

            ev.power_kw =
              0;

            ev.available_connectors =
              Math.min(
                ev.total_connectors,
                ev.available_connectors + 1
              );

          }

        }


        else if (
          ev.status === "available" &&
          Math.random() < 0.04
        ) {

          ev.status =
            "charging";

          ev.power_kw =
            7 +
            Math.random() * 15;

          ev.sessions_today++;

          ev.kwh_delivered_today +=
            Math.random() * 3;

          ev.available_connectors =
            Math.max(
              0,
              ev.available_connectors - 1
            );

        }

      });


    /* --------------------------------------------------------
       BATERÍAS
       -------------------------------------------------------- */

    (this.state.bateries || [])
      .forEach(battery => {

        if (
          battery.mode ===
          "maintenance"
        ) {

          return;

        }


        battery.soc =
          Math.max(
            10,
            Math.min(
              100,
              battery.soc +
              (Math.random() - 0.55) * 0.6
            )
          );


        battery.temp_c =
          Math.max(
            25,
            Math.min(
              40,
              battery.temp_c +
              (Math.random() - 0.5) * 0.1
            )
          );


        battery.charge_rate_kw =
          -battery.charge_rate_kw * 0.96 +
          (Math.random() - 0.5) * 2;


        battery.status =
          battery.charge_rate_kw > 0
            ? "charging"
            : "discharging";

      });


    /* --------------------------------------------------------
       ALUMBRADO
       -------------------------------------------------------- */

    (this.state.lighting || [])
      .forEach(light => {

        if (
          light.mode ===
          "maintenance"
        ) {

          return;

        }


        if (
          light.status === "on"
        ) {

          light.battery_pct =
            Math.max(
              5,
              light.battery_pct -
              Math.random() * 0.06
            );


          light.on_today_h =
            Math.min(
              12,
              light.on_today_h +
              0.002
            );


          if (
            light.battery_pct < 7
          ) {

            light.status =
              "off";

          }

        }


        else if (
          Math.random() < 0.005
        ) {

          light.battery_pct =
            Math.min(
              100,
              light.battery_pct + 3
            );


          if (
            light.battery_pct > 20
          ) {

            light.status =
              "on";

          }

        }

      });


    /* --------------------------------------------------------
       SCOOTERS
       -------------------------------------------------------- */

    (this.state.scooters || [])
      .forEach(scooter => {

        if (
          scooter.mode ===
          "maintenance"
        ) {

          return;

        }


        if (
          scooter.status ===
          "riding"
        ) {

          scooter.battery_pct =
            Math.max(
              5,
              scooter.battery_pct -
              Math.random() * 0.3
            );


          scooter.range_km =
            Math.max(
              0,
              scooter.range_km -
              Math.random() * 0.2
            );


          scooter.lat +=
            (Math.random() - 0.5) *
            0.0002;


          scooter.lng +=
            (Math.random() - 0.5) *
            0.0002;


          if (
            scooter.battery_pct < 10
          ) {

            scooter.status =
              "parked";

          }

        }


        else if (
          scooter.status === "available" &&
          Math.random() < 0.03
        ) {

          scooter.status =
            "riding";

          scooter.rides_today++;

        }

      });


    /* --------------------------------------------------------
       CO2
       -------------------------------------------------------- */

    if (this.state.kpis) {

      this.state.kpis.co2_saved_kg =
        Math.max(
          0,
          this.state.kpis.co2_saved_kg +
          (this.state.solar || [])
            .reduce(
              (total, solar) =>
                total +
                Number(
                  solar.power_kw || 0
                ),
              0
            ) *
          0.0004
        );

    }


    /* --------------------------------------------------------
       RED ELÉCTRICA
       -------------------------------------------------------- */

    if (this.state.grid) {

      this.state.grid.solar_generation_kw =
        (this.state.solar || [])
          .reduce(
            (total, solar) =>
              total +
              Number(
                solar.power_kw || 0
              ),
            0
          );


      this.state.grid.consumption_kw =
        this.state.grid.solar_generation_kw *
        0.7 +
        Math.random() * 10;

    }

  },


  /* ==========================================================
     ACTUALIZAR INTERFAZ
     ========================================================== */

  refreshUI() {

    if (!this.state) {

      return;

    }


    /* --------------------------------------------------------
       GENERACIÓN SOLAR
       -------------------------------------------------------- */

    const solarGeneration =
      (this.state.solar || [])
        .reduce(
          (total, s) =>
            total +
            (
              s.mode !== "maintenance"
                ? Number(
                    s.power_kw || 0
                  )
                : 0
            ),
          0
        );


    const solarEl =
      document.querySelector(
        '[data-k="solar"] strong'
      );


    if (solarEl) {

      solarEl.textContent =
        solarGeneration.toFixed(1) +
        " kW";

    }


    /* --------------------------------------------------------
       CONSUMO
       -------------------------------------------------------- */

    const consumption =
      solarGeneration * 0.7 +
      Math.random() * 10;


    if (!this.state.grid) {

      this.state.grid = {};

    }


    this.state.grid.consumption_kw =
      consumption;


    const consumptionEl =
      document.querySelector(
        '[data-k="consumo"] strong'
      );


    if (consumptionEl) {

      consumptionEl.textContent =
        consumption.toFixed(1) +
        " kW";

    }


    /* --------------------------------------------------------
       CO2 EVITADO
       -------------------------------------------------------- */

    if (!this.state.kpis) {

      this.state.kpis = {};

    }


    this.state.kpis.co2_saved_kg =
      Number(
        this.state.kpis.co2_saved_kg || 0
      ) +
      solarGeneration *
      0.0004;


    const co2El =
      document.querySelector(
        '[data-k="co2"] strong'
      );


    if (co2El) {

      co2El.textContent =
        Math.round(
          this.state.kpis.co2_saved_kg
        ) +
        " kg";

    }


    /* --------------------------------------------------------
       BUSES ACTIVOS
       -------------------------------------------------------- */

    const activeBusCount =
      (this.state.buses || [])
        .filter(
          b =>
            b.status === "moving" &&
            b.mode === "service"
        )
        .length;


    const activeBusesEl =
      document.getElementById(
        "buses-active"
      );


    if (activeBusesEl) {

      activeBusesEl.textContent =
        activeBusCount;

    }


    /* --------------------------------------------------------
       SESIONES ELECTROLINERAS
       -------------------------------------------------------- */

    const evSessionCount =
      (this.state.electrolineras || [])
        .filter(
          e =>
            e.mode !==
            "maintenance"
        )
        .reduce(
          (total, e) =>
            total +
            Number(
              e.sessions_today || 0
            ),
          0
        );


    const evSessionsEl =
      document.getElementById(
        "ev-sess"
      );


    if (evSessionsEl) {

      evSessionsEl.textContent =
        evSessionCount;

    }


    /* --------------------------------------------------------
       ILUMINACIÓN ACTIVA
       -------------------------------------------------------- */

    const lightingActive =
      (this.state.lighting || [])
        .filter(
          l =>
            l.status === "on" &&
            l.mode !==
            "maintenance"
        )
        .length;


    const lightingEl =
      document.getElementById(
        "lo-on"
      );


    if (lightingEl) {

      lightingEl.textContent =
        lightingActive;

    }


    /* --------------------------------------------------------
       ÚLTIMA ACTUALIZACIÓN
       -------------------------------------------------------- */

    const updateEl =
      document.getElementById(
        "last-update"
      );


    if (updateEl) {

      updateEl.textContent =
        new Date()
          .toLocaleTimeString(
            "es-PE",
            {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false
            }
          );

    }


    /* ========================================================
       METEOROLOGÍA
       ======================================================== */

    const irradiance =
      document.querySelector(
        ".irradiance"
      );


    if (
      irradiance &&
      this.state.weather
    ) {

      irradiance.textContent =
        `${Math.round(
          this.state.weather
            .irradiance_wm2
        )} W/m²`;

    }


    const mIrr =
      document.querySelector(
        ".m-irr"
      );


    if (
      mIrr &&
      this.state.weather
    ) {

      mIrr.textContent =
        `${Math.round(
          this.state.weather
            .irradiance_wm2
        )} W/m²`;

    }


    const mTemp =
      document.querySelector(
        ".m-tamb"
      );


    if (
      mTemp &&
      this.state.weather
    ) {

      mTemp.textContent =
        `${Number(
          this.state.weather
            .temp_ambient_c
        ).toFixed(1)} °C`;

    }


    /* ========================================================
       SOLARES
       ======================================================== */

    (this.state.solar || [])
      .forEach(solar => {

        const element =
          document.querySelector(
            `.mc[data-id="${solar.id}"]`
          );


        if (!element) {

          return;

        }


        const maintenance =
          solar.mode ===
          "maintenance";


        const power =
          element.querySelector(
            ".v-pwr"
          );


        const pr =
          element.querySelector(
            ".v-pr"
          );


        if (power) {

          power.textContent =
            maintenance
              ? "MANTENIMIENTO"
              : `${Number(
                  solar.power_kw
                ).toFixed(1)} kW`;

        }


        if (pr) {

          pr.textContent =
            maintenance
              ? "—"
              : `${Number(
                  solar.pr_pct
                ).toFixed(1)}%`;

        }

      });


    /* ========================================================
       BUSES
       ======================================================== */

    (this.state.buses || [])
      .forEach(bus => {

        const row =
          document.querySelector(
            `tr[data-bus="${bus.id}"]`
          );


        if (row) {

          const maintenance =
            bus.mode ===
            "maintenance";


          const speed =
            row.querySelector(
              ".v-sp"
            );


          const battery =
            row.querySelector(
              ".v-bat"
            );


          const passengers =
            row.querySelector(
              ".v-pax"
            );


          const next =
            row.querySelector(
              ".v-next"
            );


          const status =
            row.querySelector(
              ".v-st"
            );


          if (speed) {

            speed.textContent =
              maintenance
                ? "EN MANTENIMIENTO"
                : `${bus.speed_kmh} km/h`;

          }


          if (battery) {

            battery.textContent =
              `${Math.round(
                bus.battery_pct
              )}%`;

          }


          if (passengers) {

            passengers.textContent =
              maintenance
                ? "—"
                : `${bus.passengers}/${bus.capacity}`;

          }


          if (next) {

            next.textContent =
              maintenance
                ? "—"
                : bus.next_stop;

          }


          if (status) {

            status.textContent =
              maintenance
                ? "maintenance"
                : bus.status;

          }


          row.className =
            maintenance
              ? "b-maintenance"
              : `b-${bus.status}`;


          const batteryBar =
            row.querySelector(
              ".bf"
            );


          if (batteryBar) {

            batteryBar.style.width =
              `${bus.battery_pct}%`;


            batteryBar.className =
              "bf " +
              (
                bus.battery_pct > 50
                  ? "ok"
                  : bus.battery_pct > 20
                    ? "warn"
                    : "alert"
              );

          }

        }


        /* BUS EN MAPA */

        const marker =
          this.busMarkers[
            bus.id
          ];


        if (marker) {

          marker.setLatLng([
            bus.lat,
            bus.lng
          ]);


          const color =
            bus.mode ===
            "maintenance"
              ? "#f59e0b"
              : bus.status ===
                "moving"
                ? "#22c55e"
                : bus.status ===
                  "stopped"
                  ? "#f59e0b"
                  : "#64748b";


          marker.setIcon(
            this.icon(
              color,
              "🚌"
            )
          );

        }

      });


    /* ========================================================
       ELECTROLINERAS
       ======================================================== */

    (this.state.electrolineras || [])
      .forEach(ev => {

        const element =
          document.querySelector(
            `.mc[data-id="${ev.id}"]`
          );


        if (!element) {

          return;

        }


        const maintenance =
          ev.mode ===
          "maintenance";


        const power =
          element.querySelector(
            ".v-epwr"
          );


        const sessions =
          element.querySelector(
            ".v-esess"
          );


        const status =
          element.querySelector(
            ".v-ch"
          );


        if (power) {

          power.textContent =
            maintenance
              ? "MANTENIMIENTO"
              : `${Number(
                  ev.power_kw || 0
                ).toFixed(1)} kW`;

        }


        if (sessions) {

          sessions.textContent =
            maintenance
              ? "—"
              : `${ev.sessions_today} Ses`;

        }


        if (status) {

          status.textContent =
            maintenance
              ? "maintenance"
              : ev.status;


          status.className =
            "ch " +
            (
              maintenance
                ? "warn"
                : (
                    ev.status ===
                      "available" ||
                    ev.status ===
                      "online"
                  )
                  ? "ok"
                  : ev.status ===
                    "charging"
                    ? "warn"
                    : "alert"
            ) +
            " v-ch";

        }

      });


    /* ========================================================
       BATERÍAS
       ======================================================== */

    (this.state.bateries || [])
      .forEach(battery => {

        const element =
          document.querySelector(
            `.mc[data-id="${battery.id}"]`
          );


        if (!element) {

          return;

        }


        const maintenance =
          battery.mode ===
          "maintenance";


        const soc =
          element.querySelector(
            ".v-soc"
          );


        const temp =
          element.querySelector(
            ".v-temp"
          );


        const rate =
          element.querySelector(
            ".v-rate"
          );


        const bar =
          element.querySelector(
            ".bf"
          );


        if (soc) {

          soc.textContent =
            maintenance
              ? "MANTENIMIENTO"
              : `${Math.round(
                  battery.soc
                )}%`;


          soc.className =
            "ch " +
            (
              maintenance
                ? "warn"
                : battery.soc > 50
                  ? "ok"
                  : battery.soc > 20
                    ? "warn"
                    : "alert"
            ) +
            " v-soc";

        }


        if (temp) {

          temp.textContent =
            maintenance
              ? "—"
              : `${Number(
                  battery.temp_c
                ).toFixed(1)} °C`;

        }


        if (rate) {

          rate.textContent =
            maintenance
              ? "—"
              : `${Number(
                  battery.charge_rate_kw
                ).toFixed(1)} kW`;

        }


        if (bar) {

          bar.style.width =
            `${battery.soc}%`;


          bar.className =
            "bf " +
            (
              maintenance
                ? "warn"
                : battery.soc > 50
                  ? "ok"
                  : battery.soc > 20
                    ? "warn"
                    : "alert"
            );

        }

      });


    /* ========================================================
       ALUMBRADO
       ======================================================== */

    (this.state.lighting || [])
      .forEach(light => {

        const element =
          document.querySelector(
            `.ld[data-id="${light.id}"]`
          );


        if (!element) {

          return;

        }


        const maintenance =
          light.mode ===
          "maintenance";


        element.className =
          "ld " +
          (
            maintenance
              ? "maint"
              : light.status === "on"
                ? "on"
                : "off"
          );


        const battery =
          element.querySelector(
            ".ldb"
          );


        if (battery) {

          battery.textContent =
            maintenance
              ? "—"
              : `${Math.round(
                  light.battery_pct
                )}%`;

        }


        const mode =
          element.querySelector(
            ".ldm"
          );


        if (mode) {

          mode.textContent =
            maintenance
              ? "—"
              : `${Number(
                  light.on_today_h
                ).toFixed(1)}h`;

        }

      });


    /* ========================================================
       ALERTAS
       ======================================================== */

    const pendingAlerts =
      document.getElementById(
        "al-pend"
      );


    if (
      pendingAlerts &&
      this.state.alerts
    ) {

      pendingAlerts.textContent =
        this.state.alerts
          .filter(
            alert =>
              !alert.resolved
          )
          .length;

    }

  },


  /* ==========================================================
     ACTUALIZACIONES AUTOMÁTICAS
     ========================================================== */

  startUpdates() {

    this.refreshUI();


    setInterval(() => {

      this.simulate();

      this.refreshUI();

    }, 3000);

  }

};


/* ============================================================
   INICIAR APLICACIÓN
   ============================================================ */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    App.init();

  }
);