const form = document.getElementById('sellForm');
const categoryInput = document.getElementById('category');
const photoInput = document.getElementById('photos');
const previewBox = document.getElementById('photoPreviews');
const shippingCostLabel = document.getElementById('shippingCostLabel');

// Preview selected photos
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

  try {
    // Upload all selected photos to Cloudinary
    const photoFiles = [...photoInput.files].slice(0, 6); // limit to 6
    const photoUrls = [];

    for (const file of photoFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "thrift_upload"); // your Cloudinary preset

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
      brand: document.getElementById('brand').value.trim(),
      condition: document.getElementById('condition').value,
      year: document.getElementById('year').value,
      details: document.getElementById('details').value.trim(),
      price: document.getElementById('price').value,
      negotiable: document.getElementById('negotiable').checked,
      shipping: document.querySelector('input[name="shipping"]:checked').value,
      shippingCost: document.getElementById('shippingCost').value || null,
      city: JSON.parse(localStorage.getItem('thriftIndiaUser') || 'null')?.location || 'New Delhi',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      images: photoUrls, // array of Cloudinary URLs
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
