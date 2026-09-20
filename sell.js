document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('sellForm');
  const categoryInput = document.getElementById('category');
  const photoInput = document.getElementById('photos');
  const previewBox = document.getElementById('photoPreviews');
  const shippingCostLabel = document.getElementById('shippingCostLabel');

  // Auto-fill year dropdown safely
  const yearSelect = document.getElementById('year');
  if (yearSelect) {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1980; year--) {
      yearSelect.insertAdjacentHTML('beforeend', `<option>${year}</option>`);
    }
  }

  // Category selection
  document.querySelectorAll('#categoryOptions button').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('#categoryOptions button').forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
      categoryInput.value = button.dataset.category;
    });
  });

  // Photo previews
  photoInput.addEventListener('change', () => {
    previewBox.innerHTML = '';
    [...photoInput.files].slice(0, 6).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        previewBox.insertAdjacentHTML('beforeend',
          `<div class="preview"><img src="${reader.result}" alt="Selected item preview" /></div>`);
      };
      reader.readAsDataURL(file);
    });
  });

  // Shipping toggle
  document.querySelectorAll('input[name="shipping"]').forEach((input) => {
    input.addEventListener('change', () => {
      const ships = document.querySelector('input[name="shipping"]:checked').value === 'Ship to buyer';
      shippingCostLabel.classList.toggle('show', ships);
      document.getElementById('shippingCost').required = ships;
    });
  });

  // Submit handler with Cloudinary + Firestore
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const error = document.getElementById('formError');

    if (!categoryInput.value) {
      error.textContent = 'Choose the kind of item you are listing.';
      return;
    }
    if (!photoInput.files.length) {
      error.textContent = 'Add at least one clear photo of your item.';
      return;
    }
    if (!document.getElementById('policy').checked) {
      error.textContent = 'Please confirm that your item follows the selling rules.';
      return;
    }
    if (!auth.currentUser) {
      error.textContent = 'You must be logged in to add a product.';
      return;
    }

    try {
      // Upload all selected photos to Cloudinary
      const photoFiles = [...photoInput.files].slice(0, 6);
      const photoUrls = [];

      for (const file of photoFiles) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "thrift_upload"); // must match Cloudinary preset exactly

        const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        photoUrls.push(data.secure_url);
      }

      // Build listing object
      const listing = {
        category: categoryInput.value,
        title: document.getElementById('title').value.trim(),
        brand: document
