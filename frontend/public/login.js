// login.js
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    const usuario = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(${API_BASE_URL}/auth/login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, password })
        });
        const data = await response.json();
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('rol', data.rol);
            // Redirigir seg�n el rol
            if (data.rol === 'admin') {
                // Detectar si estamos en GitHub Pages y agregar la ruta base si es necesario
                const basePath = window.location.hostname === 'rubendml.github.io' ? '/fonescujud-sistema/' : '/';
                window.location.href = basePath + 'admin/';
            } else if (data.rol === 'revisor') {
                const basePath = window.location.hostname === 'rubendml.github.io' ? '/fonescujud-sistema/' : '/';
                window.location.href = basePath + 'revisor/';
            } else {
                loginError.textContent = 'Rol no autorizado.';
                loginError.style.display = 'block';
            }
        } else {
            loginError.textContent = data.error || 'Credenciales incorrectas';
            loginError.style.display = 'block';
        }
    } catch (err) {
        loginError.textContent = 'Error de conexi�n con el servidor';
        loginError.style.display = 'block';
    }
});
