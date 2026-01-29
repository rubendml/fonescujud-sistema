// auth.js para revisor
(function () {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    if (!token || rol !== 'revisor') {
        window.location.href = '../login.html';
    }
})();

// Funcionalidad de cerrar sesión
window.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('rol');
            window.location.href = '../login.html';
        });
    }
});
