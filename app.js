/* ==========================================================================
   GAMEZONE STORE - FUTURISTIC GAME TOP UP CORE JAVASCRIPT
   ========================================================================== */

// 1. GAME DATABASE (INITIALIZED FROM LOCALSTORAGE IF AVAILABLE)
const DEFAULT_GAMES_DATA = [
  {
    id: "mlbb",
    name: "Mobile Legends: Bang Bang",
    publisher: "Moonton",
    badge: "POPULER",
    image: "images/mlbb_banner.jpg",
    description: "Mobile Legends: Bang Bang adalah game arena pertempuran daring multipemain (MOBA) seluler yang dikembangkan oleh Moonton. Pilih hero favoritmu dan bertarunglah bersama tim menuju kemenangan!",
    hasServer: true,
    serverPlaceholder: "Zona ID (e.g. 2004)",
    packages: [
      { id: "ml_86", name: "86 Diamonds", price: 20000, formattedPrice: "Rp 20.000" },
      { id: "ml_172", name: "172 Diamonds", price: 40000, formattedPrice: "Rp 40.000" },
      { id: "ml_257", name: "257 Diamonds", price: 60000, formattedPrice: "Rp 60.000" },
      { id: "ml_706", name: "706 Diamonds", price: 160000, formattedPrice: "Rp 160.000" },
      { id: "ml_1412", name: "1412 Diamonds", price: 320000, formattedPrice: "Rp 320.000" },
      { id: "ml_2195", name: "2195 Diamonds", price: 490000, formattedPrice: "Rp 490.000" }
    ]
  },
  {
    id: "ff",
    name: "Free Fire",
    publisher: "Garena",
    badge: "PROMO",
    image: "images/ff_banner.jpg",
    description: "Free Fire adalah game survival shooter berdurasi 10 menit yang menempatkanmu di pulau terpencil bertarung melawan 49 pemain lain demi menjadi yang terakhir bertahan hidup.",
    hasServer: false,
    packages: [
      { id: "ff_50", name: "50 Diamonds", price: 8000, formattedPrice: "Rp 8.000" },
      { id: "ff_140", name: "140 Diamonds", price: 20000, formattedPrice: "Rp 20.000" },
      { id: "ff_355", name: "355 Diamonds", price: 50000, formattedPrice: "Rp 50.000" },
      { id: "ff_720", name: "720 Diamonds", price: 100000, formattedPrice: "Rp 100.000" },
      { id: "ff_1440", name: "1440 Diamonds", price: 200000, formattedPrice: "Rp 200.000" },
      { id: "ff_7290", name: "7290 Diamonds", price: 1000000, formattedPrice: "Rp 1.000.000" }
    ]
  },
  {
    id: "pubg",
    name: "PUBG Mobile",
    publisher: "Tencent Games",
    badge: "BESTSELLER",
    image: "images/pubg_banner.jpg",
    description: "PUBG Mobile adalah game battle royale seluler teratas. Kuasai medan tempur, looting senjata terbaik, bertahan di zona aman, dan dapatkan Chicken Dinner bersama squad-mu!",
    hasServer: false,
    packages: [
      { id: "pubg_60", name: "60 Unknown Cash (UC)", price: 15000, formattedPrice: "Rp 15.000" },
      { id: "pubg_325", name: "325 Unknown Cash (UC)", price: 75000, formattedPrice: "Rp 75.000" },
      { id: "pubg_660", name: "660 Unknown Cash (UC)", price: 145000, formattedPrice: "Rp 145.000" },
      { id: "pubg_1800", name: "1800 Unknown Cash (UC)", price: 370000, formattedPrice: "Rp 370.000" }, // Typo price 37000 fixed to 370000
      { id: "pubg_3850", name: "3850 Unknown Cash (UC)", price: 730000, formattedPrice: "Rp 730.000" },
      { id: "pubg_8100", name: "8100 Unknown Cash (UC)", price: 1450000, formattedPrice: "Rp 1.450.000" }
    ]
  },
  {
    id: "roblox",
    name: "Roblox",
    publisher: "Roblox Corporation",
    badge: "REKOMENDASI",
    image: "images/roblox_banner.jpg",
    description: "Roblox adalah platform permainan daring dan sistem pembuatan permainan yang memungkinkan pengguna memprogram permainan dan memainkan permainan yang dibuat oleh pengguna lain. Top up Robux instan untuk dapatkan item game terkeren!",
    hasServer: false,
    packages: [
      { id: "rob_80", name: "80 Robux", price: 15000, formattedPrice: "Rp 15.000" },
      { id: "rob_400", name: "400 Robux", price: 75000, formattedPrice: "Rp 75.000" },
      { id: "rob_800", name: "800 Robux", price: 145000, formattedPrice: "Rp 145.000" },
      { id: "rob_1700", name: "1700 Robux", price: 300000, formattedPrice: "Rp 300.000" },
      { id: "rob_4500", name: "4500 Robux", price: 750000, formattedPrice: "Rp 750.000" },
      { id: "rob_10000", name: "10000 Robux", price: 1500000, formattedPrice: "Rp 1.500.000" }
    ]
  }
];

let GAMES_DATA = [];

async function loadGamesData() {
  try {
    const response = await fetch('api/get_games.php');
    if (!response.ok) throw new Error("HTTP error " + response.status);
    GAMES_DATA = await response.json();
    return true;
  } catch (error) {
    console.error("Gagal memuat data game dari database SQL, menggunakan fallback lokal:", error);
    GAMES_DATA = DEFAULT_GAMES_DATA;
    return false;
  }
}

// 2. GLOBAL STATE
let appState = {
  selectedGame: null,
  selectedPackage: null,
  selectedPayment: null,
  user: JSON.parse(sessionStorage.getItem('gamezone_user')) || null
};

// 2b. AUTHENTICATION HELPERS
function updateAuthNavbar() {
  const authContainer = document.getElementById('auth-nav-item');
  const historyNavItem = document.getElementById('history-nav-item');
  const historyFooterItem = document.getElementById('history-footer-item');
  
  if (!authContainer) return;
  
  // Remove existing admin navigation items if any to avoid duplication
  const oldAdminNav = document.getElementById('admin-nav-item');
  const oldAdminFooter = document.getElementById('admin-footer-item');
  if (oldAdminNav) oldAdminNav.remove();
  if (oldAdminFooter) oldAdminFooter.remove();
  
  if (appState.user) {
    if (historyNavItem) historyNavItem.style.display = 'block';
    if (historyFooterItem) historyFooterItem.style.display = 'block';
    
    // Check if admin to add admin links
    if (appState.user.role === 'admin') {
      // Create admin nav list item
      const adminNavItem = document.createElement('li');
      adminNavItem.className = 'nav-item';
      adminNavItem.id = 'admin-nav-item';
      adminNavItem.innerHTML = `<a href="#/admin" class="nav-link" data-path="/admin"><i class="fa-solid fa-user-gear"></i> Admin Panel</a>`;
      
      // Insert before authContainer
      authContainer.parentNode.insertBefore(adminNavItem, authContainer);
      
      // Create admin footer item
      const footerMenu = document.querySelector('.footer-menu');
      if (footerMenu) {
        const adminFooterItem = document.createElement('li');
        adminFooterItem.id = 'admin-footer-item';
        adminFooterItem.innerHTML = `<a href="#/admin"><i class="fa-solid fa-chevron-right list-arrow"></i> Admin Panel</a>`;
        footerMenu.appendChild(adminFooterItem);
      }
    }
    
    authContainer.innerHTML = `
      <button id="btn-logout" class="nav-link auth-btn" style="border: none; background: transparent; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; font-family: var(--font-ui); font-size: 1.15rem; letter-spacing: 1px; color: var(--text-secondary);">
        <i class="fa-solid fa-right-from-bracket"></i> Keluar (${appState.user.name})
      </button>
    `;
    
    // Add hover effect style dynamically if needed, or styles in CSS
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('mouseenter', () => btnLogout.style.color = 'var(--text-primary)');
      btnLogout.addEventListener('mouseleave', () => btnLogout.style.color = 'var(--text-secondary)');
      btnLogout.addEventListener('click', () => {
        logoutUser();
      });
    }
  } else {
    if (historyNavItem) historyNavItem.style.display = 'none';
    if (historyFooterItem) historyFooterItem.style.display = 'none';
    
    authContainer.innerHTML = `
      <a href="#/login" class="nav-link auth-btn" data-path="/login">
        <i class="fa-solid fa-right-to-bracket"></i> Sign or Login
      </a>
    `;
  }
}

function loginUser(userData) {
  appState.user = userData;
  sessionStorage.setItem('gamezone_user', JSON.stringify(userData));
  updateAuthNavbar();
  showToast("Berhasil Masuk", `Selamat datang kembali, ${userData.name}!`, "success");
  navigateTo('#/');
}

function logoutUser() {
  appState.user = null;
  sessionStorage.removeItem('gamezone_user');
  updateAuthNavbar();
  showToast("Keluar Akun", "Anda telah berhasil keluar dari akun.", "info");
  navigateTo('#/');
}

// 3. TOAST SYSTEM
function showToast(title, message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = '<i class="fa-solid fa-circle-check toast-icon"></i>';
  if (type === 'error') {
    icon = '<i class="fa-solid fa-circle-exclamation toast-icon"></i>';
  } else if (type === 'info') {
    icon = '<i class="fa-solid fa-circle-info toast-icon"></i>';
  }

  toast.innerHTML = `
    ${icon}
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <i class="fa-solid fa-xmark toast-close"></i>
  `;

  container.appendChild(toast);

  // Close toast trigger
  toast.querySelector('.toast-close').addEventListener('click', () => {
    removeToast(toast);
  });

  // Auto remove
  setTimeout(() => {
    removeToast(toast);
  }, 4000);
}

function removeToast(toast) {
  toast.classList.add('removing');
  toast.addEventListener('animationend', () => {
    toast.remove();
  });
}

// 4. ROUTER & VIEWS RENDERING
const appContent = document.getElementById('app-content');

function navigateTo(hash) {
  window.location.hash = hash;
}

async function renderView() {
  const hash = window.location.hash || '#/';
  
  // Close navigation toggle first (for mobile views)
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  if (navMenu && navToggle) {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
  }

  // Fetch games data from database if empty
  if (GAMES_DATA.length === 0) {
    appContent.innerHTML = `
      <div class="loader-container">
        <div class="cyber-spinner"></div>
        <p class="loader-text">MENGHUBUNGKAN KE DATABASE...</p>
      </div>
    `;
    await loadGamesData();
  }

  // Route protection / Authorization guards
  if (hash === '#/history' && !appState.user) {
    showToast("Akses Ditolak", "Silakan login terlebih dahulu untuk melihat riwayat.", "error");
    navigateTo('#/login');
    return;
  }
  
  if (hash === '#/admin') {
    if (!appState.user || appState.user.role !== 'admin') {
      showToast("Akses Ditolak", "Hanya administrator yang dapat mengakses halaman ini.", "error");
      navigateTo('#/');
      return;
    }
  }

  // Update dynamic auth navbar elements
  updateAuthNavbar();

  // Update active state in navigation links
  updateNavbarActiveState(hash);

  // Router parsing logic
  if (hash === '#/' || hash === '') {
    renderHomeView();
  } else if (hash === '#/products') {
    renderProductsView();
  } else if (hash.startsWith('#/detail/')) {
    const gameId = hash.split('#/detail/')[1];
    renderDetailView(gameId);
  } else if (hash.startsWith('#/checkout/')) {
    const gameId = hash.split('#/checkout/')[1];
    renderCheckoutView(gameId);
  } else if (hash === '#/about') {
    renderAboutView();
  } else if (hash === '#/contact') {
    renderContactView();
  } else if (hash === '#/login') {
    renderLoginView();
  } else if (hash === '#/history') {
    renderHistoryView();
  } else if (hash === '#/admin') {
    renderAdminView();
  } else {
    // 404 Fallback
    renderHomeView();
  }
  
  // Scroll back to top on page navigation
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function updateNavbarActiveState(hash) {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    const path = link.getAttribute('data-path');
    
    // Check match base path
    if (hash === '#/' && path === '/') {
      link.classList.add('active');
    } else if (hash.startsWith('#/products') && path === '/products') {
      link.classList.add('active');
    } else if (hash.startsWith('#/history') && path === '/history') {
      link.classList.add('active');
    } else if (hash.startsWith('#/about') && path === '/about') {
      link.classList.add('active');
    } else if (hash.startsWith('#/contact') && path === '/contact') {
      link.classList.add('active');
    } else if (hash.startsWith('#/login') && path === '/login') {
      link.classList.add('active');
    } else if (hash.startsWith('#/admin') && path === '/admin') {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// --- VIEW 1: HOME ---
function renderHomeView() {
  let gamesHTML = GAMES_DATA.map(game => `
    <div class="game-card fade-in">
      <div class="game-card-img-container">
        <span class="game-badge">${game.badge}</span>
        <img class="game-card-img" src="${game.image}" alt="${game.name}" onerror="this.src='https://placehold.co/300x400/121624/00f0ff?text=${encodeURIComponent(game.name)}'">
        <div class="game-card-img-overlay"></div>
      </div>
      <div class="game-card-content">
        <h3 class="game-title">${game.name}</h3>
        <p class="game-publisher">${game.publisher}</p>
        <p class="game-desc">${game.description}</p>
        <a href="#/detail/${game.id}" class="game-card-action">Top Up Sekarang</a>
      </div>
    </div>
  `).join('');

  appContent.innerHTML = `
    <section class="hero-section fade-in">
      <div class="container hero-grid">
        <div class="hero-content">
          <div class="hero-tag">
            <i class="fa-solid fa-bolt"></i> LAYANAN INSTAN & AMAN 24/7
          </div>
          <h1 class="hero-title">
            Top Up Game Favoritmu <br>
            Di <span class="neon-blue">GameZone</span> <span class="neon-purple">Store</span>
          </h1>
          <p class="hero-desc">
            Beli voucher game, diamond, UC, dan Robux instan dengan harga terjangkau. Rasakan transaksi secepat kilat dengan antarmuka futuristik terbaik di Indonesia.
          </p>
          <div class="hero-actions">
            <a href="#/products" class="btn-cyber">Mulai Belanja</a>
            <a href="#/about" class="btn-cyber-outline">Tentang Kami</a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="cyber-panel-decoration">
            <i class="fa-solid fa-gamepad"></i>
            <span class="badge-text">GAMEZONE STORE</span>
            <span class="badge-sub">TOP UP CENTER</span>
          </div>
        </div>
      </div>
    </section>

    <section class="features-bar fade-in">
      <div class="container features-grid">
        <div class="feature-item">
          <div class="feature-icon-wrapper">
            <i class="fa-solid fa-bolt-lightning"></i>
          </div>
          <div class="feature-content">
            <h4>Proses Kilat</h4>
            <p>Top Up terkirim otomatis hanya dalam hitungan detik.</p>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon-wrapper">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <div class="feature-content">
            <h4>100% Aman</h4>
            <p>Platform aman & bergaransi, terpercaya untuk gamer.</p>
          </div>
        </div>
        
        <div class="feature-item">
          <div class="feature-icon-wrapper">
            <i class="fa-solid fa-headset"></i>
          </div>
          <div class="feature-content">
            <h4>Dukungan 24/7</h4>
            <p>Tim support kami selalu siap melayani kendala Anda.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="container">
      <div class="section-header fade-in">
        <h2 class="section-title">Daftar Game Terpopuler</h2>
        <a href="#/products" class="section-link">Lihat Semua Game <i class="fa-solid fa-arrow-right"></i></a>
      </div>
      
      <div class="game-grid">
        ${gamesHTML}
      </div>
    </section>
  `;
}

// --- VIEW 2: PRODUCTS CATALOG ---
function renderProductsView() {
  appContent.innerHTML = `
    <div class="container fade-in">
      <div class="products-hero">
        <h2>Pilih Game Favoritmu</h2>
        <p>Silakan pilih game pilihanmu di bawah ini untuk memulai pengisian nominal diamond atau koin.</p>
      </div>

      <div class="search-filter-container">
        <div class="search-box-wrapper">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input type="text" id="search-game" class="search-input" placeholder="Cari game favoritmu...">
        </div>
      </div>

      <div class="game-grid" id="catalog-grid">
        <!-- Renders dynamically with JS search -->
      </div>
    </div>
  `;

  const catalogGrid = document.getElementById('catalog-grid');
  const searchInput = document.getElementById('search-game');

  // Initial populate
  updateCatalogList(GAMES_DATA, catalogGrid);

  // Search filter event
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = GAMES_DATA.filter(game => 
      game.name.toLowerCase().includes(query) || 
      game.publisher.toLowerCase().includes(query)
    );
    updateCatalogList(filtered, catalogGrid, query);
  });
}

function updateCatalogList(games, container, query = '') {
  if (games.length === 0) {
    container.innerHTML = `
      <div class="no-results fade-in">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p>Game "${query}" tidak ditemukan. Silakan cari game lain!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = games.map(game => `
    <div class="game-card fade-in">
      <div class="game-card-img-container">
        <span class="game-badge">${game.badge}</span>
        <img class="game-card-img" src="${game.image}" alt="${game.name}" onerror="this.src='https://placehold.co/300x400/121624/00f0ff?text=${encodeURIComponent(game.name)}'">
        <div class="game-card-img-overlay"></div>
      </div>
      <div class="game-card-content">
        <h3 class="game-title">${game.name}</h3>
        <p class="game-publisher">${game.publisher}</p>
        <p class="game-desc">${game.description}</p>
        <a href="#/detail/${game.id}" class="game-card-action">Top Up Sekarang</a>
      </div>
    </div>
  `).join('');
}

// --- VIEW 3: PRODUCT DETAIL ---
function renderDetailView(gameId) {
  const game = GAMES_DATA.find(g => g.id === gameId);
  if (!game) {
    showToast("Error", "Game tidak ditemukan!", "error");
    navigateTo('#/');
    return;
  }

  appState.selectedGame = game;
  appState.selectedPackage = null; // reset choice

  let packagesHTML = game.packages.map(pkg => `
    <div class="package-item" data-package-id="${pkg.id}">
      <div class="package-name">${pkg.name}</div>
      <div class="package-price">${pkg.formattedPrice}</div>
    </div>
  `).join('');

  appContent.innerHTML = `
    <div class="container fade-in">
      <div class="detail-layout">
        <!-- Game details profile -->
        <div class="game-info-panel">
          <div class="detail-img-container">
            <img class="detail-img" src="${game.image}" alt="${game.name}" onerror="this.src='https://placehold.co/300x400/121624/00f0ff?text=${encodeURIComponent(game.name)}'">
          </div>
          <div class="detail-info-content">
            <p class="detail-publisher">${game.publisher}</p>
            <h2 class="detail-game-title">${game.name}</h2>
            <p class="detail-game-desc">${game.description}</p>
            
            <div class="quick-rules-card">
              <h4><i class="fa-solid fa-circle-exclamation"></i> Petunjuk Pengisian</h4>
              <ul class="quick-rules-list">
                <li>Masukkan User ID dan Server ID Anda.</li>
                <li>Pilih nominal paket top up yang diinginkan.</li>
                <li>Pilih metode pembayaran yang tersedia.</li>
                <li>Klik tombol Konfirmasi Pembelian.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Choice panels -->
        <div class="packages-panel">
          <div class="step-card">
            <div class="step-header">
              <span class="step-number">1</span>
              <h3 class="step-title">Pilih Nominal Top Up</h3>
            </div>
            
            <div class="packages-grid">
              ${packagesHTML}
            </div>
          </div>

          <div class="order-actions">
            <button id="btn-buy" class="btn-cyber btn-order-now" disabled>
              <i class="fa-solid fa-cart-shopping"></i> Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Select package trigger
  const packageItems = document.querySelectorAll('.package-item');
  const btnBuy = document.getElementById('btn-buy');

  packageItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active from others
      packageItems.forEach(p => p.classList.remove('selected'));
      
      // Select current
      item.classList.add('selected');
      const pkgId = item.getAttribute('data-package-id');
      appState.selectedPackage = game.packages.find(p => p.id === pkgId);
      
      // Enable buy button
      btnBuy.removeAttribute('disabled');
    });
  });

  // Action Click Buy
  btnBuy.addEventListener('click', () => {
    if (!appState.selectedPackage) {
      showToast("Pemberitahuan", "Harap pilih nominal paket terlebih dahulu!", "error");
      return;
    }
    navigateTo(`#/checkout/${game.id}`);
  });
}

// --- VIEW 4: CHECKOUT ---
function renderCheckoutView(gameId) {
  const game = appState.selectedGame;
  const pkg = appState.selectedPackage;

  // Safeguard: Check state
  if (!game || !pkg || game.id !== gameId) {
    showToast("Error", "Pembelian tidak valid, kembali ke halaman detail.", "error");
    navigateTo(gameId ? `#/detail/${gameId}` : '#/');
    return;
  }

  appState.selectedPayment = null; // Reset

  const serverFieldHTML = game.hasServer ? `
    <div class="form-field">
      <label for="server-id">Server ID</label>
      <input type="text" id="server-id" placeholder="${game.serverPlaceholder}" required>
    </div>
  ` : '';

  appContent.innerHTML = `
    <div class="container fade-in">
      <div class="products-hero">
        <h2>Konfirmasi Pembayaran</h2>
        <p>Lengkapi formulir di bawah ini untuk menyelesaikan proses top up game Anda.</p>
      </div>

      <div class="checkout-grid">
        <!-- Form columns left -->
        <div class="checkout-form">
          
          <!-- Step 1 ID input -->
          <div class="step-card">
            <div class="step-header">
              <span class="step-number">2</span>
              <h3 class="step-title">Lengkapi Data Akun Game</h3>
            </div>
            
            <div class="form-group-row">
              <div class="form-field">
                <label for="user-id">User ID Game</label>
                <input type="text" id="user-id" placeholder="Masukkan ID Game (e.g. 123456789)" required>
              </div>
              ${serverFieldHTML}
            </div>
          </div>

          <!-- Step 2 Payment choice -->
          <div class="step-card">
            <div class="step-header">
              <span class="step-number">3</span>
              <h3 class="step-title">Pilih Metode Pembayaran</h3>
            </div>

            <div class="payment-grid">
              <div class="payment-card" data-payment="DANA">
                <div class="payment-icon-container"><i class="fa-solid fa-wallet"></i></div>
                <div class="payment-name">DANA</div>
              </div>
              
              <div class="payment-card" data-payment="OVO">
                <div class="payment-icon-container"><i class="fa-solid fa-credit-card"></i></div>
                <div class="payment-name">OVO</div>
              </div>
              
              <div class="payment-card" data-payment="GOPAY">
                <div class="payment-icon-container"><i class="fa-solid fa-money-bill-wave"></i></div>
                <div class="payment-name">GOPAY</div>
              </div>
            </div>
          </div>
          
        </div>

        <!-- Right column checkout summaries -->
        <div class="order-summary-panel">
          <h3 class="summary-title">Ringkasan Pesanan</h3>
          
          <div class="summary-details">
            <div class="game-preview">
              <img class="game-preview-img" src="${game.image}" alt="${game.name}" onerror="this.src='https://placehold.co/100x100/121624/00f0ff?text=${encodeURIComponent(game.name)}'">
              <div class="game-preview-info">
                <h4>${game.name}</h4>
                <p>${game.publisher}</p>
              </div>
            </div>
            
            <div class="summary-row" style="margin-top: 15px;">
              <span class="summary-label">Paket Dipilih</span>
              <span class="summary-val" id="summary-pkg-name">${pkg.name}</span>
            </div>
            
            <div class="summary-row">
              <span class="summary-label">Pembayaran</span>
              <span class="summary-val" id="summary-payment-method">-</span>
            </div>

            <div class="summary-row">
              <span class="summary-label">No. Game ID</span>
              <span class="summary-val" id="summary-game-id">-</span>
            </div>
            
            <div class="summary-row total">
              <span class="summary-label">Total Bayar</span>
              <span class="summary-val">${pkg.formattedPrice}</span>
            </div>
          </div>

          <button id="btn-submit-order" class="btn-cyber btn-confirm-checkout" disabled>
            <i class="fa-solid fa-circle-check"></i> Konfirmasi Pembelian
          </button>
        </div>
      </div>
    </div>
  `;

  // Selector inputs
  const userIdInput = document.getElementById('user-id');
  const serverIdInput = document.getElementById('server-id');
  const paymentCards = document.querySelectorAll('.payment-card');
  const btnSubmit = document.getElementById('btn-submit-order');
  
  // Realtime display updates
  const summaryGameId = document.getElementById('summary-game-id');
  const summaryPayment = document.getElementById('summary-payment-method');

  // Input listeners
  userIdInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    const serverVal = serverIdInput ? ` (${serverIdInput.value.trim()})` : '';
    summaryGameId.textContent = val ? `${val}${serverVal}` : '-';
    validateCheckoutForm();
  });

  if (serverIdInput) {
    serverIdInput.addEventListener('input', (e) => {
      const serverVal = e.target.value.trim();
      const userVal = userIdInput.value.trim();
      summaryGameId.textContent = userVal ? `${userVal}${serverVal ? ` (${serverVal})` : ''}` : '-';
      validateCheckoutForm();
    });
  }

  // Payment select listeners
  paymentCards.forEach(card => {
    card.addEventListener('click', () => {
      paymentCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      const paymentName = card.getAttribute('data-payment');
      appState.selectedPayment = paymentName;
      summaryPayment.textContent = paymentName;
      
      validateCheckoutForm();
    });
  });

  function validateCheckoutForm() {
    const isUserIdValid = userIdInput.value.trim().length > 0;
    const isServerIdValid = !game.hasServer || (serverIdInput && serverIdInput.value.trim().length > 0);
    const isPaymentSelected = appState.selectedPayment !== null;

    if (isUserIdValid && isServerIdValid && isPaymentSelected) {
      btnSubmit.removeAttribute('disabled');
    } else {
      btnSubmit.setAttribute('disabled', 'true');
    }
  }

  // Submit trigger
  btnSubmit.addEventListener('click', async () => {
    const finalUserId = userIdInput.value.trim();
    const finalServerId = serverIdInput ? serverIdInput.value.trim() : '';

    if (!appState.user) {
      showToast("Perlu Login", "Silakan login terlebih dahulu untuk melakukan transaksi.", "error");
      navigateTo('#/login');
      return;
    }

    btnSubmit.setAttribute('disabled', 'true');
    btnSubmit.innerHTML = `<div class="cyber-spinner" style="width: 20px; height: 20px; border-width: 2px; display: inline-block; vertical-align: middle; margin-right: 8px;"></div> Memproses...`;

    // Generate unique invoice number: INV-timestamp-random
    const timestamp = Math.floor(Date.now() / 1000);
    const rand = Math.floor(100 + Math.random() * 900);
    const invoiceId = `INV-${timestamp}-${rand}`;
    
    const newTransaction = {
      id: invoiceId,
      user_email: appState.user.email,
      game_id: game.id,
      package_id: pkg.id,
      user_game_id: finalUserId,
      server_id: finalServerId || null,
      payment_method: appState.selectedPayment,
      price: pkg.price,
      formatted_price: pkg.formattedPrice,
      status: 'SUCCESS'
    };

    try {
      const response = await fetch('api/create_transaction.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      });
      const result = await response.json();
      
      if (result.error) {
        showToast("Transaksi Gagal", result.error, "error");
        btnSubmit.removeAttribute('disabled');
        btnSubmit.innerHTML = `<i class="fa-solid fa-circle-check"></i> Konfirmasi Pembelian`;
      } else {
        showToast("Transaksi Sukses!", `Top up ${pkg.name} berhasil diproses!`, "success");
        
        // Clear state
        appState.selectedGame = null;
        appState.selectedPackage = null;
        appState.selectedPayment = null;

        // Redirect history page
        setTimeout(() => {
          navigateTo('#/history');
        }, 500);
      }
    } catch (err) {
      showToast("Error", "Gagal menghubungi server!", "error");
      btnSubmit.removeAttribute('disabled');
      btnSubmit.innerHTML = `<i class="fa-solid fa-circle-check"></i> Konfirmasi Pembelian`;
    }
  });
}

// --- VIEW 5: ABOUT US ---
function renderAboutView() {
  appContent.innerHTML = `
    <div class="container fade-in">
      <div class="about-hero">
        <h2>Tentang GameZone Store</h2>
        <p>Kenali lebih dekat platform top up game terdepan dan terpercaya buatan anak bangsa.</p>
      </div>

      <div class="about-grid">
        <div class="about-content">
          <h3>Visi Kami</h3>
          <p>
            Menjadi platform top up game online nomor satu yang memberikan kemudahan, kecepatan luar biasa, serta antarmuka visual premium bagi para gamer di seluruh penjuru Indonesia.
          </p>
          <h3>Teknologi & Estetika</h3>
          <p>
            GameZone Store dirancang menggunakan teknologi web modern berkecepatan tinggi dengan sentuhan estetika cyberpunk masa depan. Desain modern, warna neon yang kontras, serta efek glassmorphism menghadirkan pengalaman visual premium ala dunia sains fiksi.
          </p>
          <p>
            Kami berkomitmen untuk memberikan layanan top up game digital tercepat, teraman, dan termurah dengan proses pembayaran yang mudah dan transparan untuk semua kalangan gamer Indonesia.
          </p>
          
          <div class="about-stats">
            <div class="stat-item">
              <div class="stat-num">24/7</div>
              <div class="stat-label">Layanan Aktif</div>
            </div>
            <div class="stat-item">
              <div class="stat-num">50K+</div>
              <div class="stat-label">Transaksi</div>
            </div>
            <div class="stat-item">
              <div class="stat-num">4+</div>
              <div class="stat-label">Top Games</div>
            </div>
          </div>
        </div>

        <div class="about-visual-panel">
          <div class="cyber-cube">
            <div class="cyber-cube-content">
              <i class="fa-solid fa-shield-halved"></i>
              <h4>SECURE SYSTEM</h4>
              <p style="color: var(--accent-purple); font-size: 0.8rem; margin-top: 5px; font-family: var(--font-ui); letter-spacing: 2px;">PAYMENT GATEWAY</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// --- VIEW 6: CONTACT ---
function renderContactView() {
  appContent.innerHTML = `
    <div class="container fade-in">
      <div class="about-hero">
        <h2>Hubungi Kami</h2>
        <p>Memiliki kendala atau ingin memberikan masukan? Jangan ragu untuk menghubungi kami.</p>
      </div>

      <div class="contact-layout">
        <!-- Contact card details left -->
        <div class="contact-info-card">
          <div class="contact-detail-item">
            <div class="contact-icon-box"><i class="fa-solid fa-envelope"></i></div>
            <div class="contact-text-box">
              <h4>Email Support</h4>
              <p>support@gamezonestore.my.id</p>
            </div>
          </div>
          
          <div class="contact-detail-item">
            <div class="contact-icon-box"><i class="fa-solid fa-phone"></i></div>
            <div class="contact-text-box">
              <h4>WhatsApp Hotline</h4>
              <p>+62 812-3456-7890</p>
            </div>
          </div>

          <div class="contact-detail-item">
            <div class="contact-icon-box"><i class="fa-solid fa-location-dot"></i></div>
            <div class="contact-text-box">
              <h4>Alamat Kantor</h4>
              <p>Cyber City, Gedung Tech Tower Sektor 4, No. 101, Jakarta, Indonesia</p>
            </div>
          </div>
        </div>

        <!-- Contact form card right -->
        <div class="contact-form-card">
          <h3>Kirimkan Pesan Anda</h3>
          <form id="contact-form" class="contact-form">
            <div class="form-group-row">
              <div class="form-field">
                <label for="contact-name">Nama Lengkap</label>
                <input type="text" id="contact-name" placeholder="Masukkan nama lengkap" required>
              </div>
              
              <div class="form-field">
                <label for="contact-email">Alamat Email</label>
                <input type="email" id="contact-email" placeholder="Masukkan email aktif" required>
              </div>
            </div>

            <div class="form-field">
              <label for="contact-msg">Pesan / Masukan</label>
              <textarea id="contact-msg" placeholder="Tuliskan pesan Anda di sini..." required></textarea>
            </div>

            <button type="submit" class="btn-cyber btn-contact-submit">
              Kirim Pesan <i class="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  // Add listener to contact form
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const msg = document.getElementById('contact-msg').value.trim();

    const btnSubmit = form.querySelector('.btn-contact-submit');
    btnSubmit.setAttribute('disabled', 'true');
    btnSubmit.innerHTML = `Memproses...`;

    try {
      const response = await fetch('api/send_message.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: msg })
      });
      const result = await response.json();
      
      if (result.error) {
        showToast("Error", result.error, "error");
      } else {
        showToast("Pesan Terkirim!", `Halo ${name}, pesan Anda berhasil dikirim!`, "success");
        form.reset();
      }
    } catch (err) {
      showToast("Error", "Gagal menghubungi server!", "error");
    } finally {
      btnSubmit.removeAttribute('disabled');
      btnSubmit.innerHTML = `Kirim Pesan <i class="fa-solid fa-paper-plane"></i>`;
    }
  });
}

// --- VIEW 7: LOGIN ---
// --- DATABASE MIGRATIONS/HELPERS (LOCALSTORAGE WRAPPER) ---
function getUsersFromDb() {
  return JSON.parse(localStorage.getItem('gamezone_users')) || [];
}

function saveUserToDb(user) {
  const users = getUsersFromDb();
  users.push(user);
  localStorage.setItem('gamezone_users', JSON.stringify(users));
}

// --- VIEW 7: LOGIN ---
function renderLoginView() {
  appContent.innerHTML = `
    <div class="container fade-in" style="display: flex; justify-content: center; align-items: center; padding: 60px 24px;">
      <div class="contact-form-card" style="width: 100%; max-width: 450px; border: var(--border-cyber); box-shadow: var(--shadow-neon-purple); background: var(--bg-secondary);">
        
        <!-- Tab Toggles -->
        <div class="auth-tabs">
          <button id="tab-login" class="auth-tab active">MASUK</button>
          <button id="tab-register" class="auth-tab">DAFTAR</button>
        </div>

        <!-- Login Panel -->
        <div id="auth-login-panel">
          <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="font-family: var(--font-title); font-size: 1.6rem; margin-bottom: 10px; color: #fff;">MASUK KE <span style="color: var(--accent-cyan); text-shadow: 0 0 10px rgba(0, 240, 255, 0.4);">GAMEZONE</span></h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">Hubungkan akun GameZone Anda</p>
          </div>

          <form id="login-form" class="contact-form" style="display: flex; flex-direction: column; gap: 20px;">
            <div class="form-field">
              <label for="login-email">Alamat Email</label>
              <input type="email" id="login-email" placeholder="nama@email.com" required style="background: var(--bg-primary); border: 1px solid rgba(255, 255, 255, 0.1); padding: 14px 20px; border-radius: 8px;">
            </div>
            
            <div class="form-field">
              <label for="login-password">Kata Sandi</label>
              <input type="password" id="login-password" placeholder="••••••••" required style="background: var(--bg-primary); border: 1px solid rgba(255, 255, 255, 0.1); padding: 14px 20px; border-radius: 8px;">
            </div>

            <button type="submit" id="btn-email-login" class="btn-cyber" style="width: 100%; text-align: center; padding: 14px 20px; font-size: 1.05rem; border: none;">
              Masuk Sekarang <i class="fa-solid fa-right-to-bracket"></i>
            </button>
          </form>
        </div>

        <!-- Register Panel -->
        <div id="auth-register-panel" style="display: none;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="font-family: var(--font-title); font-size: 1.6rem; margin-bottom: 10px; color: #fff;">DAFTAR AKUN <span style="color: var(--accent-purple); text-shadow: 0 0 10px rgba(191, 90, 242, 0.4);">BARU</span></h2>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">Mulai petualangan top up instan Anda</p>
          </div>

          <form id="register-form" class="contact-form" style="display: flex; flex-direction: column; gap: 20px;">
            <div class="form-field">
              <label for="register-name">Nama Lengkap</label>
              <input type="text" id="register-name" placeholder="Nama Lengkap Anda" required style="background: var(--bg-primary); border: 1px solid rgba(255, 255, 255, 0.1); padding: 14px 20px; border-radius: 8px;">
            </div>

            <div class="form-field">
              <label for="register-email">Alamat Email</label>
              <input type="email" id="register-email" placeholder="nama@email.com" required style="background: var(--bg-primary); border: 1px solid rgba(255, 255, 255, 0.1); padding: 14px 20px; border-radius: 8px;">
            </div>
            
            <div class="form-field">
              <label for="register-password">Kata Sandi</label>
              <input type="password" id="register-password" placeholder="Minimal 6 karakter" required style="background: var(--bg-primary); border: 1px solid rgba(255, 255, 255, 0.1); padding: 14px 20px; border-radius: 8px;">
            </div>

            <div class="form-field">
              <label for="register-confirm-password">Konfirmasi Kata Sandi</label>
              <input type="password" id="register-confirm-password" placeholder="Ulangi kata sandi" required style="background: var(--bg-primary); border: 1px solid rgba(255, 255, 255, 0.1); padding: 14px 20px; border-radius: 8px;">
            </div>

            <button type="submit" id="btn-email-register" class="btn-cyber" style="width: 100%; text-align: center; padding: 14px 20px; font-size: 1.05rem; border: none; background: linear-gradient(90deg, var(--accent-purple), var(--accent-pink)); box-shadow: var(--shadow-neon-purple);">
              Daftar Akun <i class="fa-solid fa-user-plus"></i>
            </button>
          </form>
        </div>

        <div style="display: flex; align-items: center; text-align: center; margin: 25px 0; color: var(--text-muted); font-size: 0.85rem; font-family: var(--font-ui); letter-spacing: 1px;">
          <div style="flex: 1; height: 1px; background: rgba(255,255,255,0.08);"></div>
          <span style="padding: 0 15px;">ATAU HUBUNGKAN DENGAN</span>
          <div style="flex: 1; height: 1px; background: rgba(255,255,255,0.08);"></div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <button id="btn-google-login" class="btn-social google" style="display: flex; align-items: center; justify-content: center; gap: 12px; padding: 14px; border-radius: 6px; border: 1px solid rgba(255, 45, 85, 0.3); background: rgba(255, 45, 85, 0.05); font-family: var(--font-ui); font-size: 1rem; font-weight: 700; letter-spacing: 1px; color: #ff2d55; cursor: pointer; transition: var(--transition-fast);">
            <i class="fa-brands fa-google" style="font-size: 1.15rem;"></i> Akun Google
          </button>
          
          <button id="btn-facebook-login" class="btn-social facebook" style="display: flex; align-items: center; justify-content: center; gap: 12px; padding: 14px; border-radius: 6px; border: 1px solid rgba(0, 240, 255, 0.3); background: rgba(0, 240, 255, 0.05); font-family: var(--font-ui); font-size: 1rem; font-weight: 700; letter-spacing: 1px; color: var(--accent-cyan); cursor: pointer; transition: var(--transition-fast);">
            <i class="fa-brands fa-facebook" style="font-size: 1.15rem;"></i> Akun Facebook
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach event handlers
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const loginPanel = document.getElementById('auth-login-panel');
  const registerPanel = document.getElementById('auth-register-panel');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const btnEmailLogin = document.getElementById('btn-email-login');
  const btnEmailRegister = document.getElementById('btn-email-register');
  const btnGoogle = document.getElementById('btn-google-login');
  const btnFacebook = document.getElementById('btn-facebook-login');

  // Toggle tabs
  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginPanel.style.display = 'block';
    registerPanel.style.display = 'none';
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    registerPanel.style.display = 'block';
    loginPanel.style.display = 'none';
  });

  // Login form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    
    // Show loading state
    btnEmailLogin.setAttribute('disabled', 'true');
    btnEmailLogin.innerHTML = `<div class="cyber-spinner" style="width: 20px; height: 20px; border-width: 2px; display: inline-block; vertical-align: middle; margin-right: 8px;"></div> Memproses...`;

    try {
      const response = await fetch('api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      
      if (result.error) {
        showToast("Login Gagal", result.error, "error");
        btnEmailLogin.removeAttribute('disabled');
        btnEmailLogin.innerHTML = `Masuk Sekarang <i class="fa-solid fa-right-to-bracket"></i>`;
        return;
      }
      
      loginUser({
        email: result.email,
        name: result.name,
        role: result.role,
        type: 'email'
      });
    } catch (err) {
      showToast("Error", "Gagal menghubungi server!", "error");
      btnEmailLogin.removeAttribute('disabled');
      btnEmailLogin.innerHTML = `Masuk Sekarang <i class="fa-solid fa-right-to-bracket"></i>`;
    }
  });

  // Register form submission
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim().toLowerCase();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password.length < 6) {
      showToast("Error Pendaftaran", "Password minimal harus 6 karakter!", "error");
      return;
    }
    
    if (password !== confirmPassword) {
      showToast("Error Pendaftaran", "Konfirmasi password tidak cocok!", "error");
      return;
    }
    
    btnEmailRegister.setAttribute('disabled', 'true');
    btnEmailRegister.innerHTML = `<div class="cyber-spinner" style="width: 20px; height: 20px; border-width: 2px; display: inline-block; vertical-align: middle; margin-right: 8px;"></div> Memproses...`;
    
    try {
      const response = await fetch('api/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const result = await response.json();
      
      if (result.error) {
        showToast("Error Pendaftaran", result.error, "error");
        btnEmailRegister.removeAttribute('disabled');
        btnEmailRegister.innerHTML = `Daftar Akun <i class="fa-solid fa-user-plus"></i>`;
        return;
      }
      
      showToast("Registrasi Sukses", "Akun berhasil dibuat. Silakan login!", "success");
      
      // Toggle back to login tab
      tabLogin.click();
      document.getElementById('login-email').value = email;
      document.getElementById('login-password').value = '';
      
    } catch (err) {
      showToast("Error", "Gagal menghubungi server!", "error");
    } finally {
      btnEmailRegister.removeAttribute('disabled');
      btnEmailRegister.innerHTML = `Daftar Akun <i class="fa-solid fa-user-plus"></i>`;
    }
  });

  btnGoogle.addEventListener('click', () => {
    btnGoogle.setAttribute('disabled', 'true');
    btnGoogle.innerHTML = `<div class="cyber-spinner" style="width: 20px; height: 20px; border-width: 2px; display: inline-block; vertical-align: middle; margin-right: 8px;"></div> Memproses...`;

    setTimeout(() => {
      const googleUser = {
        email: 'google.user@gmail.com',
        name: 'Google Gamer',
        role: 'user',
        type: 'google'
      };
      loginUser(googleUser);
    }, 1000);
  });

  btnFacebook.addEventListener('click', () => {
    btnFacebook.setAttribute('disabled', 'true');
    btnFacebook.innerHTML = `<div class="cyber-spinner" style="width: 20px; height: 20px; border-width: 2px; display: inline-block; vertical-align: middle; margin-right: 8px;"></div> Memproses...`;

    setTimeout(() => {
      const fbUser = {
        email: 'facebook.user@facebook.com',
        name: 'Facebook Fighter',
        role: 'user',
        type: 'facebook'
      };
      loginUser(fbUser);
    }, 1000);
  });
}

// --- VIEW 8: TRANSACTION HISTORY ---
async function renderHistoryView() {
  if (!appState.user) {
    showToast("Akses Ditolak", "Harap masuk untuk melihat riwayat transaksi.", "error");
    navigateTo('#/login');
    return;
  }
  
  appContent.innerHTML = `
    <div class="container fade-in" style="padding-top: 40px;">
      <div class="loader-container">
        <div class="cyber-spinner"></div>
        <p class="loader-text">MEMUAT RIWAYAT TRANSAKSI...</p>
      </div>
    </div>
  `;

  try {
    const response = await fetch(`api/get_transactions.php?email=${encodeURIComponent(appState.user.email)}`);
    const userTransactions = await response.json();
    
    let tableBodyHTML = "";
    if (userTransactions.error) {
      showToast("Error", userTransactions.error, "error");
      tableBodyHTML = `<tr><td colspan="7" class="no-transactions" style="color: var(--accent-pink);">${userTransactions.error}</td></tr>`;
    } else if (userTransactions.length === 0) {
      tableBodyHTML = `
        <tr>
          <td colspan="7" class="no-transactions">
            <div style="margin: 20px 0;">
              <i class="fa-solid fa-receipt" style="font-size: 3rem; color: var(--accent-purple); filter: drop-shadow(0 0 10px rgba(191, 90, 242, 0.5)); margin-bottom: 15px;"></i>
              <p style="margin-top: 10px; font-family: var(--font-ui); font-size: 1.1rem; color: var(--text-secondary);">Belum ada riwayat transaksi top up.</p>
              <a href="#/products" class="btn-cyber" style="margin-top: 20px; display: inline-block; padding: 12px 24px; font-size: 0.95rem;">Top Up Sekarang</a>
            </div>
          </td>
        </tr>
      `;
    } else {
      tableBodyHTML = userTransactions.map(t => {
        let statusClass = "success";
        if (t.status === "PENDING") statusClass = "pending";
        if (t.status === "FAILED") statusClass = "failed";
        
        const playerDisplay = t.server_id ? `${t.user_game_id} (${t.server_id})` : t.user_game_id;
        const gameImg = t.game_image || `images/${t.game_id}_banner.jpg`;
        const gameName = t.game_name || t.game_id.toUpperCase();

        return `
          <tr class="fade-in">
            <td style="font-weight: 700; color: var(--accent-cyan); font-family: monospace;">${t.id}</td>
            <td>
              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${gameImg}" alt="${gameName}" style="width: 32px; height: 32px; border-radius: 4px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1);" onerror="this.src='https://placehold.co/100x100/121624/00f0ff?text=${t.game_id}'">
                <span>${gameName}</span>
              </div>
            </td>
            <td style="font-weight: 600;">${t.package_name || t.package_id}</td>
            <td style="font-family: monospace;">${playerDisplay}</td>
            <td style="color: var(--accent-yellow); font-weight: 700;">${t.formatted_price}</td>
            <td>
              <span style="font-weight: 700; font-family: var(--font-title); font-size: 0.85rem;">${t.payment_method}</span>
            </td>
            <td>
              <span class="status-badge ${statusClass}">
                <i class="fa-solid ${t.status === 'SUCCESS' ? 'fa-circle-check' : t.status === 'PENDING' ? 'fa-circle-notch fa-spin' : 'fa-circle-xmark'}"></i>
                ${t.status}
              </span>
            </td>
          </tr>
        `;
      }).join('');
    }
    
    appContent.innerHTML = `
      <div class="container fade-in" style="padding-top: 40px;">
        <div class="products-hero" style="text-align: left; padding: 20px 0;">
          <h2 style="font-family: var(--font-title); font-size: 2.2rem; margin-bottom: 10px; color: #fff;">RIWAYAT <span style="color: var(--accent-cyan); text-shadow: 0 0 10px rgba(0, 240, 255, 0.4);">TRANSAKSI</span></h2>
          <p style="color: var(--text-secondary); max-width: 600px; margin: 0;">Berikut adalah daftar transaksi pengisian diamond, UC, atau Robux yang telah Anda lakukan pada akun ini.</p>
        </div>
        
        <div class="cyber-table-container">
          <table class="cyber-table">
            <thead>
              <tr>
                <th>No. Invoice</th>
                <th>Game</th>
                <th>Item Paket</th>
                <th>ID Game (Server)</th>
                <th>Total Bayar</th>
                <th>Metode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${tableBodyHTML}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (err) {
    showToast("Error", "Gagal memuat riwayat transaksi dari server!", "error");
  }
}

// --- VIEW 9: ADMIN PANEL ---
async function renderAdminView() {
  if (!appState.user || appState.user.role !== 'admin') {
    showToast("Akses Ditolak", "Anda tidak memiliki akses administrator.", "error");
    navigateTo('#/');
    return;
  }

  appContent.innerHTML = `
    <div class="container fade-in" style="padding-top: 40px;">
      <div class="loader-container">
        <div class="cyber-spinner"></div>
        <p class="loader-text">MEMUAT DASHBOARD ADMIN...</p>
      </div>
    </div>
  `;

  try {
    const emailParam = encodeURIComponent(appState.user.email);
    const [txResponse, msgResponse] = await Promise.all([
      fetch(`api/get_transactions.php?email=${emailParam}`),
      fetch(`api/get_messages.php?email=${emailParam}`)
    ]);

    const transactions = await txResponse.json();
    const messages = await msgResponse.json();

    if (transactions.error || messages.error) {
      showToast("Error", transactions.error || messages.error, "error");
      navigateTo('#/');
      return;
    }

    const totalOrders = transactions.length;
    const successTransactions = transactions.filter(t => t.status === 'SUCCESS');
    const totalRevenue = successTransactions.reduce((acc, t) => acc + t.price, 0);
    const formattedRevenue = 'Rp ' + totalRevenue.toLocaleString('id-ID');
    const uniqueEmails = [...new Set(transactions.map(t => t.user_email))];
    const totalUsers = uniqueEmails.length;
    const totalMessages = messages.length;

    const txRows = transactions.map(t => {
      const playerDisplay = t.server_id ? `${t.user_game_id} (${t.server_id})` : t.user_game_id;
      const gameImg = t.game_image || `images/${t.game_id}_banner.jpg`;
      const gameName = t.game_name || t.game_id.toUpperCase();

      return `
        <tr>
          <td style="font-weight: 700; color: var(--accent-cyan); font-family: monospace;">${t.id}</td>
          <td style="font-size: 0.9rem;">${t.user_email}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <img src="${gameImg}" alt="${gameName}" style="width: 28px; height: 28px; border-radius: 4px; object-fit: cover;" onerror="this.src='https://placehold.co/100x100/121624/00f0ff?text=${t.game_id}'">
              <span>${gameName}</span>
            </div>
          </td>
          <td style="font-size: 0.95rem; font-weight: 600;">${t.package_name || t.package_id}</td>
          <td style="font-family: monospace; font-size: 0.9rem;">${playerDisplay}</td>
          <td style="color: var(--accent-yellow); font-weight: 700;">${t.formatted_price}</td>
          <td>
            <select class="admin-status-select" data-tx-id="${t.id}" style="background: var(--bg-primary); border: 1px solid rgba(255,255,255,0.15); border-radius: 4px; padding: 6px 12px; color: #fff; font-family: var(--font-title); font-size: 0.8rem; font-weight: 600; cursor: pointer; outline: none; transition: var(--transition-fast);">
              <option value="PENDING" ${t.status === 'PENDING' ? 'selected' : ''} style="color: var(--accent-yellow);">PENDING</option>
              <option value="SUCCESS" ${t.status === 'SUCCESS' ? 'selected' : ''} style="color: #4cd964;">SUCCESS</option>
              <option value="FAILED" ${t.status === 'FAILED' ? 'selected' : ''} style="color: var(--accent-pink);">FAILED</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');

    const msgRows = messages.length === 0 
      ? `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 30px;">Tidak ada pesan masuk.</td></tr>`
      : messages.map(m => {
          const formattedDate = new Date(m.created_at).toLocaleString('id-ID');
          return `
            <tr>
              <td style="font-weight: 700; color: #fff;">${m.name}</td>
              <td style="color: var(--accent-cyan); font-family: monospace;">${m.email}</td>
              <td style="color: var(--text-secondary); line-height: 1.4; max-width: 350px; white-space: normal; word-break: break-all;">${m.message}</td>
              <td style="font-size: 0.85rem; color: var(--text-muted);">${formattedDate}</td>
            </tr>
          `;
        }).join('');

    appContent.innerHTML = `
      <div class="container fade-in" style="padding-top: 40px;">
        <div class="products-hero" style="text-align: left; padding: 20px 0;">
          <h2 style="font-family: var(--font-title); font-size: 2.2rem; margin-bottom: 10px; color: #fff;">PANEL <span style="color: var(--accent-purple); text-shadow: 0 0 10px rgba(191, 90, 242, 0.4);">ADMINISTRATOR</span></h2>
          <p style="color: var(--text-secondary); max-width: 600px; margin: 0;">Kontrol transaksi top up game, ubah status invoice, dan lihat pesan feedback pelanggan secara langsung dari database SQL.</p>
        </div>

        <div class="admin-stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; margin-bottom: 40px;">
          <div class="admin-stat-card" style="background: var(--bg-secondary); border: 1px solid rgba(0, 240, 255, 0.2); box-shadow: 0 0 10px rgba(0, 240, 255, 0.1); border-radius: 10px; padding: 24px; display: flex; align-items: center; gap: 20px;">
            <div style="font-size: 2.5rem; color: var(--accent-cyan); filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.4));"><i class="fa-solid fa-sack-dollar"></i></div>
            <div>
              <h4 style="font-family: var(--font-ui); font-size: 0.95rem; color: var(--text-secondary); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px;">Pendapatan Bersih</h4>
              <p style="font-family: var(--font-title); font-size: 1.45rem; font-weight: 800; color: var(--accent-yellow);">${formattedRevenue}</p>
            </div>
          </div>
          
          <div class="admin-stat-card" style="background: var(--bg-secondary); border: 1px solid rgba(191, 90, 242, 0.2); box-shadow: 0 0 10px rgba(191, 90, 242, 0.1); border-radius: 10px; padding: 24px; display: flex; align-items: center; gap: 20px;">
            <div style="font-size: 2.5rem; color: var(--accent-purple); filter: drop-shadow(0 0 8px rgba(191, 90, 242, 0.4));"><i class="fa-solid fa-receipt"></i></div>
            <div>
              <h4 style="font-family: var(--font-ui); font-size: 0.95rem; color: var(--text-secondary); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px;">Total Pesanan</h4>
              <p style="font-family: var(--font-title); font-size: 1.6rem; font-weight: 800; color: #fff;">${totalOrders}</p>
            </div>
          </div>

          <div class="admin-stat-card" style="background: var(--bg-secondary); border: 1px solid rgba(255, 45, 85, 0.2); box-shadow: 0 0 10px rgba(255, 45, 85, 0.1); border-radius: 10px; padding: 24px; display: flex; align-items: center; gap: 20px;">
            <div style="font-size: 2.5rem; color: var(--accent-pink); filter: drop-shadow(0 0 8px rgba(255, 45, 85, 0.4));"><i class="fa-solid fa-users"></i></div>
            <div>
              <h4 style="font-family: var(--font-ui); font-size: 0.95rem; color: var(--text-secondary); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px;">Pelanggan Unik</h4>
              <p style="font-family: var(--font-title); font-size: 1.6rem; font-weight: 800; color: #fff;">${totalUsers}</p>
            </div>
          </div>

          <div class="admin-stat-card" style="background: var(--bg-secondary); border: 1px solid rgba(0, 240, 255, 0.2); box-shadow: 0 0 10px rgba(0, 240, 255, 0.1); border-radius: 10px; padding: 24px; display: flex; align-items: center; gap: 20px;">
            <div style="font-size: 2.5rem; color: var(--accent-cyan); filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.4));"><i class="fa-solid fa-comment-dots"></i></div>
            <div>
              <h4 style="font-family: var(--font-ui); font-size: 0.95rem; color: var(--text-secondary); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px;">Pesan Masuk</h4>
              <p style="font-family: var(--font-title); font-size: 1.6rem; font-weight: 800; color: #fff;">${totalMessages}</p>
            </div>
          </div>
        </div>

        <div class="auth-tabs" style="margin-bottom: 30px;">
          <button id="admin-tab-tx" class="auth-tab active">Kelola Transaksi</button>
          <button id="admin-tab-msg" class="auth-tab">Pesan Masuk</button>
        </div>

        <div id="admin-tx-panel">
          <div class="cyber-table-container">
            <table class="cyber-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Email Pembeli</th>
                  <th>Game</th>
                  <th>Paket</th>
                  <th>ID (Server)</th>
                  <th>Total</th>
                  <th>Ubah Status</th>
                </tr>
              </thead>
              <tbody>
                ${txRows ? txRows : '<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">Belum ada data transaksi.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>

        <div id="admin-msg-panel" style="display: none;">
          <div class="cyber-table-container">
            <table class="cyber-table">
              <thead>
                <tr>
                  <th>Nama Pengirim</th>
                  <th>Email</th>
                  <th>Isi Pesan</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                ${msgRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    const tabTx = document.getElementById('admin-tab-tx');
    const tabMsg = document.getElementById('admin-tab-msg');
    const panelTx = document.getElementById('admin-tx-panel');
    const panelMsg = document.getElementById('admin-msg-panel');

    tabTx.addEventListener('click', () => {
      tabTx.classList.add('active');
      tabMsg.classList.remove('active');
      panelTx.style.display = 'block';
      panelMsg.style.display = 'none';
    });

    tabMsg.addEventListener('click', () => {
      tabMsg.classList.add('active');
      tabTx.classList.remove('active');
      panelMsg.style.display = 'block';
      panelTx.style.display = 'none';
    });

    const selects = document.querySelectorAll('.admin-status-select');
    selects.forEach(select => {
      const updateSelectStyle = (el) => {
        if (el.value === 'PENDING') {
          el.style.borderColor = 'var(--accent-yellow)';
          el.style.color = 'var(--accent-yellow)';
        } else if (el.value === 'SUCCESS') {
          el.style.borderColor = '#4cd964';
          el.style.color = '#4cd964';
        } else if (el.value === 'FAILED') {
          el.style.borderColor = 'var(--accent-pink)';
          el.style.color = 'var(--accent-pink)';
        }
      };
      updateSelectStyle(select);

      select.addEventListener('change', async () => {
        const txId = select.getAttribute('data-tx-id');
        const newStatus = select.value;
        updateSelectStyle(select);

        select.setAttribute('disabled', 'true');

        try {
          const response = await fetch('api/update_transaction_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              admin_email: appState.user.email,
              transaction_id: txId,
              status: newStatus
            })
          });
          const result = await response.json();

          if (result.error) {
            showToast("Gagal Memperbarui", result.error, "error");
            renderAdminView();
          } else {
            showToast("Sukses", `Status invoice ${txId} diubah menjadi ${newStatus}!`, "success");
            setTimeout(() => {
              renderAdminView();
            }, 300);
          }
        } catch (err) {
          showToast("Error", "Gagal menghubungi database server!", "error");
          renderAdminView();
        }
      });
    });

  } catch (err) {
    showToast("Error", "Gagal memuat data administrator dari database!", "error");
    navigateTo('#/');
  }
}

// 5. BOOTSTRAP INITIALIZATION & EVENTS
document.addEventListener('DOMContentLoaded', () => {
  // Setup Router
  window.addEventListener('hashchange', renderView);
  window.addEventListener('load', renderView);

  // Setup Mobile Hamburger Toggler
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
  }

  // Pre-load default state in console
  console.log("GameZone Store Web Engine Initiated Successfully!");
});
