import type { App } from '../index';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { hash, admin, } from '../lib/auth';
import { rid } from '../lib/helpers';
import { loginPage, loginForm } from '../views/html';
export function registerAuthRoutes(app: App) {
app.get('/login',c=>c.html(loginPage()))
app.post('/login',async c=>{const f=await c.req.parseBody(),u=String(f.username||''),p=String(f.password||'');const a:any=await c.env.DB.prepare('SELECT * FROM admins WHERE username=?').bind(u).first();if(!a||a.password_hash!==await hash(p))return c.html(loginPage('Kullanıcı adı veya şifre hatalı'),401);const token=rid(),exp=new Date(Date.now()+7*864e5).toISOString();await c.env.DB.prepare('INSERT INTO sessions(token,admin_id,expires_at) VALUES(?,?,?)').bind(token,a.id,exp).run();setCookie(c,'bm_session',token,{httpOnly:true,secure:true,sameSite:'Lax',path:'/',maxAge:604800});return c.redirect('/')})
app.get('/setup',async c=>{const x:any=await c.env.DB.prepare('SELECT COUNT(*) n FROM admins').first();if(Number(x?.n)>0)return c.redirect('/login');return c.html(loginForm())})
app.post('/setup',async c=>{const x:any=await c.env.DB.prepare('SELECT COUNT(*) n FROM admins').first();if(Number(x?.n)>0)return c.redirect('/login');const f=await c.req.parseBody(),u=String(f.username||'').trim(),p=String(f.password||''),p2=String(f.password2||'');if(u.length<3||p.length<6||p!==p2)return c.html(loginForm(p!==p2?'Şifreler eşleşmiyor.': 'Kullanıcı en az 3, şifre en az 6 karakter olmalı'),400);await c.env.DB.prepare('INSERT INTO admins(username,password_hash) VALUES(?,?)').bind(u,await hash(p)).run();return c.redirect('/login')})
app.get('/logout',c=>{deleteCookie(c,'bm_session',{path:'/'});return c.redirect('/login')})
}
