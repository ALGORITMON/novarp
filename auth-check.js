function checkAdminSession() {
    const loginBtn = document.getElementById('nav-login-btn');
    if (!loginBtn) return;

    // Проверяем, авторизован ли админ
    if (localStorage.getItem('nova_admin_session') === 'active') {
        loginBtn.innerText = "КАБИНЕТ";
        loginBtn.classList.add('logged-in');
    } else {
        loginBtn.innerText = "ВХОД";
        loginBtn.classList.remove('logged-in');
    }
}

// Что происходит при клике на кнопку в шапке
function handleLoginClick() {
    if (localStorage.getItem('nova_admin_session') === 'active') {
        // Если авторизован — перенаправляем в личный кабинет / профиль
        window.location.href = "profile.html"; 
    } else {
        // Если не авторизован — отправляем на страницу входа
        window.location.href = "login.html";
    }
}

// Запускаем проверку при загрузке каждой страницы
document.addEventListener("DOMContentLoaded", checkAdminSession);
