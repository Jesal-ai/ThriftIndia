const toast = document.getElementById('toast');
const activeUser = JSON.parse(localStorage.getItem('thriftIndiaUser') || 'null');
const profileLink = document.getElementById('profileLink');
if (profileLink && activeUser) {
  profileLink.href = 'profile.html';
  profileLink.textContent = activeUser.name.charAt(0).toUpperCase();
  profileLink.setAttribute('aria-label', 'Open your profile');
}
let toastTimer;
function showToast(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600); }

document.getElementById('searchForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const term = document.getElementById('searchInput').value.trim();
  if (!term) {
    showToast('Try searching for a brand, style, or piece.');
    return;
  }
  window.location.href = `browse.html?q=${encodeURIComponent(term)}`;
});

const locationButton = document.getElementById('locationButton');
const locationModal = document.getElementById('locationModal');
const locationSearch = document.getElementById('locationSearch');
const locationResults = document.getElementById('locationResults');
const locationNote = document.getElementById('locationNote');
let searchTimer;

function closeLocationPicker() {
  locationModal.classList.remove('open');
  locationModal.setAttribute('aria-hidden', 'true');
}
function selectLocation(name) {
  document.getElementById('locationLabel').textContent = name;
  closeLocationPicker();
  showToast(`Showing listings around ${name}`);
}
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]); }
function renderResults(results) {
  locationResults.innerHTML = results.map((result) => {
    const place = result.components.city || result.components.town || result.components.village || result.components.county || result.formatted;
    const state = result.components.state ? `, ${result.components.state}` : '';
    return `<button type="button" class="location-result" role="option" data-location="${escapeHtml(place)}"><span>⌖</span><div><strong>${escapeHtml(place)}</strong><small>${escapeHtml(result.formatted)}</small></div><b>${escapeHtml(state)}</b></button>`;
  }).join('');
  locationResults.querySelectorAll('.location-result').forEach((button) => button.addEventListener('click', () => selectLocation(button.dataset.location)));
}
async function searchOpenCage(query) {
  const key = window.OPENCAGE_API_KEY;
  if (!key) {
    locationResults.innerHTML = '';
    locationNote.textContent = 'Add your OpenCage key in config.js to search cities, areas and pincodes.';
    return;
  }
  locationNote.textContent = 'Searching locations…';
  try {
    const params = new URLSearchParams({ q: query, key, countrycode: 'in', limit: '5', no_annotations: '1', no_record: '1', language: 'en' });
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?${params}`);
    if (!response.ok) throw new Error('Unable to search locations');
    const data = await response.json();
    renderResults(data.results || []);
    locationNote.textContent = data.results?.length ? 'Select the area that suits you.' : 'No matching places found. Try a city, area or pincode.';
  } catch (error) {
    locationResults.innerHTML = '';
    locationNote.textContent = 'Location search is unavailable right now. Choose a popular city below.';
  }
}

locationButton.addEventListener('click', () => {
  locationModal.classList.add('open');
  locationModal.setAttribute('aria-hidden', 'false');
  locationSearch.focus();
});
document.getElementById('closeLocation').addEventListener('click', closeLocationPicker);
locationModal.addEventListener('click', (event) => { if (event.target === locationModal) closeLocationPicker(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLocationPicker(); });
locationSearch.addEventListener('input', () => {
  const query = locationSearch.value.trim();
  clearTimeout(searchTimer);
  locationResults.innerHTML = '';
  if (query.length < 3) { locationNote.textContent = 'Start typing to search locations across India.'; return; }
  searchTimer = setTimeout(() => searchOpenCage(query), 450);
});
document.querySelectorAll('#popularCities button').forEach((button) => button.addEventListener('click', () => selectLocation(button.textContent)));
document.getElementById('useLocation').addEventListener('click', () => {
  if (!navigator.geolocation) { showToast('Location services are unavailable in this browser.'); return; }
  locationNote.textContent = 'Finding your location…';
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => searchOpenCage(`${coords.latitude},${coords.longitude}`),
    () => { locationNote.textContent = 'Location permission was not granted. Search or choose a city instead.'; },
    { enableHighAccuracy: false, timeout: 10000 }
  );
});

document.querySelectorAll('.heart').forEach((button) => button.addEventListener('click', () => {
  button.classList.toggle('saved'); button.textContent = button.classList.contains('saved') ? '♥' : '♡';
  showToast(button.classList.contains('saved') ? 'Saved to your wishlist' : 'Removed from your wishlist');
}));

document.getElementById('next')?.addEventListener('click', () => { window.location.href = 'browse.html'; });
document.getElementById('previous')?.addEventListener('click', () => { window.location.href = 'browse.html'; });
