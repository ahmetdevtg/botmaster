import { admin } from './auth';
export const esc = (s: any) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export async function tg(token: string, method: string, body?: any) {
  const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  try { return await r.json() as any; } catch { return { ok: false, description: 'Invalid Telegram response' }; }
}
export async function log(c: any, action: string, details = '') {
  const a = await admin(c);
  await c.env.DB.prepare('INSERT INTO logs(admin_id,action,details) VALUES(?,?,?)').bind(a?.id || null, action, details).run();
}
export const rid = () => crypto.randomUUID().replaceAll('-', '');
export const nowIso = () => new Date().toISOString();
