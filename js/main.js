// ============ CONFIG ============
const CONFIG = {
  downloadUrl: 'huilo.jpg', // ⚠️ УКАЖИ СВОЙ ФАЙЛ
  fileName: 'huilo.jpg',
  fileSize: '24 MB',
  password: 'test'
};

// ============ DOWNLOAD ============
function handleDownload(e) {
  if (e) e.preventDefault();
  showModal();
  simulateDownload();
}

function showModal() {
  document.getElementById('downloadModal').classList.add('active');
}

function hideModal() {
  document.getElementById('downloadModal').classList.remove('active');
  document.getElementById('progressFill').style.width = '0%';
}

function simulateDownload() {
  const progress = document.getElementById('progressFill');
  const status = document.getElementById('modalStatus');
  const statuses = [
    'Connecting to server...',
    'Verifying file...',
    'Preparing download...',
    'Almost done...',
    'Starting download...'
  ];
  let p = 0;
  const interval = setInterval(() => {
    p += Math.random() * 15;
    if (p >= 100) {
      p = 100;
      progress.style.width = '100%';
      status.textContent = '✓ Download started!';
      clearInterval(interval);
      // Реальный клик по ссылке
      const a = document.createElement('a');
      a.href = CONFIG.downloadUrl;
      a.download = CONFIG.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(hideModal, 2000);
      incrementDownloads();
    } else {
      progress.style.width = p + '%';
      const idx = Math.min(Math.floor(p / 25), statuses.length - 1);
      status.textContent = statuses[idx];
    }
  }, 300);
}

// ============ STATS ============
function getDownloads() {
  return parseInt(localStorage.getItem('test_downloads') || '184392');
}

function incrementDownloads() {
  const current = getDownloads() + 1;
  localStorage.setItem('test_downloads', current);
  document.getElementById('downloadsHero').textContent = current.toLocaleString();
}

// ============ REVIEWS (localStorage) ============
function loadReviews() {
  const stored = localStorage.getItem('test_reviews');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch(e) { return null; }
  }
  return null;
}

function saveReviews(reviews) {
  localStorage.setItem('test_reviews', JSON.stringify(reviews));
}

function renderReviews() {
  const reviews = loadReviews();
  const grid = document.getElementById('reviewsGrid');
  if (!reviews) return; // оставляем дефолтные

  grid.innerHTML = '';
  reviews.forEach(r => {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <div class="review-head">
        <div class="review-avatar">${r.avatar || '⭐'}</div>
        <div>
          <div class="review-name">${escapeHtml(r.name)}</div>
          <div class="review-stars">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</div>
        </div>
        <div class="review-date">${r.date || 'recent'}</div>
      </div>
      <p class="review-text">"${escapeHtml(r.text)}"</p>
      <div class="review-meta">Verified User</div>
    `;
    grid.appendChild(card);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============ PASSWORD ============
function loadPassword() {
  const stored = localStorage.getItem('test_password');
  if (stored) {
    document.getElementById('passwordDisplay').textContent = stored;
    CONFIG.password = stored;
  }
}

// ============ ONLINE COUNTER (имитация) ============
function updateOnline() {
  const base = 2800;
  const variance = Math.floor(Math.random() * 200);
  document.getElementById('onlineCount').textContent = (base + variance).toLocaleString();
}

// ============ 3D TILT EFFECT ============
function initTilt() {
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');

      const rotateX = ((y - 50) / 50) * -5;
      const rotateY = ((x - 50) / 50) * 5;
      card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ============ NOTIFICATION ============
function showNotification(text) {
  const notif = document.getElementById('notification');
  document.getElementById('notifText').textContent = text;
  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 3000);
}

// ============ COPY PASSWORD ============
function copyPassword() {
  const pwd = document.getElementById('passwordDisplay').textContent;
  navigator.clipboard.writeText(pwd).then(() => {
    showNotification('✓ Password copied!');
  });
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  // Кнопки скачивания
  document.getElementById('downloadBtn').addEventListener('click', handleDownload);
  document.getElementById('downloadBtn2').addEventListener('click', handleDownload);

  // Закрытие модалки
  document.getElementById('modalClose').addEventListener('click', hideModal);
  document.getElementById('downloadModal').addEventListener('click', (e) => {
    if (e.target.id === 'downloadModal') hideModal();
  });

  // Копирование пароля
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', copyPassword);
  });

  // Загрузка данных
  document.getElementById('downloadsHero').textContent = getDownloads().toLocaleString();
  loadReviews();
  loadPassword();

  // Эффекты
  initTilt();
  updateOnline();
  setInterval(updateOnline, 5000);

  // Smooth scroll для якорей
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Логирование для отладки
  console.log('%c⚡ TEST loaded', 'color:#8b5cf6;font-size:20px;font-weight:bold');
  console.log('Admin panel: /admin.html');
});
