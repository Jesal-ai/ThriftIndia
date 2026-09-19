const storedUser = JSON.parse(localStorage.getItem('thriftIndiaUser') || 'null');
const showToast = (message) => { const toast = document.getElementById('toast'); if (!toast) return; toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2500); };
const saveUser = (user) => { localStorage.setItem('thriftIndiaUser', JSON.stringify(user)); window.location.href = 'profile.html'; };

function demoGoogleSignIn() { saveUser({ name: 'Google member', email: 'member@gmail.com', phone: 'Not provided', location: 'New Delhi' }); }
document.getElementById('googleLogin')?.addEventListener('click', demoGoogleSignIn);
document.getElementById('googleSignup')?.addEventListener('click', demoGoogleSignIn);

document.getElementById('signupForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const phone = document.getElementById('signupPhone').value.trim();
  if (!/^\d{10}$/.test(phone)) { document.getElementById('signupMessage').textContent = 'Please enter a valid 10-digit mobile number.'; return; }
  saveUser({ name: document.getElementById('signupName').value.trim(), email: document.getElementById('signupEmail').value.trim(), phone, location: 'New Delhi' });
});
document.getElementById('loginForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  if (!storedUser || storedUser.email.toLowerCase() !== email.toLowerCase()) { document.getElementById('loginMessage').textContent = 'No account found for this email. Please create one first.'; return; }
  window.location.href = 'profile.html';
});

if (document.body.classList.contains('profile-page')) {}
if (window.location.pathname.endsWith('profile.html')) {
  if (!storedUser) window.location.href = 'signup.html';
  else {
    document.getElementById('profileName').textContent = storedUser.name;
    document.getElementById('profileEmail').textContent = storedUser.email;
    document.getElementById('detailEmail').textContent = storedUser.email;
    document.getElementById('detailPhone').textContent = storedUser.phone;
    document.getElementById('profileLocation').textContent = storedUser.location || 'New Delhi';
    document.getElementById('avatar').textContent = storedUser.name.charAt(0).toUpperCase();
    const safeText = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
    const listingPanel = document.getElementById('listings');
    const listings = JSON.parse(localStorage.getItem('thriftIndiaListings') || '[]');
    if (listings.length) listingPanel.innerHTML = `<h2>My listings</h2><div class="orders">${listings.map((listing) => `<div class="order-row"><div><strong>${safeText(listing.title)}</strong><br /><span>${safeText(listing.category)} · ₹${safeText(listing.price)}</span></div><span class="order-status">LIVE</span></div>`).join('')}</div>`;
    document.querySelectorAll('a[href="index.html#sell"]').forEach((link) => { link.href = 'sell.html'; });
    document.querySelectorAll('.profile-nav button').forEach((button) => button.addEventListener('click', () => { document.querySelector('.profile-nav .active').classList.remove('active'); button.classList.add('active'); document.querySelector('.profile-panel.active').classList.remove('active'); document.getElementById(button.dataset.panel).classList.add('active'); }));
    document.getElementById('editLocation').addEventListener('click', () => { window.location.href = 'profile-location.html'; });
    document.getElementById('logoutButton').addEventListener('click', () => { localStorage.removeItem('thriftIndiaUser'); window.location.href = 'index.html'; });
  }
}
