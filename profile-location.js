const locationStyles = document.createElement('link');
locationStyles.rel = 'stylesheet';
locationStyles.href = 'location-picker.css';
document.head.append(locationStyles);
const user = JSON.parse(localStorage.getItem('thriftIndiaUser') || 'null');
if (!user) window.location.href = 'signup.html';

const input = document.getElementById('locationSearch');
const note = document.getElementById('locationNote');
const resultsBox = document.getElementById('locationResults');
let timer;
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
function chooseLocation(location) { user.location = location; localStorage.setItem('thriftIndiaUser', JSON.stringify(user)); window.location.href = 'profile.html'; }
function showResults(results) {
  resultsBox.innerHTML = results.map((result) => {
    const place = result.components.city || result.components.town || result.components.village || result.components.county || result.formatted;
    return `<button class="location-result" type="button" role="option" data-location="${escapeHtml(place)}"><span>⌖</span><div><strong>${escapeHtml(place)}</strong><small>${escapeHtml(result.formatted)}</small></div></button>`;
  }).join('');
  resultsBox.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => chooseLocation(button.dataset.location)));
}
async function geocode(query) {
  if (!window.OPENCAGE_API_KEY) { note.textContent = 'Add your OpenCage API key in config.js to search locations.'; return; }
  note.textContent = 'Searching locations…';
  try {
    const parameters = new URLSearchParams({ q: query, key: window.OPENCAGE_API_KEY, countrycode: 'in', limit: '5', no_annotations: '1', no_record: '1', language: 'en' });
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?${parameters}`);
    if (!response.ok) throw new Error();
    const data = await response.json();
    showResults(data.results || []);
    note.textContent = data.results?.length ? 'Select the area that suits you.' : 'No locations found. Try another search.';
  } catch { note.textContent = 'Location search is unavailable. Choose a popular city instead.'; }
}
input.addEventListener('input', () => { clearTimeout(timer); resultsBox.innerHTML = ''; const query = input.value.trim(); if (query.length < 3) { note.textContent = 'Start typing to search locations across India.'; return; } timer = setTimeout(() => geocode(query), 450); });
document.querySelectorAll('#popularCities button').forEach((button) => button.addEventListener('click', () => chooseLocation(button.textContent)));
document.getElementById('useLocation').addEventListener('click', () => { if (!navigator.geolocation) { note.textContent = 'Location services are unavailable in this browser.'; return; } note.textContent = 'Finding your location…'; navigator.geolocation.getCurrentPosition(({ coords }) => geocode(`${coords.latitude},${coords.longitude}`), () => { note.textContent = 'Location permission was not granted. Search or choose a city instead.'; }, { enableHighAccuracy: false, timeout: 10000 }); });
