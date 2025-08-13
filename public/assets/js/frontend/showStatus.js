// Função global para exibir mensagens de status no SENAI Lab
function showStatus(message, type = 'info') {
    // Cria ou seleciona o container de status
    let statusContainer = document.getElementById('statusContainer');
    if (!statusContainer) {
        statusContainer = document.createElement('div');
        statusContainer.id = 'statusContainer';
        statusContainer.style.position = 'fixed';
        statusContainer.style.top = '20px';
        statusContainer.style.left = '50%';
        statusContainer.style.transform = 'translateX(-50%)';
        statusContainer.style.zIndex = '9999';
        statusContainer.style.maxWidth = '400px';
        document.body.appendChild(statusContainer);
    }
    // Define cor e ícone
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        info: '#2196f3',
        warning: '#ff9800'
    };
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    // Cria mensagem
    const msgDiv = document.createElement('div');
    msgDiv.className = 'status-message';
    msgDiv.style.background = colors[type] || colors.info;
    msgDiv.style.color = '#fff';
    msgDiv.style.padding = '12px 18px';
    msgDiv.style.margin = '8px 0';
    msgDiv.style.borderRadius = '6px';
    msgDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
    msgDiv.style.fontSize = '1rem';
    msgDiv.style.display = 'flex';
    msgDiv.style.alignItems = 'center';
    msgDiv.innerHTML = `<span style="font-size:1.3em; margin-right:8px;">${icons[type] || icons.info}</span> ${message}`;
    statusContainer.appendChild(msgDiv);
    // Remove após 4 segundos
    setTimeout(() => {
        msgDiv.remove();
        if (statusContainer.childElementCount === 0) statusContainer.remove();
    }, 4000);
}
