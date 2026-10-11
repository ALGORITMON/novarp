// supabase-cache.js — кэш и обёртки над supabaseClient

// === Кэш в localStorage с TTL ===
const NovaCache = {
    set(key, data, ttlMinutes = 10) {
        try {
            localStorage.setItem('nova_cache_' + key, JSON.stringify({
                data,
                expires: Date.now() + ttlMinutes * 60 * 1000
            }));
        } catch (e) { console.warn('cache set error', e); }
    },
    get(key) {
        try {
            const raw = localStorage.getItem('nova_cache_' + key);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (Date.now() > parsed.expires) {
                localStorage.removeItem('nova_cache_' + key);
                return null;
            }
            return parsed.data;
        } catch (e) { return null; }
    },
    clear(key) {
        localStorage.removeItem('nova_cache_' + key);
    },
    clearAll() {
        Object.keys(localStorage)
            .filter(k => k.startsWith('nova_cache_'))
            .forEach(k => localStorage.removeItem(k));
    }
};

// === Обёртка с таймаутом ===
function withTimeout(promise, ms = 10000) {
    return Promise.race([
        promise,
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Превышено время ожидания')), ms)
        )
    ]);
}

// === Прогрев Supabase при загрузке страницы ===
// Делает 1 лёгкий запрос, чтобы БД "проснулась" до основных запросов
async function warmupSupabase() {
    try {
        await withTimeout(
            supabaseClient.from('forum_categories').select('id').limit(1),
            12000
        );
    } catch (e) {
        console.warn('Warmup failed:', e.message);
    }
}

// === Загрузка категорий с кэшем ===
async function getCategoriesCached() {
    const cached = NovaCache.get('categories');
    if (cached) return cached;

    const { data, error } = await withTimeout(
        supabaseClient.from('forum_categories').select('*').order('sort_order')
    );
    if (error) throw error;

    NovaCache.set('categories', data, 30); // 30 минут
    return data;
}

// === Загрузка своего профиля с кэшем ===
async function getMyProfileCached() {
    const cached = NovaCache.get('my_profile');
    if (cached) return cached;

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return null;

    const { data, error } = await withTimeout(
        supabaseClient
            .from('profiles')
            .select('username, site_role, avatar_url')
            .eq('id', session.user.id)
            .single()
    );
    if (error) return null;

    NovaCache.set('my_profile', data, 15); // 15 минут
    return data;
}

// === Очистка кэша при выходе/входе ===
supabaseClient.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        NovaCache.clearAll();
    }
});