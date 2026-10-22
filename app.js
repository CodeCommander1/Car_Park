const TOTAL_SLOTS = 12;
const initialVehicles = [
  { slot: 1, registration: "JH 09 AB 1234", type: "Car" },
  { slot: 2, registration: "JH 01 CD 5678", type: "Car" },
  { slot: 4, registration: "JH 09 EF 9012", type: "Car" },
  { slot: 5, registration: "JH 05 GH 3456", type: "Car" },
  { slot: 7, registration: "JH 09 JK 7890", type: "Car" },
  { slot: 8, registration: "JH 01 LM 2345", type: "Car" },
  { slot: 10, registration: "JH 09 NP 6789", type: "Car" },
  { slot: 12, registration: "JH 05 QR 0123", type: "Car" },
];

let vehicles = initialVehicles.map((vehicle) => ({ ...vehicle }));
let selectedSlot = null;
let exitVehicle = null;
let toastTimer;

const carIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 14 1.4-5h13.2l1.4 5v5h-2v-2H6v2H4zM6 14h12M7 9l1-3h8l1 3"/><path d="M7 14.5h.01M17 14.5h.01"/></svg>';
const numberIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 14 1.5-5h11l1.5 5v5h-2v-2H7v2H5zM7 14h10M8 9l1-3h6l1 3"/></svg>';

const slotStatus = (slotNumber) => vehicles.find((vehicle) => vehicle.slot === slotNumber);
const availableCount = () => TOTAL_SLOTS - vehicles.length;
const occupiedCount = () => vehicles.length;
const displaySlot = (slotNumber) => `Slot ${String(slotNumber).padStart(2, "0")}`;
const normalizeRegistration = (value) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");

function updateStats() {
  const occupied = occupiedCount();
  const available = availableCount();
  const rate = Math.round((occupied / TOTAL_SLOTS) * 100);

  document.querySelectorAll("#total-slots, #slots-total, #entry-total").forEach((node) => { node.textContent = TOTAL_SLOTS; });
  document.querySelectorAll("#occupied-slots, #slots-occupied, #legend-occupied, #donut-occupied, #entry-occupied").forEach((node) => { node.textContent = occupied; });
  document.querySelectorAll("#available-slots, #slots-available, #legend-available, #donut-available, #entry-available, #entry-free, #nav-available-count").forEach((node) => { node.textContent = available; });
  document.querySelector("#occupancy-rate").textContent = rate;
  document.querySelector("#donut-rate").textContent = `${rate}%`;
  document.querySelector("#occupancy-progress").style.width = `${rate}%`;
  const donut = document.querySelector("#occupancy-donut");
  donut.style.background = `conic-gradient(#4d74e9 0 ${rate}%, #e9eefc ${rate}% 100%)`;
  donut.setAttribute("aria-label", `${rate} percent of parking slots occupied`);
  document.querySelector("#capacity-note").textContent = available === 0
    ? "All parking spaces are currently occupied."
    : `${available} parking ${available === 1 ? "space is" : "spaces are"} ready for use.`;

  document.querySelector("#entry-availability-bar").style.width = `${Math.round((available / TOTAL_SLOTS) * 100)}%`;
  const nextAvailableSlot = Array.from({ length: TOTAL_SLOTS }, (_, index) => index + 1).find((number) => !slotStatus(number));
  document.querySelector("#next-slot-label").textContent = nextAvailableSlot ? displaySlot(nextAvailableSlot) : "No slots available";
  const nextStatus = document.querySelector(".next-status");
  nextStatus.textContent = nextAvailableSlot ? "READY" : "FULL";
  nextStatus.classList.toggle("full", !nextAvailableSlot);
  document.querySelector("#park-button").disabled = !nextAvailableSlot;
  document.querySelector("#parking-full-banner").hidden = available !== 0;
}

function makeSlotButton(slotNumber) {
  const vehicle = slotStatus(slotNumber);
  const button = document.createElement("button");
  button.type = "button";
  button.className = `slot${vehicle ? " occupied" : ""}${selectedSlot === slotNumber ? " selected" : ""}`;
  button.setAttribute("aria-label", vehicle
    ? `${displaySlot(slotNumber)}, occupied by ${vehicle.registration}`
    : `${displaySlot(slotNumber)}, available`);
  button.setAttribute("aria-pressed", String(selectedSlot === slotNumber));
  button.innerHTML = `<span class="slot-status-dot"></span><span class="slot-car">${carIcon}</span><span class="slot-number">${String(slotNumber).padStart(2, "0")}</span>`;
  button.addEventListener("click", () => {
    selectedSlot = slotNumber;
    renderSlots();
  });
  return button;
}

function renderSlotDetail(elementId, slotNumber) {
  const container = document.querySelector(elementId);
  const vehicle = slotStatus(slotNumber);
  if (!slotNumber) {
    container.className = "slot-detail";
    container.innerHTML = `<span class="detail-placeholder-icon">${numberIcon}</span><span class="detail-placeholder">Select a parking slot to see its details</span>`;
    return;
  }
  container.className = "slot-detail has-details";
  const vehicleDetails = vehicle
    ? `<strong>${vehicle.registration}</strong><span>Vehicle registration · ${vehicle.type}</span>`
    : `<strong>Ready for a vehicle</strong><span>This parking space is available</span>`;
  const status = vehicle ? "Occupied" : "Available";
  const action = vehicle ? `<button class="slot-detail-link" type="button" data-exit-registration="${vehicle.registration}">Check out</button>` : "";
  container.innerHTML = `<div class="slot-detail-main"><span class="detail-placeholder-icon">${numberIcon}</span><span class="slot-detail-copy"><strong>${displaySlot(slotNumber)}</strong>${vehicleDetails}</span></div><span class="slot-detail-status${vehicle ? " occupied" : ""}">${status.toUpperCase()}</span>${action}`;
  container.querySelector("[data-exit-registration]")?.addEventListener("click", () => {
    document.querySelector("#exit-registration-input").value = vehicle.registration;
    showPage("exit");
    findVehicle(vehicle.registration);
  });
}

function renderSlots() {
  const compactGrid = document.querySelector("#dashboard-slot-grid");
  const fullGrid = document.querySelector("#full-slot-grid");
  compactGrid.replaceChildren();
  fullGrid.replaceChildren();
  for (let number = 1; number <= TOTAL_SLOTS; number += 1) {
    compactGrid.append(makeSlotButton(number));
    fullGrid.append(makeSlotButton(number));
  }
  renderSlotDetail("#dashboard-slot-detail", selectedSlot);
  renderSlotDetail("#full-slot-detail", selectedSlot);
  updateStats();
}

function vehicleRow(vehicle, withAction = false) {
  const row = document.createElement("tr");
  row.innerHTML = `<td><span class="vehicle-cell"><span class="vehicle-avatar">${carIcon}</span><span class="vehicle-name"><strong>${vehicle.type}</strong><span>Parked vehicle</span></span></span></td><td class="registration-cell">${vehicle.registration}</td><td><span class="slot-chip">${displaySlot(vehicle.slot)}</span></td><td><span class="status-pill"><span></span>Parked</span></td>${withAction ? `<td><button class="row-action" type="button" data-exit-registration="${vehicle.registration}">Check out</button></td>` : ""}`;
  row.querySelector("[data-exit-registration]")?.addEventListener("click", () => {
    document.querySelector("#exit-registration-input").value = vehicle.registration;
    showPage("exit");
    findVehicle(vehicle.registration);
  });
  return row;
}

function renderRecords() {
  const recent = document.querySelector("#recent-records");
  const allRecords = document.querySelector("#all-records");
  recent.replaceChildren(...vehicles.slice(0, 4).map((vehicle) => vehicleRow(vehicle)));
  const query = normalizeRegistration(document.querySelector("#records-search").value);
  const matching = vehicles.filter((vehicle) =>
    normalizeRegistration(vehicle.registration).includes(query) || normalizeRegistration(displaySlot(vehicle.slot)).includes(query),
  );
  allRecords.replaceChildren(...matching.map((vehicle) => vehicleRow(vehicle, true)));
  document.querySelector("#records-empty").hidden = matching.length > 0;
  document.querySelector(".records-table-wrap").hidden = matching.length === 0;
  document.querySelector("#record-count").textContent = `${vehicles.length} ${vehicles.length === 1 ? "vehicle" : "vehicles"} parked`;
}

function render() {
  updateStats();
  renderSlots();
  renderRecords();
}

function showPage(page) {
  const safePage = document.querySelector(`#page-${page}`) ? page : "dashboard";
  document.querySelectorAll(".page-view").forEach((view) => view.classList.toggle("active", view.id === `page-${safePage}`));
  document.querySelectorAll(".nav-link").forEach((link) => {
    const active = link.dataset.page === safePage;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.querySelector("#breadcrumb-page").textContent = ({
    dashboard: "Dashboard",
    slots: "Parking slots",
    entry: "Vehicle entry",
    exit: "Vehicle exit",
    records: "Vehicle records",
  })[safePage];
  document.querySelector(".sidebar").classList.remove("mobile-open");
  if (window.location.hash !== `#${safePage}`) window.history.replaceState(null, "", `#${safePage}`);
  window.scrollTo(0, 0);
}

function showMessage(element, message, kind) {
  element.textContent = message;
  element.className = `form-message ${kind}`;
  element.hidden = false;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  document.querySelector("#toast-message").textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3400);
}

function findVehicle(registration) {
  const normalized = normalizeRegistration(registration);
  const vehicle = vehicles.find((item) => normalizeRegistration(item.registration) === normalized);
  const message = document.querySelector("#exit-message");
  const emptyState = document.querySelector("#exit-empty-state");
  const result = document.querySelector("#exit-result");

  if (!normalized) {
    showMessage(message, "Enter a registration number to search.", "error");
    exitVehicle = null;
    result.hidden = true;
    emptyState.hidden = false;
    return;
  }
  if (!vehicle) {
    showMessage(message, "No parked vehicle found with that registration number.", "error");
    exitVehicle = null;
    result.hidden = true;
    emptyState.hidden = false;
    return;
  }

  message.hidden = true;
  emptyState.hidden = true;
  result.hidden = false;
  exitVehicle = vehicle;
  result.innerHTML = `<div class="result-topline"><span>VEHICLE FOUND</span><span class="status-pill"><span></span>Parked</span></div><div class="result-details"><span class="result-car-icon">${carIcon}</span><span class="result-reg"><strong>${vehicle.registration}</strong><span>Vehicle registration</span></span></div><div class="result-slot-box"><span>Assigned parking slot</span><strong>${displaySlot(vehicle.slot)}</strong></div><button class="release-button" type="button">${numberIcon} Release parking slot</button>`;
  result.querySelector(".release-button").addEventListener("click", releaseVehicle);
}

function releaseVehicle() {
  if (!exitVehicle || !vehicles.includes(exitVehicle)) {
    showMessage(document.querySelector("#exit-message"), "Search for a currently parked vehicle before releasing a slot.", "error");
    return;
  }
  const releasedRegistration = exitVehicle.registration;
  const releasedSlot = exitVehicle.slot;
  vehicles = vehicles.filter((vehicle) => vehicle !== exitVehicle);
  if (selectedSlot === releasedSlot) selectedSlot = null;
  exitVehicle = null;
  document.querySelector("#exit-result").hidden = true;
  document.querySelector("#exit-empty-state").hidden = false;
  document.querySelector("#exit-registration-input").value = "";
  showMessage(document.querySelector("#exit-message"), `${releasedRegistration} checked out of ${displaySlot(releasedSlot)}. The slot is now available.`, "success");
  render();
  showToast(`${displaySlot(releasedSlot)} is now available.`);
}

function addVehicle(registration) {
  const normalized = normalizeRegistration(registration);
  const message = document.querySelector("#entry-message");
  if (!normalized) {
    showMessage(message, "Enter a vehicle registration number to continue.", "error");
    return;
  }
  if (!/^[A-Z]{2}\d{1,2}[A-Z]{1,3}\d{1,4}$/.test(normalized)) {
    showMessage(message, "That registration number doesn't look valid. Try a format like JH 09 AB 1234.", "error");
    return;
  }
  if (vehicles.some((vehicle) => normalizeRegistration(vehicle.registration) === normalized)) {
    showMessage(message, "This vehicle is already parked. Duplicate entries are not allowed.", "error");
    return;
  }
  const availableSlot = Array.from({ length: TOTAL_SLOTS }, (_, index) => index + 1).find((number) => !slotStatus(number));
  if (!availableSlot) {
    showMessage(message, "Parking is full. Release a slot before adding another vehicle.", "error");
    return;
  }
  const formattedRegistration = normalized.match(/^([A-Z]{2})(\d{1,2})([A-Z]{1,3})(\d{1,4})$/);
  const displayRegistration = formattedRegistration
    ? `${formattedRegistration[1]} ${formattedRegistration[2]} ${formattedRegistration[3]} ${formattedRegistration[4]}`
    : normalized;
  vehicles.unshift({ slot: availableSlot, registration: displayRegistration, type: "Car" });
  selectedSlot = availableSlot;
  document.querySelector("#registration-input").value = "";
  showMessage(message, `${displayRegistration} was assigned to ${displaySlot(availableSlot)}.`, "success");
  render();
  showToast(`Vehicle parked successfully in ${displaySlot(availableSlot)}.`);
}

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(link.dataset.page);
  });
});
document.querySelectorAll("[data-go]").forEach((button) => button.addEventListener("click", () => showPage(button.dataset.go)));
document.querySelector("#mobile-menu").addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("mobile-open"));
document.querySelector("#entry-form").addEventListener("submit", (event) => {
  event.preventDefault();
  addVehicle(document.querySelector("#registration-input").value);
});
document.querySelector("#exit-form").addEventListener("submit", (event) => {
  event.preventDefault();
  findVehicle(document.querySelector("#exit-registration-input").value);
});
document.querySelector("#records-search").addEventListener("input", renderRecords);
document.querySelector("#current-date").textContent = new Intl.DateTimeFormat("en", {
  weekday: "short",
  month: "short",
  day: "numeric",
}).format(new Date());
window.addEventListener("hashchange", () => showPage(window.location.hash.slice(1)));

render();
showPage(window.location.hash.slice(1) || "dashboard");
