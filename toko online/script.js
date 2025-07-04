// Hero slider logic
const slides = document.querySelectorAll("#hero-slider .slide");
const dots = document.querySelectorAll("#hero-slider .hero-dot");
const prevBtn = document.querySelector("#hero-slider .hero-prev");
const nextBtn = document.querySelector("#hero-slider .hero-next");
let currentSlide = 0;
let heroInterval;

function showSlide(idx) {
  slides.forEach((s, i) => {
    s.classList.toggle("active", i === idx);
    dots[i].classList.toggle("active", i === idx);
  });
  currentSlide = idx;
}
function nextSlide() {
  showSlide((currentSlide + 1) % slides.length);
}
function prevSlide() {
  showSlide((currentSlide - 1 + slides.length) % slides.length);
}
function startAutoSlide() {
  heroInterval = setInterval(nextSlide, 5000);
}
function stopAutoSlide() {
  clearInterval(heroInterval);
}
if (nextBtn && prevBtn && dots.length) {
  nextBtn.addEventListener("click", () => { stopAutoSlide(); nextSlide(); startAutoSlide(); });
  prevBtn.addEventListener("click", () => { stopAutoSlide(); prevSlide(); startAutoSlide(); });
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => { stopAutoSlide(); showSlide(i); startAutoSlide(); });
  });
  showSlide(0);
  startAutoSlide();
}

// KERANJANG LOGIC
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Tambah produk ke keranjang dari tombol "+ Keranjang"
document.addEventListener("DOMContentLoaded", function() {
  const btnsKeranjang = document.querySelectorAll('.btn-keranjang');
  btnsKeranjang.forEach(btn => {
    btn.addEventListener('click', function() {
      const produk = {
        id: btn.getAttribute('data-id') || btn.getAttribute('data-nama'), // fallback jika data-id tidak ada
        nama: btn.getAttribute('data-nama'),
        harga: parseInt(btn.getAttribute('data-harga')),
        gambar: btn.getAttribute('data-gambar'),
        qty: 1
      };
      // Cek jika produk sudah ada, tambah qty
      const idx = cart.findIndex(item => item.id === produk.id);
      if (idx > -1) {
        cart[idx].qty += 1;
      } else {
        cart.push(produk);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartBadge();
      alert('Produk ditambahkan ke keranjang!');
    });
  });
  updateCartBadge();
});
// ...existing code...
document.addEventListener('DOMContentLoaded', function() {
  // Event untuk klik pada card produk (kecuali tombol Beli dan + Keranjang)
  document.querySelectorAll('.product-card').forEach(function(card) {
    card.addEventListener('click', function(e) {
      // Cegah jika klik pada tombol Beli atau + Keranjang
      if (
        e.target.closest('.btn-keranjang') ||
        e.target.closest('.btn-outline-success')
      ) {
        return;
      }
      // Ambil data produk dari atribut data
      const produk = {
        id: card.getAttribute('data-id'),
        nama: card.getAttribute('data-nama'),
        harga: card.getAttribute('data-harga'),
        gambar: card.getAttribute('data-gambar'),
        deskripsi: card.getAttribute('data-deskripsi') || '',
      };
      // Simpan data ke sessionStorage
      sessionStorage.setItem('produk_dipilih', JSON.stringify(produk));
      // Redirect ke pembelian.html
      window.location.href = 'pembelian.html';
    });
  });
});


// Format harga ke Rupiah
function formatRupiah(angka) {
  return 'Rp' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Render keranjang (untuk keranjang.html)
function renderCart() {
  const cartItems = document.getElementById('cart-items');
  const emptyAlert = document.getElementById('empty-cart-alert');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  if (!cartItems) return; // Biar tidak error di index.html
  cartItems.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    emptyAlert.classList.remove('d-none');
    cartTotal.textContent = 'Rp0';
    checkoutBtn.disabled = true;
    return;
  } else {
    emptyAlert.classList.add('d-none');
    checkoutBtn.disabled = false;
  }

  cart.forEach((item, idx) => {
    total += item.harga * item.qty;
    cartItems.innerHTML += `
      <div class="card mb-3 shadow-sm">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <img src="${item.gambar}" alt="Produk" class="rounded me-3" style="width:80px; height:80px; object-fit:cover;">
            <div class="flex-grow-1">
              <div class="fw-semibold" style="font-size:1.1em;">${item.nama}</div>
              <div class="d-flex align-items-center">
                <button class="btn btn-outline-secondary btn-sm me-2" style="width:32px;" onclick="updateQty(${idx}, -1)">-</button>
                <span class="mx-2">${item.qty}</span>
                <button class="btn btn-outline-secondary btn-sm ms-2" style="width:32px;" onclick="updateQty(${idx}, 1)">+</button>
              </div>
            </div>
            <div class="text-end ms-3">
              <div class="fw-bold text-danger mb-2">${formatRupiah(item.harga * item.qty)}</div>
              <button class="btn btn-link text-danger p-0" onclick="removeItem(${idx})"><i class="bi bi-trash"></i></button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  cartTotal.textContent = formatRupiah(total);
}

// Update jumlah produk
function updateQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty < 1) cart[idx].qty = 1;
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  updateCartBadge();
}

// Hapus produk dari keranjang
function removeItem(idx) {
  cart.splice(idx, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  updateCartBadge();
}

// Update badge jumlah keranjang di navbar
function updateCartBadge() {
  const badges = document.querySelectorAll('.badge.rounded-pill');
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  badges.forEach(badge => badge.textContent = totalQty);
}

// Inisialisasi saat halaman dimuat (untuk keranjang.html)
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartBadge();
});

const produkList = [
  {
    id: "produk1",
    nama: "Nastar Keju Premium",
    harga: 10857,
    gambar: "https://i.pinimg.com/736x/12/30/90/123090f46906e40ca08f47516c148e98.jpg",
    deskripsi: "Kue ini terbuat dari 100% alami tanpa bahan pengawet, sangat lezat dan cocok untuk segala usia.",
    diskon: "-10%"
  },
  {
    id: "produk2",
    nama: "Choco Lava Cake",
    harga: 10520,
    gambar: "https://images.unsplash.com/photo-1606788075762-8e3728bd50bd",
    deskripsi: "Kue coklat lumer di dalam, favorit anak-anak.",
    diskon: "-10%"
  },
  // Tambahkan produk lain di sini...
];

// Fungsi untuk generate HTML produk
function tampilkanProduk() {
  const row = document.getElementById('produk-row');
  row.innerHTML = '';
  produkList.forEach(p => {
    row.innerHTML += `
      <div class="col-6 col-md-4 col-lg-3 col-xl-2">
        <div class="card product-card h-100 border-0 shadow-sm"
          style="border-radius: 12px;"
          data-id="${p.id}"
          data-nama="${p.nama}"
          data-harga="${p.harga}"
          data-gambar="${p.gambar}"
          data-deskripsi="${p.deskripsi}">
          <div class="position-relative">
            <img src="${p.gambar}" class="card-img-top" alt="Produk" style="height: 180px; object-fit: cover; width: 100%; border-radius: 12px 12px 0 0;" />
            <span class="badge bg-danger position-absolute top-0 end-0 m-2" style="font-size: 0.8rem;">${p.diskon || ''}</span>
          </div>
          <div class="card-body p-2">
            <span class="badge bg-warning text-dark mb-1" style="font-size: 0.75rem;">Star</span>
            <h6 class="card-title mb-1" style="font-weight: 500; font-size: 0.95rem; min-height: 2.2em;">${p.nama}</h6>
            <div class="mb-1">
              <span class="badge bg-light text-dark border" style="font-size: 0.7rem;">Garansi</span>
              <span class="badge bg-danger" style="font-size: 0.7rem;">COD</span>
            </div>
            <p class="text-danger fw-bold mb-2" style="font-size: 1.1rem;">Rp${Number(p.harga).toLocaleString()}</p>
            <div class="d-flex justify-content-between gap-1 mt-2">
              <a href="pembelian.html" class="btn btn-outline-success btn-sm flex-fill py-1 px-2">Beli</a>
              <button class="btn btn-outline-success btn-sm flex-fill py-1 px-2 btn-keranjang"
                data-nama="${p.nama}" data-harga="${p.harga}" data-gambar="${p.gambar}" data-deskripsi="${p.deskripsi}" data-id="${p.id}">+ Keranjang</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

// Panggil fungsi setelah DOM siap
document.addEventListener('DOMContentLoaded', tampilkanProduk);
// filepath: [produk.html](http://_vscodecontentref_/2) atau [script.js](http://_vscodecontentref_/3)
document.addEventListener('click', function(e) {
  // Tombol Beli
  if (e.target.matches('.product-card .btn-outline-success') && e.target.textContent.trim() === 'Beli') {
    const card = e.target.closest('.product-card');
    const produk = {
      id: card.getAttribute('data-id'),
      nama: card.getAttribute('data-nama'),
      harga: card.getAttribute('data-harga'),
      gambar: card.getAttribute('data-gambar'),
      deskripsi: card.getAttribute('data-deskripsi')
    };
    sessionStorage.setItem('produk_dipilih', JSON.stringify(produk));
    // Redirect ke halaman pembelian
    window.location.href = 'pembelian.html';
  }

  // Tombol + Keranjang
  if (e.target.matches('.btn-keranjang')) {
    const card = e.target.closest('.product-card');
    const produk = {
      id: card.getAttribute('data-id'),
      nama: card.getAttribute('data-nama'),
      harga: card.getAttribute('data-harga'),
      gambar: card.getAttribute('data-gambar'),
      deskripsi: card.getAttribute('data-deskripsi')
    };
    // Ambil keranjang lama
    let keranjang = JSON.parse(localStorage.getItem('keranjang') || '[]');
    keranjang.push(produk);
    localStorage.setItem('keranjang', JSON.stringify(keranjang));
    alert('Produk ditambahkan ke keranjang!');
  }
});