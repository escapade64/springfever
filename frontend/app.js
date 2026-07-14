const form = document.getElementById("criteria-form");
const resultsEl = document.getElementById("results");
const statusEl = document.getElementById("status");

async function loadForecast() {
  const min_speed = document.getElementById("min_speed").value;
  const direction_center = document.getElementById("direction_center").value;
  const tolerance = document.getElementById("tolerance").value;

  const params = new URLSearchParams({
    spot: "default",
    activity: "windsurf",
    min_speed,
    direction_center,
    tolerance,
    days: 7,
  });

  statusEl.textContent = "Chargement...";
  resultsEl.innerHTML = "";

  try {
    const res = await fetch(`/api/forecast?${params}`);
    if (!res.ok) throw new Error(`Erreur API (${res.status})`);
    const data = await res.json();
    render(data.hours);
    statusEl.textContent = "";
  } catch (err) {
    statusEl.textContent = `Erreur : ${err.message}`;
  }
}

function render(hours) {
  const daylightHours = hours.filter((h) => h.daylight);
  const byDay = {};
  for (const h of daylightHours) {
    const day = h.time.slice(0, 10);
    (byDay[day] ??= []).push(h);
  }

  resultsEl.innerHTML = "";
  for (const [day, slots] of Object.entries(byDay)) {
    const dayEl = document.createElement("div");
    dayEl.className = "day";

    const title = document.createElement("h2");
    const goCount = slots.filter((s) => s.go).length;
    title.textContent = `${formatDay(day)} - ${goCount} creneau(x) favorable(s)`;
    dayEl.appendChild(title);

    const slotsEl = document.createElement("div");
    slotsEl.className = "slots";

    for (const s of slots) {
      const slotEl = document.createElement("div");
      slotEl.className = "slot" + (s.go ? " go" : "");
      const time = s.time.slice(11, 16);
      slotEl.innerHTML = `<span class="time">${time}</span>${Math.round(s.wind_speed)}kt ${Math.round(s.wind_direction)}deg`;
      slotsEl.appendChild(slotEl);
    }

    dayEl.appendChild(slotsEl);
    resultsEl.appendChild(dayEl);
  }
}

function formatDay(isoDay) {
  const d = new Date(`${isoDay}T00:00:00`);
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  loadForecast();
});

loadForecast();
