// Validação simples do formulário SENAI Lab
function validateForm() {
    const form = document.getElementById('senaiForm');
    if (!form) return false;
    let valid = true;
    // Verifica todos os campos obrigatórios visíveis e habilitados
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
        const parent = field.closest('.form-group, .service-section');
        const isVisible = parent && window.getComputedStyle(parent).display !== 'none' && !field.disabled;
        if (isVisible) {
            if (field.type === 'file') {
                if (!field.files || field.files.length === 0) valid = false;
            } else if (field.type === 'checkbox') {
                if (!field.checked) valid = false;
            } else if (field.type === 'date' || field.type === 'time') {
                // Permite que o campo seja vazio para não bloquear o seletor
                // Só valida se o campo for realmente obrigatório e estiver visível
                if (field.required && field.value.trim() === '') valid = false;
            } else {
                if (field.value.trim() === '') valid = false;
            }
        }
    });
    if (!valid) {
        showStatus('Preencha todos os campos obrigatórios!', 'error');
    }
    return valid;
}
