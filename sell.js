const form = document.getElementById('sellForm');
const categoryInput = document.getElementById('category');
const photoInput = document.getElementById('photos');
const previewBox = document.getElementById('photoPreviews');
const shippingCostLabel = document.getElementById('shippingCostLabel');

// Preview logic stays the same
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

// Submit handler
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

  // Upload first photo to Cloudinary
  const file = photoInput.files[0];
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "thrift_upload"); // your Cloudinary preset

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/s29vhzjw/image/upload", {
      method: "POST",
      body: formData
    });
    const data = await res.json();

    // Build listing object
    const listing = {
      category: categoryInput.value,
      title: document.getElementById('title').value.trim(),
      brand: document.getElementById('brand').value.trim(),
      condition: document.getElementById('condition').value,
      price: document.getElementById('price').value,
      city: JSON.parse(localStorage.getItem('thriftIndiaUser') || 'null')?.location || 'New Delhi',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      image: data.secure_url, // Cloudinary URL
      user: auth.currentUser.uid
    };

    // Save to Firestore
    await db.collection("listings").add(listing);

    document.getElementById('successModal').classList.add('open');
    document.getElementById('successModal').setAttribute('aria-hidden', 'false');
  } catch (err) {
    error.textContent = "Upload failed: " + err.message;
  }
});
