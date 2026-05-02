// ===================================================
//   Campus Bus Tracking System — script.js
//   Compatible with redesigned UI (index.html)
// ===================================================
 
// ── ROLE CHECK ──
let role = localStorage.getItem("role");
if (!role) window.location.href = "login.html";
 
// Show role badge
const roleBadge = document.getElementById("roleBadge");
if (roleBadge) roleBadge.textContent = role.charAt(0).toUpperCase() + role.slice(1);
 
// ── GLOBAL STATE ──
let route = [];
let stops = [];
let crowdLevel = "Not Set";
let busData = [];
let busMarker = null;
let intervalId = null;
let multiMarkers = [];
let multiIntervals = [];
let currentMode = "single"; // "single" | "all"
let currentBusIndex = 0;
 
// ── CUSTOM BUS ICON ──
var busIcon = L.divIcon({
  className: "",
  html: `<div class="custom-bus-icon">🚌</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20]
});
 
// ── STOP ICON ──
var stopIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:12px; height:12px;
    background:#ffffff;
    border:2px solid #3b82f6;
    border-radius:50%;
    box-shadow:0 0 6px rgba(59,130,246,0.5)">
  </div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});
 
// ── INIT MAP ──
var map = L.map('map', { zoomControl: true }).setView([22.8046, 86.2029], 14);
 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);
 
// ── CLEAR MAP ──
function clearMap() {
  map.eachLayer(layer => {
    if (layer instanceof L.Marker || layer instanceof L.Polyline) {
      map.removeLayer(layer);
    }
  });
  if (intervalId) clearInterval(intervalId);
  multiIntervals.forEach(i => clearInterval(i));
  multiIntervals = [];
  multiMarkers = [];
}
 
// ── LOAD BUS LIST (dropdown + sidebar cards) ──
async function loadBusList() {
  try {
    let res = await fetch("http://localhost:5000/get-bus");
    busData = await res.json();
 
    // Populate dropdown
    let select = document.getElementById("busSelect");
    select.innerHTML = '<option value="">— Choose a Bus —</option>';
 
    busData.forEach((bus, index) => {
      let opt = document.createElement("option");
      opt.value = index;
      opt.textContent = bus.busNo + " — " + bus.routeName;
      select.appendChild(opt);
    });
 
    select.addEventListener("change", function () {
      if (this.value === "") return;
      currentBusIndex = parseInt(this.value);
      loadSelectedBus(currentBusIndex);
      highlightBusCard(currentBusIndex);
    });
 
    // Populate sidebar bus cards
    renderBusCards();
 
    // Update stats
    let totalStops = busData.reduce((sum, b) => sum + b.stops.length, 0);
    document.getElementById("statBuses").textContent = busData.length;
    document.getElementById("statStops").textContent = totalStops;
 
    // Update bottom chip
    document.getElementById("routeChip").innerHTML =
      `<span class="chip-dot amber"></span>${busData.length} Routes Loaded`;
 
    // Update last sync
    document.getElementById("lastSync").textContent = new Date().toLocaleTimeString();
 
    // Auto-load first bus
    if (busData.length > 0) {
      loadSelectedBus(0);
      select.value = 0;
      highlightBusCard(0);
    }
 
    console.log("✅ Bus list loaded:", busData.length, "buses");
 
  } catch (err) {
    console.error("❌ Error loading bus list:", err);
    document.getElementById("busList").innerHTML =
      `<div class="bus-placeholder">⚠ Could not connect to server</div>`;
  }
}
 
// ── RENDER SIDEBAR BUS CARDS ──
function renderBusCards() {
  let list = document.getElementById("busList");
  list.innerHTML = "";
 
  busData.forEach((bus, index) => {
    let card = document.createElement("div");
    card.className = "bus-card";
    card.id = "busCard" + index;
    card.innerHTML = `
      <div class="bus-number-pill">${bus.busNo}</div>
      <div class="bus-info">
        <div class="bus-route-name">${bus.routeName}</div>
        <div class="bus-stops-count">${bus.stops.length} stops</div>
      </div>
      <div class="bus-indicator"></div>
    `;
    card.addEventListener("click", () => {
      currentBusIndex = index;
      document.getElementById("busSelect").value = index;
      loadSelectedBus(index);
      highlightBusCard(index);
    });
    list.appendChild(card);
  });
}
 
// ── HIGHLIGHT ACTIVE BUS CARD ──
function highlightBusCard(index) {
  document.querySelectorAll(".bus-card").forEach(c => c.classList.remove("active"));
  let card = document.getElementById("busCard" + index);
  if (card) card.classList.add("active");
}
 
// ── LOAD SINGLE BUS ──
function loadSelectedBus(index) {
  clearMap();
  currentMode = "single";
  updateModeButtons();
 
  let bus = busData[index];
  route = bus.stops.map(s => [s.lat, s.lng]);
  stops = bus.stops;
 
  // Update map title
  document.getElementById("mapTitle").textContent =
    `Tracking: ${bus.busNo} — ${bus.routeName}`;
 
  // Draw route line
  L.polyline(route, {
    color: bus.color || '#3b82f6',
    weight: 4,
    opacity: 0.85
  }).addTo(map);
 
  // Draw stops
  stops.forEach(stop => {
    L.marker([stop.lat, stop.lng], { icon: stopIcon })
      .addTo(map)
      .bindPopup(`<b style="color:#60a5fa">${stop.name}</b>`);
  });
 
  // Bus marker
  busMarker = L.marker(route[0], { icon: busIcon })
    .addTo(map)
    .bindPopup(buildPopup(bus, stops[1]?.name || "—", "—"))
    .openPopup();
 
  map.fitBounds(L.latLngBounds(route).pad(0.15));
 
  let posIndex = 0;
 
  intervalId = setInterval(() => {
    posIndex = (posIndex + 1) % route.length;
    let current = route[posIndex];
    let nextStop = stops[(posIndex + 1) % stops.length];
    let eta = calculateETA(current, route[(posIndex + 1) % route.length]);
 
    busMarker.setLatLng(current);
 
    // Update ETA stat
    document.getElementById("statETA").textContent = eta;
 
    // Update popup
    busMarker.setPopupContent(buildPopup(bus, nextStop.name, eta));
 
  }, 2000);
 
  console.log("✅ Tracking:", bus.busNo);
}
 
// ── BUILD POPUP HTML ──
function buildPopup(bus, nextStop, eta) {
  let crowdColor =
    crowdLevel === "High" ? "#f87171" :
    crowdLevel === "Medium" ? "#fbbf24" : "#4ade80";
 
  return `
    <div style="min-width:160px">
      <div style="font-size:14px; font-weight:600; color:#60a5fa; margin-bottom:8px">
        🚌 ${bus.busNo}
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:4px">
        <span style="color:#6b8db5">Route</span>
        <span>${bus.routeName}</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:4px">
        <span style="color:#6b8db5">Next Stop</span>
        <span>${nextStop}</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:4px">
        <span style="color:#6b8db5">ETA</span>
        <span style="font-family:'DM Mono',monospace">${eta} min</span>
      </div>
      <div style="display:flex; justify-content:space-between">
        <span style="color:#6b8db5">Crowd</span>
        <span style="color:${crowdColor}">${crowdLevel}</span>
      </div>
    </div>
  `;
}
 
// ── LOAD ALL BUSES ──
function loadAllBuses() {
  clearMap();
  currentMode = "all";
  updateModeButtons();
  document.getElementById("mapTitle").textContent = `Tracking All ${busData.length} Buses`;
 
  busData.forEach((bus, busIndex) => {
    let r = bus.stops.map(s => [s.lat, s.lng]);
 
    L.polyline(r, { color: bus.color || '#3b82f6', weight: 3, opacity: 0.7 }).addTo(map);
 
    let marker = L.marker(r[0], { icon: busIcon })
      .addTo(map)
      .bindPopup(`<b style="color:#60a5fa">${bus.busNo}</b><br>${bus.routeName}`);
 
    multiMarkers.push(marker);
 
    let i = 0;
    let iv = setInterval(() => {
      i = (i + 1) % r.length;
      marker.setLatLng(r[i]);
    }, 2000 + busIndex * 400);
 
    multiIntervals.push(iv);
  });
 
  // Fit all routes
  let allCoords = busData.flatMap(b => b.stops.map(s => [s.lat, s.lng]));
  if (allCoords.length > 0) {
    map.fitBounds(L.latLngBounds(allCoords).pad(0.1));
  }
 
  console.log("🔥 All buses running");
}
 
// ── SWITCH MODE BUTTONS ──
function switchMode(mode) {
  if (mode === "single") {
    if (busData.length > 0) loadSelectedBus(currentBusIndex);
  } else {
    loadAllBuses();
  }
}
 
function updateModeButtons() {
  document.getElementById("btnSingle").classList.toggle("active", currentMode === "single");
  document.getElementById("btnAll").classList.toggle("active", currentMode === "all");
}
 
// ── ETA CALCULATION ──
function calculateETA(current, next) {
  let distance = map.distance(current, next); // meters
  let speedKmh = 30;
  let speedMps = (speedKmh * 1000) / 3600;
  let timeSec = distance / speedMps;
  return Math.max(1, Math.round(timeSec / 60));
}
 
// ── CROWD LEVEL ──
async function setCrowd(level, event) {
  crowdLevel = level;
 
  // Update display
  document.getElementById("crowdDisplay").textContent = level;
  document.getElementById("statCrowd").textContent = level;
 
  // Update buttons
  document.querySelectorAll(".crowd-btn").forEach(btn => btn.classList.remove("selected"));
  event.target.classList.add("selected");
 
  // Send to backend
  try {
    await fetch("http://localhost:5000/update-crowd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level })
    });
    console.log("✅ Crowd updated:", level);
  } catch (err) {
    console.error("❌ Crowd update failed:", err);
  }
}
 
// ── LOGOUT ──
function logout() {
  localStorage.removeItem("role");
  window.location.href = "login.html";
}
 
// ── START ──
loadBusList();
