// 1. Инициализируем подключение к вашей базе данных
const SUPABASE_URL = "https://supabase.co";
const SUPABASE_ANON_KEY = "ВСТАВЬТЕ_СЮДА_ВАШ_КЛЮЧ_ИЗ_БЛОКА_PUBLISHABLE_KEY";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Проверяем сессию через Supabase
async function checkUserSession() {
    const loginBtn = document.getElementById('nav-login-btn');
    if (!loginBtn) return;

    // Запрашиваем у Supabase текущего вошедшего пользователя
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        // Если пользователь найден — меняем кнопку на "КАБИНЕТ"
        loginBtn.innerText = "КАБИНЕТ";
        loginBtn.classList.add('logged-in');
    } else {
        // Если пользователя нет — кнопка "Вход"
        loginBtn.innerText = "Вход";
        loginBtn.classList.remove('logged-in');
    }
}

// 3. Обработка клика по кнопке
async function handleLoginClick() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        // Если авторизован — отправляем в личный кабинет
        window.location.href = "profile.html";
    } else {
        // Если не авторизован — на страницу входа
        window.location.href = "login.html";
    }
}

// Запускаем проверку при загрузке страницы
document.addEventListener("DOMContentLoaded", checkUserSession);
