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

// 🔄 TOGGLE MONITOR DE USO
window.toggleUsageMonitor = function() {
  const monitor = document.getElementById('usageMonitor');
  if (monitor) {
    monitor.style.display = monitor.style.display === 'none' ? 'block' : 'none';
  }
};


// 🎉 TELA DE SUCESSO
function showSuccessScreen(docId) {
  const formContentEl = document.getElementById('formContent');
  const successMessageEl = document.getElementById('successMessage');
  const submissionIdEl = document.getElementById('submissionId');
  
  if (!formContentEl || !successMessageEl) {
    console.error('❌ Elementos não encontrados!');
    return;
  }
  
  // GARANTIR que success-message está fora do formContent
  const container = document.querySelector('.container');
  if (container && successMessageEl.parentElement === formContentEl) {
    container.appendChild(successMessageEl);
  }
  
  formContentEl.style.display = 'none';
  successMessageEl.classList.add('show');
  
  // Forçar display via JavaScript como fallback
  successMessageEl.style.display = 'block';
  successMessageEl.style.visibility = 'visible';
  successMessageEl.style.opacity = '1';
  
  if (submissionIdEl) {
    submissionIdEl.textContent = `ID: ${docId}`;
  }
  
  // Scroll até o elemento
  setTimeout(() => {
    successMessageEl.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }, 100);

  const stats = JSON.parse(localStorage.getItem('senaiStats') || '{}');
  stats.totalSubmissions = (stats.totalSubmissions || 0) + 1;
  stats.lastSubmission = Date.now();
  localStorage.setItem('senaiStats', JSON.stringify(stats));
}
