/**
 * HORECA Prospection - JavaScript
 */

// Confirmation suppression
document.querySelectorAll('[data-confirm]').forEach(element => {
    element.addEventListener('click', function(e) {
        if (!confirm(this.dataset.confirm)) {
            e.preventDefault();
        }
    });
});

// Auto-hide alerts
document.querySelectorAll('.alert').forEach(alert => {
    setTimeout(() => {
        alert.style.transition = 'opacity 0.3s';
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
});

// Recherche en temps réel (si nécessaire)
const searchInput = document.querySelector('[name="search"]');
if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            // this.form.submit(); // Décommenter pour auto-submit
        }, 500);
    });
}

console.log('✅ HORECA Prospection loaded');

