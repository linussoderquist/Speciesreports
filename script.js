// Starta Leaflet-karta
let map = L.map('map').setView([0, 0], 13);

// Lägg till OpenStreetMap-karta
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Hämta position från mobilen
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(hittaGBIF, errorPosition);
} else {
  alert("Din enhet stödjer inte geolocation!");
}

// Funktion om position hittas
function hittaGBIF(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  // Zooma in på positionen
  map.setView([lat, lon], 13);

  // Markör för nuvarande position
  L.marker([lat, lon]).addTo(map)
   .bindPopup('Du är här!')
   .openPopup();

  // GBIF API - hämta rapporter nära positionen
  const gbifUrl = `https://api.gbif.org/v1/occurrence/search?decimalLatitude=${lat}&decimalLongitude=${lon}&radius=1000&limit=100`;

  fetch(gbifUrl)
    .then(response => response.json())
    .then(data => visaGBIF(data))
    .catch(err => console.error(err));
}

// Visa GBIF-resultat på kartan
function visaGBIF(data) {
  data.results.forEach(obs => {
    if(obs.decimalLatitude && obs.decimalLongitude) {
      let popupContent = `
        <b>${obs.species || 'Okänd art'}</b><br>
        Datum: ${obs.eventDate || 'Ej angivet'}<br>
        Observatör: ${obs.recordedBy || 'Ej angivet'}
      `;

      L.circleMarker([obs.decimalLatitude, obs.decimalLongitude], {
        radius: 5,
        color: 'green',
        fillOpacity: 0.5
      })
      .addTo(map)
      .bindPopup(popupContent);
    }
  });
}

// Felhantering
function errorPosition(error) {
  alert("Kunde inte hämta din position: " + error.message);
}
