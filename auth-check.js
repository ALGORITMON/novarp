function checkAdminSession() {
    const loginBtn = document.getElementById('nav-login-btn');
    if (!loginBtn) return;

    // Проверяем, авторизован ли админ
    if (localStorage.getItem('nova_admin_session') === 'active') {
        loginBtn.innerText = "Выйти (Админ)";
        loginBtn.classList.add('logged-in');
    } else {
        loginBtn.innerText = "Вход";
        loginBtn.classList.remove('logged-in');
    }
}

// Что происходит при клике на кнопку в шапке
function handleLoginClick() {
    if (localStorage.getItem('nova_admin_session') === 'active') {
        // Если вошел — разлогиниваем
        if (confirm("Вы действительно хотите выйти из аккаунта администратора?")) {
            localStorage.removeItem('nova_admin_session');
            alert("Вы вышли из системы.");
            window.location.reload(); // Перезагружаем текущую страницу
        }
    } else {
        // Если не вошел — отправляем на страницу входа
        window.location.href = "login.html";
    }
}

// Запускаем проверку при загрузке каждой страницы
document.addEventListener("DOMContentLoaded", checkAdminSession);
