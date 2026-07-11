const ADMIN_PASSWORD = 'admin'; // ⚠️ СМЕНИ ПАРОЛЬ!

// ============ LOGIN ============
function login() {
  const pass = document.getElementById('adminPass').value;
  if (pass === ADMIN_PASSWORD) {
    sessionStorage.setItem('test_admin', '1');
    showPanel();
  } else {
    showNotification('❌ Wrong password!');
  }
}

function logout() {
  sessionStorage.removeItem('test_admin');
  document.getElementById('adminPanel').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('adminPass').value = '';
}

function showPanel() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('adminPanel').classList.remove('hidden');
  loadAll();
}

// ============ TABS ============
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('tab')) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    e.target.classList.add('active');
    document.getElementById('tab-' + e.target.dataset.tab).classList.remove('hidden');
  }
});

// ============ PASSWORD ============
function savePassword() {
  const val = document.getElementById('cfgPassword').value.trim();
  if (!val) return showNotification('❌ Enter password');
  localStorage.setItem('test_password', val);
  showNotification('✓ Password saved!');
}

function loadPassword() {
  const stored = localStorage.getItem('test_password');
  if (stored) document.getElementById('cfgPassword').value = stored;
}

// ============ DOWNLOAD CONFIG ============
function saveDownload() {
  const config = {
    url: document.getElementById('cfgFileUrl').value.trim() || 'test.exe',
    name: document.getElementById('cfgFileName').value.trim() || 'test.zip',
    size: document.getElementById('cfgFileSize').value.trim() || '24 MB'
  };
  localStorage.setItem('test_download_config', JSON.stringify(config));
  showNotification('✓ Download config saved!');
}

function loadDownload() {
  const stored = localStorage.getItem('test_download_config');
  if (stored) {
    try {
      const c = JSON.parse(stored);
      document.getElementById('cfgFileUrl').value = c.url || '';
      document.getElementById('cfgFileName').value = c.name || '';
      document.getElementById('cfgFileSize').value = c.size || '';
    } catch(e) {}
  }
}

// ============ REVIEWS ============
function getReviews() {
  const stored = localStorage.getItem('test_reviews');
  if (stored) {
    try { return JSON.parse(stored); } catch(e) { return null; }
  }
  return null;
}

function addReview() {
  const name = document.getElementById('revName').value.trim();
  const text = document.getElementById('revText').value.trim();
  const rating = parseInt(document.getElementById('revRating').value) || 5;
  const avatar = document.getElementById('revAvatar').value.trim() || '⭐';

  if (!name || !text) return showNotification('❌ Fill name and text');

  let reviews = getReviews() || [];
  reviews.unshift({
    name, text, rating, avatar,
    date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  });

  localStorage.setItem('test_reviews', JSON.stringify(reviews));
  showNotification('✓ Review added!');
  renderReviewList();

  // clear
  document.getElementById('revName').value = '';
  document.getElementById('revText').value = '';
  document.getElementById('revAvatar').value = '';
}

function deleteReview(idx) {
  let reviews = getReviews() || [];
  reviews.splice(idx, 1);
  if (reviews.length === 0) {
    localStorage.removeItem('test_reviews');
  } else {
    localStorage.setItem('test_reviews', JSON.stringify(reviews));
  }
  renderReviewList();
  showNotification('✓ Review deleted');
}

function resetReviews() {
  if (confirm('Reset to default reviews?')) {
    localStorage.removeItem('test_reviews');
    renderReviewList();
    showNotification('✓ Reviews reset');
  }
}

function renderReviewList() {
  const reviews = getReviews();
  const list = document.getElementById('reviewList');
  if (!reviews || reviews.length === 0) {
    list.innerHTML = '<p style="color:var(--text-dim);text-align:center;padding:20px">No custom reviews. Site will show default ones.</p>';
    return;
  }
  list.innerHTML = '';
  reviews.forEach((r, i) => {
    const div = document.createElement('div');
    div.className = 'review-item';
    div.innerHTML = `
      <div style="font-size:1.5rem">${r.avatar || '⭐'}</div>
      <div class="review-item-info">
        <strong>${escapeHtml(r.name)}</strong>
        <div style="color:var(--text-dim);font-size:.85rem">${escapeHtml(r.text.substring(0, 60))}${r.text.length > 60 ? '...' : ''}</div>
      </div>
      <button class="btn-del" onclick="deleteReview(${i})">Delete</button>
    `;
    list.appendChild(div);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============ STATS ============
function loadStats() {
  const dl = parseInt(localStorage.getItem('test_downloads') || '0');
  const reviews = getReviews() || [];
  document.getElementById('statDownloads').textContent = dl.toLocaleString();
  document.getElementById('statReviews').textContent = reviews.length;
}

function resetStats() {
  if (confirm('Reset all stats?')) {
    localStorage.removeItem('test_downloads');
    loadStats();
    showNotification('✓ Stats reset');
  }
}

// ============ INIT ============
function loadAll() {
  loadPassword();
  loadDownload();
  renderReviewList();
  loadStats();
}

document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('test_admin')) {
    showPanel();
  }

  document.getElementById('adminPass').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
  });

  // Notification helper
  window.showNotification = function(text) {
    const notif = document.getElementById('notification');
    document.getElementById('notifText').textContent = text;
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 3000);
  };
});

console.log('%c⚡ TEST Admin loaded', 'color:#8b5cf6;font-size:16px;font-weight:bold');
