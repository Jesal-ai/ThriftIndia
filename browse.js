const CATALOG = [
  { id: '1', title: '501 high-rise straight jeans', brand: "Levi's", size: 'W28', category: "Women's clothing", condition: 'Like new', price: 1250, city: 'New Delhi', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=650&q=85' },
  { id: '2', title: 'Chocolate brown blazer', brand: 'H&M', size: 'S', category: "Women's clothing", condition: 'Excellent', price: 850, city: 'Gurugram', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=650&q=85' },
  { id: '3', title: 'Ivory shoulder bag', brand: 'Charles & Keith', size: '', category: 'Bags & accessories', condition: 'Good', price: 1400, city: 'New Delhi', image: 'https://images.unsplash.com/photo-1585488434455-09db5101bf51?auto=format&fit=crop&w=650&q=85' },
  { id: '4', title: 'Chuck 70 canvas sneakers', brand: 'Converse', size: 'UK 6', category: 'Shoes & sneakers', condition: 'Like new', price: 1800, city: 'Noida', image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=650&q=85' },
  { id: '5', title: 'Vintage linen shirt', brand: 'Uniqlo', size: 'M', category: "Men's clothing", condition: 'Excellent', price: 690, city: 'Bengaluru', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=650&q=85' },
  { id: '6', title: 'Coach tabby bag', brand: 'Coach', size: '', category: 'Bags & accessories', condition: 'Like new', price: 4200, city: 'Mumbai', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=650&q=85' },
  { id: '7', title: 'Checked flannel overshirt', brand: 'Zara', size: 'L', category: "Men's clothing", condition: 'Good', price: 750, city: 'Pune', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=650&q=85' },
  { id: '8', title: 'Pearl drop earrings', brand: 'Local atelier', size: '', category: 'Jewellery', condition: 'New with tags', price: 480, city: 'Kolkata', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=650&q=85' },
  { id: '9', title: 'Floral midi dress', brand: 'Sabyasachi Studio', size: 'S', category: "Women's clothing", condition: 'Excellent', price: 2200, city: 'Mumbai', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=650&q=85' },
  { id: '10', title: 'Air Force 1 sneakers', brand: 'Nike', size: 'UK 8', category: 'Shoes & sneakers', condition: 'Good', price: 2100, city: 'Hyderabad', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=650&q=85' },
  { id: '11', title: 'Cream cable-knit sweater', brand: 'Mango', size: 'M', category: "Women's clothing", condition: 'Like new', price: 980, city: 'New Delhi', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=650&q=85' },
  { id: '12', title: 'Vintage denim jacket', brand: "Levi's", size: 'M', category: "Men's clothing", condition: 'Fair', price: 1100, city: 'Bengaluru', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=650&q=85' },
  { id: '13', title: 'Gold-plated chain necklace', brand: 'Tribe Amrapali', size: '', category: 'Jewellery', condition: 'Excellent', price: 650, city: 'Jaipur', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=650&q=85' },
  { id: '14', title: 'Olive cargo trousers', brand: 'H&M', size: 'L', category: "Men's clothing", condition: 'Like new', price: 799, city: 'Gurugram', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=650&q=85' },
  { id: '15', title: 'Strappy block heels', brand: 'Aldo', size: 'UK 6', category: 'Shoes & sneakers', condition: 'Excellent', price: 1350, city: 'Pune', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=650&q=85' },
  { id: '16', title: 'Woven tote bag', brand: 'Fabindia', size: '', category: 'Bags & accessories', condition: 'Good', price: 560, city: 'Kolkata', image: 'https://images.unsplash.com/photo-1590874103328-eac38a941954?auto=format&fit=crop&w=650&q=85' }
];

const toast = document.getElementById('toast');
const grid = document.getElementById('browseGrid');
const countEl = document.getElementById('resultsCount');
const emptyEl = document.getElementById('emptyResults');
const activeFiltersEl = document.getElementById('activeFilters');
const filterPanel = document.getElementById('filterPanel');
const backdrop = document.getElementById('filterBackdrop');
const selectedSizes = new Set();
let toastTimer;

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
};
const checkedValues = (name) => [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((input) => input.value);

function userListings() {
  const listings = JSON.parse(localStorage.getItem('thriftIndiaListings') || '[]');
  return listings.map((listing, index) => ({
    id: `user-${index}`,
    title: listing.title || 'Untitled listing',
    brand: listing.brand || 'Independent seller',
    size: listing.size || '',
    category: listing.category || "Women's clothing",
    condition: listing.condition || 'Good',
    price: Number(listing.price) || 0,
    city: listing.city || 'New Delhi',
    image: listing.image || 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=650&q=85',
    createdAt: listing.createdAt
  }));
}

function currentFilters() {
  return {
    query: document.getElementById('browseSearch').value.trim().toLowerCase(),
    categories: checkedValues('category'),
    conditions: checkedValues('condition'),
    cities: checkedValues('city'),
    sizes: [...selectedSizes],
    minPrice: Number(document.getElementById('minPrice').value) || 0,
    maxPrice: Number(document.getElementById('maxPrice').value) || Infinity,
    sort: document.getElementById('sortSelect').value
  };
}

function applyFilters() {
  const filters = currentFilters();
  let items = [...userListings(), ...CATALOG];
  items = items.filter((item) => {
    const haystack = `${item.title} ${item.brand} ${item.category}`.toLowerCase();
    const matchesQuery = !filters.query || haystack.includes(filters.query);
    const matchesCategory = !filters.categories.length || filters.categories.includes(item.category);
    const matchesCondition = !filters.conditions.length || filters.conditions.includes(item.condition);
    const matchesCity = !filters.cities.length || filters.cities.includes(item.city);
    const matchesSize = !filters.sizes.length || filters.sizes.includes(item.size);
    const matchesPrice = item.price >= filters.minPrice && item.price <= filters.maxPrice;
    return matchesQuery && matchesCategory && matchesCondition && matchesCity && matchesSize && matchesPrice;
  });

  if (filters.sort === 'price-asc') items.sort((a, b) => a.price - b.price);
  else if (filters.sort === 'price-desc') items.sort((a, b) => b.price - a.price);
  else items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  renderActiveFilters(filters);
  renderGrid(items);
}

function renderActiveFilters(filters) {
  const chips = [];
  if (filters.query) chips.push({ key: 'query', label: `“${filters.query}”` });
  filters.categories.forEach((value) => chips.push({ key: 'category', value, label: value }));
  filters.conditions.forEach((value) => chips.push({ key: 'condition', value, label: value }));
  filters.cities.forEach((value) => chips.push({ key: 'city', value, label: value }));
  filters.sizes.forEach((value) => chips.push({ key: 'size', value, label: `Size ${value}` }));
  if (filters.minPrice) chips.push({ key: 'min', label: `From ₹${filters.minPrice}` });
  if (filters.maxPrice !== Infinity) chips.push({ key: 'max', label: `Up to ₹${filters.maxPrice}` });
  activeFiltersEl.innerHTML = chips.map((chip) => `<button type="button" data-key="${chip.key}" data-value="${escapeHtml(chip.value || '')}">${escapeHtml(chip.label)} ×</button>`).join('');
}

function renderGrid(items) {
  countEl.textContent = `${items.length} listing${items.length === 1 ? '' : 's'}`;
  emptyEl.hidden = items.length > 0;
  grid.hidden = items.length === 0;
  grid.innerHTML = items.map((item) => `
    <article class="product-card">
      <div class="product-image" style="background-image:url('${escapeHtml(item.image)}')">
        <button class="heart" type="button" aria-label="Save item">♡</button>
        <span class="condition">${escapeHtml(item.condition)}</span>
      </div>
      <div class="product-info">
        <p>${escapeHtml(item.brand)}${item.size ? ` · ${escapeHtml(item.size)}` : ''}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <div><strong>₹${item.price.toLocaleString('en-IN')}</strong><span>${escapeHtml(item.city)}</span></div>
      </div>
    </article>
  `).join('');
  grid.querySelectorAll('.heart').forEach((button) => button.addEventListener('click', (event) => {
    event.stopPropagation();
    button.classList.toggle('saved');
    button.textContent = button.classList.contains('saved') ? '♥' : '♡';
    showToast(button.classList.contains('saved') ? 'Saved to your wishlist' : 'Removed from your wishlist');
  }));
}

function clearFilters() {
  document.getElementById('browseSearch').value = '';
  document.getElementById('minPrice').value = '';
  document.getElementById('maxPrice').value = '';
  document.getElementById('sortSelect').value = 'newest';
  selectedSizes.clear();
  document.querySelectorAll('.chip-row button').forEach((button) => button.classList.remove('active'));
  document.querySelectorAll('.filter-group input[type="checkbox"]').forEach((input) => { input.checked = false; });
  applyFilters();
}

function setOpenFilters(open) {
  filterPanel.classList.toggle('open', open);
  backdrop.hidden = !open;
}

function readUrlFilters() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q') || '';
  const category = params.get('category') || '';
  const city = params.get('city') || '';
  document.getElementById('browseSearch').value = query;
  if (category) {
    const box = document.querySelector(`input[name="category"][value="${CSS.escape(category)}"]`);
    if (box) box.checked = true;
  }
  if (city) {
    const box = document.querySelector(`input[name="city"][value="${CSS.escape(city)}"]`);
    if (box) box.checked = true;
  }
}

const activeUser = JSON.parse(localStorage.getItem('thriftIndiaUser') || 'null');
const profileLink = document.getElementById('profileLink');
if (profileLink && activeUser) {
  profileLink.href = 'profile.html';
  profileLink.textContent = activeUser.name.charAt(0).toUpperCase();
  profileLink.setAttribute('aria-label', 'Open your profile');
}

readUrlFilters();
applyFilters();

document.getElementById('browseSearchForm').addEventListener('submit', (event) => {
  event.preventDefault();
  applyFilters();
});
document.querySelectorAll('.filter-group input').forEach((input) => input.addEventListener('input', applyFilters));
document.getElementById('sortSelect').addEventListener('change', applyFilters);
document.getElementById('clearFilters').addEventListener('click', clearFilters);
document.getElementById('resetEmpty').addEventListener('click', clearFilters);
document.getElementById('openFilters').addEventListener('click', () => setOpenFilters(true));
document.getElementById('closeFilters').addEventListener('click', () => setOpenFilters(false));
backdrop.addEventListener('click', () => setOpenFilters(false));
document.querySelectorAll('#sizeFilters button').forEach((button) => button.addEventListener('click', () => {
  const size = button.dataset.size;
  if (selectedSizes.has(size)) selectedSizes.delete(size);
  else selectedSizes.add(size);
  button.classList.toggle('active');
  applyFilters();
}));
activeFiltersEl.addEventListener('click', (event) => {
  const chip = event.target.closest('button');
  if (!chip) return;
  const { key, value } = chip.dataset;
  if (key === 'query') document.getElementById('browseSearch').value = '';
  if (key === 'min') document.getElementById('minPrice').value = '';
  if (key === 'max') document.getElementById('maxPrice').value = '';
  if (key === 'size') {
    selectedSizes.delete(value);
    document.querySelector(`#sizeFilters button[data-size="${CSS.escape(value)}"]`)?.classList.remove('active');
  }
  if (['category', 'condition', 'city'].includes(key)) {
    const box = document.querySelector(`input[name="${key}"][value="${CSS.escape(value)}"]`);
    if (box) box.checked = false;
  }
  applyFilters();
});
