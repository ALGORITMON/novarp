// supabase.js
const SUPABASE_URL = 'https://xucgexdpbjxrszxzmoti.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_luFbMKTfqpKCNqzT4Zy3CA_uFE8ucva';

// UMD-версия — работает без сборщика, просто через глобальную переменную
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);