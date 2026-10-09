import { getCookie } from 'hono/cookie';
export async function hash(s: string) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}
export async function admin(c: any) {
  const t = getCookie(c, 'bm_session');
  if (!t) return null;
  return await c.env.DB.prepare('SELECT a.* FROM sessions s JOIN admins a ON a.id=s.admin_id WHERE s.token=? AND s.expires_at>?').bind(t, new Date().toISOString()).first();
}
