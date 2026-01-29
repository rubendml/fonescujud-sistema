// auth.js para admin
(function () {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    if (!token || rol !== 'admin') {
        window.location.href = '../public/login.html';
    }
})();
