import type { App } from '../index';
import { esc } from '../lib/helpers';
import { layout } from '../views/html';
export function registerLogsRoutes(app: App) {
app.get('/logs',async c=>{const rows:any[]=await c.env.DB.prepare('SELECT l.*,a.username FROM logs l LEFT JOIN admins a ON a.id=l.admin_id ORDER BY l.id DESC LIMIT 500').all().then(x=>x.results as any[]);return c.html(layout('Loglar',`<div class="card scroll"><table class="table"><tr><th>Tarih</th><th>Admin</th><th>Aksiyon</th><th>Detay</th></tr>${rows.map(x=>`<tr><td>${esc(x.created_at)}</td><td>${esc(x.username||'-')}</td><td>${esc(x.action)}</td><td>${esc(x.details||'')}</td></tr>`).join('')}</table></div>`))})
app.notFound(c=>c.html(layout('404',`<div class="card"><h2>404 — Sayfa bulunamadı</h2><p class="muted">İstediğin adres BotMaster içinde mevcut değil.</p><a class="btn" href="/">Dashboard'a dön</a></div>`),404))
}
