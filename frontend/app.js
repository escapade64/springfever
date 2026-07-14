const form = document.getElementById("criteria-form");
const resultsEl = document.getElementById("results");
const statusEl = document.getElementById("status");
const spotSelectorEl = document.getElementById("spot-selector");

let currentSpotId = SPOTS[0].id;

function fillCriteriaForm(criteria) {
  document.getElementById("min_speed").value = criteria.min_speed;
  document.getElementById("direction_center").value = criteria.direction_center;
  document.getElementById("tolerance").value = criteria.tolerance;
}

function renderSpotSelector() {
  spotSelectorEl.innerHTML = "";
  for (const spot of SPOTS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = spot.name;
    btn.className = "spot-btn" + (spot.id === currentSpotId ? " active" : "");
    btn.addEventListener("click", () => {
      currentSpotId = spot.id;
      fillCriteriaForm(spot.criteria);
      renderSpotSelector();
      loadForecast();
    });
    spotSelectorEl.appendChild(btn);
  }
}

async function loadForecast() {
  const criteria = {
    min_speed: Number(document.getElementById("min_speed").value),
    direction_center: Number(document.getElementById("direction_center").value),
    tolerance: Number(document.getElementById("tolerance").value),
  };

  const spot = getSpot(currentSpotId);

  statusEl.textContent = "Chargement...";
  resultsEl.innerHTML = "";

  try {
    const raw = await fetchForecast(spot.lat, spot.lon, 14);
    const hours = evaluateHours(raw, criteria);
    render(hours);
    statusEl.textContent = "";
  } catch (err) {
    statusEl.textContent = `Erreur : ${err.message}`;
  }
}

function render(hours) {
  const goHours = hours.filter((h) => h.go);
  const byDay = {};
  for (const h of goHours) {
    const day = h.time.slice(0, 10);
    (byDay[day] ??= []).push(h);
  }

  resultsEl.innerHTML = "";

  if (goHours.length === 0) {
    resultsEl.innerHTML = "<p>Aucun créneau favorable dans les prochains jours.</p>";
    return;
  }

  for (const [day, slots] of Object.entries(byDay)) {
    const dayEl = document.createElement("div");
    dayEl.className = "day";

    const title = document.createElement("h2");
    title.textContent = `${formatDay(day)} - ${slots.length} creneau(x) favorable(s)`;
    dayEl.appendChild(title);

    const slotsEl = document.createElement("div");
    slotsEl.className = "slots";

    for (const s of slots) {
      const slotEl = document.createElement("div");
      slotEl.className = "slot go";
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

renderSpotSelector();
fillCriteriaForm(getSpot(currentSpotId).criteria);
loadForecast();
