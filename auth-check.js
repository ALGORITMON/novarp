// auth-check.js

async function isUserLoggedIn() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return !!session;
}

async function setupNavLoginButton() {
    const btn = document.getElementById('nav-login-btn');
    if (!btn) return;

    btn.onclick = null;

    const loggedIn = await isUserLoggedIn();

    if (loggedIn) {
        btn.textContent = 'Профиль';
        btn.onclick = () => { window.location.href = 'profile.html'; };
    } else {
        btn.textContent = 'Вход';
        btn.onclick = () => { window.location.href = 'login.html'; };
    }
}

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', setupNavLoginButton);