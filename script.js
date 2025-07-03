const clocksContainer = document.getElementById('clocksContainer');
const citySelector = document.getElementById('citySelector');

let selectedZones = [
  { zone: 'America/Los_Angeles', label: 'Los Angeles' },
  { zone: 'Europe/Paris', label: 'Paris' },
];

function formatTime(date) {
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds} <span class="am-pm">${ampm}</span>`;
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function getCurrentLocationInfo() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const city = data.city;
    const timezone = data.timezone;
    return { zone: timezone, label: city };
  } catch (error) {
    console.error('Could not get location info', error);
    return null;
  }
}

function updateClocks() {
  clocksContainer.innerHTML = '';
  selectedZones.forEach((entry) => {
    const date = new Date(
      new Date().toLocaleString('en-US', { timeZone: entry.zone })
    );
    clocksContainer.innerHTML += `
          <div class="clock">
            <div class="city-name">${entry.label}</div>
            <div class="date">${formatDate(date)}</div>
            <div class="time">${formatTime(date)}</div>
          </div>`;
  });
}

setInterval(updateClocks, 1000);

citySelector.addEventListener('change', async function () {
  const selectedValue = this.value;

  if (selectedValue === 'current') {
    const currentLocation = await getCurrentLocationInfo();
    if (
      currentLocation &&
      !selectedZones.find((z) => z.zone === currentLocation.zone)
    ) {
      selectedZones.push(currentLocation);
    }
  } else if (selectedValue) {
    const label = selectedValue.split('/')[1].replace('_', ' ');
    if (!selectedZones.find((z) => z.zone === selectedValue)) {
      selectedZones.push({ zone: selectedValue, label });
    }
  }
});

updateClocks();
