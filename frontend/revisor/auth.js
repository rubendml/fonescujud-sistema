// auth.js para revisor
(function () {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    if (!token || rol !== 'revisor') {
        window.location.href = '../public/login.html';
    }
})();
