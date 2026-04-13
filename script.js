// Initialize map
var map = L.map('map').setView([22.8046, 86.2029], 13);

// Load map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Bus route (array of coordinates)
var route = [
  [22.8046, 86.2029],
  [22.8060, 86.2050],
  [22.8080, 86.2100],
  [22.8100, 86.2150],
  [22.8120, 86.2200]
];
// Draw route line
var polyline = L.polyline(route, { color: 'blue' }).addTo(map);

// Bus stops
var stops = [
  { name: "Stop 1", coords: [22.8046, 86.2029] },
  { name: "Stop 2", coords: [22.8060, 86.2050] },
  { name: "Stop 3", coords: [22.8080, 86.2100] },
  { name: "Stop 4", coords: [22.8100, 86.2150] },
  { name: "Stop 5", coords: [22.8120, 86.2200] }
];
let crowdLevel = "Not Set";

async function setCrowd(level, event) {
  crowdLevel = level;

  document.getElementById("crowdDisplay").innerText =
    "Current Crowd: " + level;

  document.querySelectorAll("#controls button").forEach(btn => {
    btn.style.background = "#ff9800";
  });

  event.target.style.background = "green";

  // 🔥 SEND DATA TO BACKEND
  try {
    await fetch("http://localhost:5000/update-crowd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ level })
    });

    console.log("Data sent to backend");

  } catch (err) {
    console.log("Error sending data:", err);
  }
}

// Add stop markers
stops.forEach(stop => {
  L.marker(stop.coords)
    .addTo(map)
    .bindPopup(stop.name);
});
// Create marker
var busMarker = L.marker(route[0]).addTo(map)
  .bindPopup("Bus is moving 🚍")
  .openPopup();

let index = 0;
function calculateETA(current, next) {
  let distance = map.distance(current, next); // meters
  let speed = 30; // assume 30 km/h

  let speed_mps = (speed * 1000) / 3600;

  let time = distance / speed_mps; // seconds

  return Math.round(time / 60); // minutes
}
let nextStopIndex = 1;
// Move bus every 2 seconds
setInterval(() => {
  index++;

  if (index >= route.length) {
    index = 0;
  }

  let current = route[index];
  let next = route[(index + 1) % route.length];

  busMarker.setLatLng(current);
  map.panTo(current);

  let eta = calculateETA(current, next);

  let color =
  crowdLevel === "High" ? "red" :
  crowdLevel === "Medium" ? "orange" : "green";

busMarker.bindPopup(
  "Next Stop: " + stops[(index + 1) % stops.length].name +
  "<br>ETA: " + eta + " mins" +
  `<br>Crowd: <span style="color:${color}">${crowdLevel}</span>`
).openPopup();

}, 2000);
