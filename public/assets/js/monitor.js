/* 🔧 SENAI Lab - Monitor de Uso e Status
 * Arquivo: public/assets/js/monitor.js
 * Descrição: Sistema de monitoramento de uso e indicadores de status
 */

// 📊 MONITOR DE USO
const usageMonitor = {
  dailyWrites: parseInt(localStorage.getItem('dailyWrites') || '0'),
  dailyUploads: parseInt(localStorage.getItem('dailyUploads') || '0'),
  lastReset: localStorage.getItem('lastReset') || new Date().toDateString(),

  reset() {
    const today = new Date().toDateString();
    if (this.lastReset !== today) {
      this.dailyWrites = 0;
      this.dailyUploads = 0;
      this.lastReset = today;
      this.save();
    }
  },

  save() {
    localStorage.setItem('dailyWrites', this.dailyWrites.toString());
    localStorage.setItem('dailyUploads', this.dailyUploads.toString());
    localStorage.setItem('lastReset', this.lastReset);
  },

  addWrite() {
    this.reset();
    this.dailyWrites++;
    this.save();
  },

  addUpload() {
    this.reset();
    this.dailyUploads++;
    this.save();
  }
};

// 📊 MONITOR DE USO
function updateUsageMonitor() {
  usageMonitor.reset();
  document.getElementById('writesCount').textContent = `${usageMonitor.dailyWrites} / 20k`;
  document.getElementById('uploadsCount').textContent = `${usageMonitor.dailyUploads} uploads`;
}

function toggleUsageMonitor() {
  const monitor = document.getElementById('usageMonitor');
  const button = document.querySelector('.toggle-monitor');

  if (monitor.classList.contains('show')) {
    monitor.classList.remove('show');
    button.style.display = 'block';
  } else {
    monitor.classList.add('show');
    button.style.display = 'none';
    updateUsageMonitor();
  }
}

// 📢 MOSTRAR STATUS
function showStatus(message, type = 'info') {
  const indicator = document.getElementById('statusIndicator');
  indicator.textContent = message;
  indicator.className = `status-indicator ${type} show`;

  setTimeout(() => {
    indicator.classList.remove('show');
  }, 4000);
}

// 🎉 TELA DE SUCESSO
function showSuccessScreen(docId) {
  document.getElementById('formContent').style.display = 'none';
  document.getElementById('successMessage').classList.add('show');
  document.getElementById('submissionId').textContent = `ID: ${docId}`;

  const stats = JSON.parse(localStorage.getItem('senaiStats') || '{}');
  stats.totalSubmissions = (stats.totalSubmissions || 0) + 1;
  stats.lastSubmission = Date.now();
  localStorage.setItem('senaiStats', JSON.stringify(stats));
}
