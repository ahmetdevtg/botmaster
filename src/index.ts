import { Hono } from "hono";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

const ADMIN_USER = "admin";
const ADMIN_PASS = "BotMaster123!";

function isLoggedIn(c: any) {
  return getCookie(c, "botmaster_session") === "logged_in";
}

async function telegram(token: string, method: string) {
  const response = await fetch(
    `https://api.telegram.org/bot${token}/${method}`
  );
  const data: any = await response.json();

  if (!data.ok) {
    throw new Error(data.description || "Telegram API hatası");
  }

  return data.result;
}

function escapeHtml(value: string) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

app.get("/login", (c) => {
  if (isLoggedIn(c)) {
    return c.redirect("/");
  }

  return c.html(`
<!DOCTYPE html>
<html lang="tr">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BotMaster Login</title>

<style>
*{box-sizing:border-box}

body{
margin:0;
min-height:100vh;
display:flex;
align-items:center;
justify-content:center;
background:#0f172a;
font-family:Arial,sans-serif;
color:white;
}

.login{
width:92%;
max-width:420px;
background:#1e293b;
padding:35px;
border-radius:20px;
border:1px solid #334155;
}

.logo{
text-align:center;
font-size:30px;
font-weight:800;
margin-bottom:8px;
}

.sub{
text-align:center;
color:#94a3b8;
margin-bottom:30px;
}

input{
width:100%;
padding:14px;
margin-bottom:15px;
border-radius:10px;
border:1px solid #475569;
background:#0f172a;
color:white;
}

button{
width:100%;
padding:14px;
border:0;
border-radius:10px;
background:#2563eb;
color:white;
font-weight:bold;
cursor:pointer;
}
.error{
background:#7f1d1d;
padding:12px;
border-radius:10px;
margin-bottom:15px;
color:#fecaca;
}
</style>
</head>

<body>

<div class="login">

<div class="logo">🤖 BotMaster</div>

<div class="sub">
Telegram Bot Management Panel
</div>

${
  new URL(c.req.url).searchParams.get("error")
    ? `<div class="error">Kullanıcı adı veya şifre yanlış.</div>`
    : ""
}

<form method="POST" action="/login">

<input
name="username"
placeholder="Kullanıcı adı"
required
>

<input
name="password"
type="password"
placeholder="Şifre"
required
>

<button type="submit">
Giriş Yap
</button>

</form>

</div>

</body>
</html>
`);
});

app.post("/login", async (c) => {

  const body = await c.req.parseBody();

  const username = String(body.username || "");
  const password = String(body.password || "");

  if (
    username !== ADMIN_USER ||
    password !== ADMIN_PASS
  ) {
    return c.redirect("/login?error=1");
  }

  setCookie(c, "botmaster_session", "logged_in", {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return c.redirect("/");
});

app.get("/logout", (c) => {

  deleteCookie(c, "botmaster_session", {
    path: "/"
  });

  return c.redirect("/login");
});
app.get("/", async (c) => {

  if (!isLoggedIn(c)) {
    return c.redirect("/login");
  }

  const totalBots = await c.env.DB
    .prepare("SELECT COUNT(*) AS count FROM bots")
    .first<{ count: number }>();

  const activeBots = await c.env.DB
    .prepare("SELECT COUNT(*) AS count FROM bots WHERE status = 1")
    .first<{ count: number }>();

  const totalUsers = await c.env.DB
    .prepare("SELECT COUNT(*) AS count FROM telegram_users")
    .first<{ count: number }>();

  const todayUsers = await c.env.DB
    .prepare(`
      SELECT COUNT(*) AS count
      FROM telegram_users
      WHERE date(first_seen) = date('now')
    `)
    .first<{ count: number }>();

  const bots = await c.env.DB
    .prepare(`
      SELECT
        b.id,
        b.name,
        b.username,
        b.status,
        COUNT(u.id) AS user_count
      FROM bots b
      LEFT JOIN telegram_users u
        ON u.bot_id = b.id
      GROUP BY b.id
      ORDER BY b.id DESC
    `)
    .all();

  const botRows = (bots.results || [])
    .map((bot: any) => `
      <tr>
        <td>${bot.id}</td>

        <td>
          <strong>
            ${escapeHtml(bot.name || "-")}
          </strong>
        </td>

        <td>
          ${
            bot.username
              ? "@" + escapeHtml(bot.username)
              : "-"
          }
        </td>

        <td>
          ${bot.user_count || 0}
        </td>

        <td>
          <span class="${bot.status ? "online" : "offline"}">
            ${bot.status ? "● Aktif" : "● Pasif"}
          </span>
        </td>

        <td>
          <a
            class="btn small"
            href="/bots/${bot.id}"
          >
            Detay
          </a>
        </td>
      </tr>
    `)
    .join("");

  return c.html(`
<!DOCTYPE html>

<html lang="tr">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width,initial-scale=1"
>

<title>BotMaster Dashboard</title>

<style>

*{
box-sizing:border-box;
}

body{
margin:0;
font-family:Arial,sans-serif;
background:#0f172a;
color:#fff;
}

.header{
height:70px;
background:#111827;
border-bottom:1px solid #1e293b;
display:flex;
align-items:center;
justify-content:space-between;
padding:0 25px;
}

.logo{
font-size:25px;
font-weight:800;
}

.logout{
color:#fca5a5;
text-decoration:none;
}

.container{
max-width:1400px;
margin:auto;
padding:30px 20px;
}

.top{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:25px;
gap:15px;
flex-wrap:wrap;
}

.title{
font-size:28px;
font-weight:800;
}

.btn{
display:inline-block;
padding:11px 16px;
border-radius:9px;
background:#2563eb;
color:white;
text-decoration:none;
font-weight:bold;
border:0;
cursor:pointer;
}

.btn.small{
padding:8px 12px;
font-size:13px;
}

.cards{
display:grid;
grid-template-columns:
repeat(auto-fit,minmax(220px,1fr));
gap:18px;
margin-bottom:30px;
}

.card{
background:#1e293b;
border:1px solid #334155;
border-radius:16px;
padding:22px;
}

.label{
color:#94a3b8;
font-size:14px;
}

.number{
font-size:34px;
font-weight:800;
margin-top:10px;
}

.online{
color:#86efac;
}

.offline{
color:#fca5a5;
}

.tablebox{
background:#1e293b;
border:1px solid #334155;
border-radius:16px;
overflow:auto;
}

table{
width:100%;
border-collapse:collapse;
min-width:700px;
}

th,td{
padding:15px;
border-bottom:1px solid #334155;
text-align:left;
}

th{
color:#94a3b8;
font-size:13px;
}

</style>

</head>

<body>
<header class="header">

  <div class="logo">
    🤖 BotMaster
  </div>

  <a class="logout" href="/logout">
    Çıkış Yap
  </a>

</header>

<main class="container">

  <div class="top">

    <div class="title">
      Dashboard
    </div>

    <a class="btn" href="/bots/add">
      + Bot Ekle
    </a>

  </div>

  <div class="cards">

    <div class="card">
      <div class="label">
        Toplam Bot
      </div>

      <div class="number">
        ${totalBots?.count || 0}
      </div>
    </div>

    <div class="card">
      <div class="label">
        Aktif Bot
      </div>

      <div class="number">
        ${activeBots?.count || 0}
      </div>
    </div>

    <div class="card">
      <div class="label">
        Toplam Kullanıcı
      </div>

      <div class="number">
        ${totalUsers?.count || 0}
      </div>
    </div>

    <div class="card">
      <div class="label">
        Bugünkü Kullanıcı
      </div>

      <div class="number">
        ${todayUsers?.count || 0}
      </div>
    </div>

  </div>

  <div class="tablebox">

    <table>

      <thead>

        <tr>
          <th>ID</th>
          <th>Bot</th>
          <th>Kullanıcı Adı</th>
          <th>Kullanıcı</th>
          <th>Durum</th>
          <th>İşlem</th>
        </tr>

      </thead>

      <tbody>

        ${botRows || `
          <tr>
            <td colspan="6">
              Henüz bot eklenmemiş.
            </td>
          </tr>
        `}

      </tbody>

    </table>

  </div>

</main>

</body>

</html>
`);

});
app.get("/bots/add", (c) => {

  if (!isLoggedIn(c)) {
    return c.redirect("/login");
  }

  return c.html(`
<!DOCTYPE html>

<html lang="tr">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width,initial-scale=1"
>

<title>Bot Ekle - BotMaster</title>

<style>

*{
box-sizing:border-box;
}

body{
margin:0;
background:#0f172a;
color:white;
font-family:Arial,sans-serif;
}

.container{
max-width:700px;
margin:50px auto;
padding:20px;
}

.box{
background:#1e293b;
border:1px solid #334155;
border-radius:18px;
padding:30px;
}

h1{
margin-top:0;
}

.back{
display:inline-block;
margin-bottom:20px;
color:#93c5fd;
text-decoration:none;
}

label{
display:block;
margin:18px 0 8px;
color:#cbd5e1;
}

input{
width:100%;
padding:14px;
background:#0f172a;
border:1px solid #475569;
border-radius:10px;
color:white;
}

button{
margin-top:25px;
width:100%;
padding:14px;
background:#2563eb;
border:0;
border-radius:10px;
color:white;
font-weight:bold;
cursor:pointer;
}

.error{
background:#7f1d1d;
padding:12px;
border-radius:10px;
margin-bottom:15px;
}

</style>

</head>

<body>

<div class="container">

<a class="back" href="/">
← Dashboard
</a>

<div class="box">

<h1>🤖 Bot Ekle</h1>

${
  new URL(c.req.url).searchParams.get("error")
    ? `
      <div class="error">
        Bot eklenirken hata oluştu.
        Token'ı kontrol et.
      </div>
    `
    : ""
}

<form method="POST" action="/bots/add">

<label>
Telegram Bot Token
</label>

<input
name="token"
type="password"
placeholder="Telegram Bot Token"
required
>

<button type="submit">
Telegram'dan Botu Getir ve Ekle
</button>

</form>

</div>

</div>

</body>

</html>
`);
});
app.post("/bots/add", async (c) => {

  if (!isLoggedIn(c)) {
    return c.redirect("/login");
  }

  const body = await c.req.parseBody();

  const token = String(body.token || "").trim();

  if (!token) {
    return c.redirect("/bots/add?error=1");
  }

  try {

    const me: any = await telegram(
      token,
      "getMe"
    );

    const telegramId = Number(me.id);

    const username = me.username || "";

    const name =
      me.first_name ||
      me.username ||
      "Telegram Bot";

    const existing = await c.env.DB
      .prepare(`
        SELECT id
        FROM bots
        WHERE token = ?
      `)
      .bind(token)
      .first();

    if (existing) {
      return c.redirect(
        "/bots/add?error=1"
      );
    }

    await c.env.DB
      .prepare(`
        INSERT INTO bots
        (
          name,
          username,
          token,
          telegram_id,
          status,
          description
        )
        VALUES (?, ?, ?, ?, 1, ?)
      `)
      .bind(
        name,
        username,
        token,
        telegramId,
        ""
      )
      .run();

    return c.redirect("/");

  } catch (error) {

    return c.redirect(
      "/bots/add?error=1"
    );

  }

});
app.get("/bots/:id", async (c) => {

  if (!isLoggedIn(c)) {
    return c.redirect("/login");
  }

  const id = Number(
    c.req.param("id")
  );

  const bot: any = await c.env.DB
    .prepare(`
      SELECT *
      FROM bots
      WHERE id = ?
    `)
    .bind(id)
    .first();

  if (!bot) {
    return c.text(
      "Bot bulunamadı",
      404
    );
  }

  const users: any = await c.env.DB
    .prepare(`
      SELECT COUNT(*) AS count
      FROM telegram_users
      WHERE bot_id = ?
    `)
    .bind(id)
    .first();

  return c.html(`
<!DOCTYPE html>

<html lang="tr">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width,initial-scale=1"
>

<title>
${escapeHtml(bot.name)} - BotMaster
</title>

<style>

*{
box-sizing:border-box;
}

body{
margin:0;
background:#0f172a;
color:white;
font-family:Arial,sans-serif;
}

.container{
max-width:900px;
margin:auto;
padding:30px 20px;
}

.back{
color:#93c5fd;
text-decoration:none;
}

.box{
margin-top:20px;
background:#1e293b;
border:1px solid #334155;
border-radius:18px;
padding:25px;
}

.row{
padding:15px 0;
border-bottom:
1px solid #334155;
}

.label{
color:#94a3b8;
font-size:13px;
margin-bottom:5px;
}

.value{
font-size:17px;
word-break:break-word;
}

.online{
color:#86efac;
}

.offline{
color:#fca5a5;
}

.actions{
display:flex;
gap:10px;
flex-wrap:wrap;
margin-top:25px;
}

button{
padding:11px 16px;
border:0;
border-radius:9px;
cursor:pointer;
color:white;
font-weight:bold;
}

.green{
background:#16a34a;
}

.red{
background:#dc2626;
}

.delete{
background:#7f1d1d;
}

</style>

</head>

<body>

<div class="container">

<a class="back" href="/">
← Dashboard
</a>

<div class="box">

<h1>
🤖 ${escapeHtml(bot.name)}
</h1>

<div class="row">

<div class="label">
Bot Username
</div>

<div class="value">

${
  bot.username
    ? "@" + escapeHtml(bot.username)
    : "-"
}

</div>

</div>

<div class="row">

<div class="label">
Telegram ID
</div>

<div class="value">
${bot.telegram_id || "-"}
</div>

</div>

<div class="row">

<div class="label">
Kullanıcı Sayısı
</div>

<div class="value">
${users?.count || 0}
</div>

</div>

<div class="row">

<div class="label">
Durum
</div>

<div class="value ${
    bot.status
      ? "online"
      : "offline"
  }">

${
  bot.status
    ? "● Aktif"
    : "● Pasif"
}

</div>

</div>

<div class="row">

<div class="label">
Webhook
</div>

<div class="value">

${
  bot.webhook_url
    ? escapeHtml(bot.webhook_url)
    : "Ayarlanmadı"
}

</div>

</div>

<div class="row">

<div class="label">
Eklenme Tarihi
</div>

<div class="value">
${bot.created_at}
</div>

</div>

<div class="actions">
<form
method="POST"
action="/bots/${bot.id}/toggle"
>

<button class="${
  bot.status
    ? "red"
    : "green"
}">
${
  bot.status
    ? "Botu Pasifleştir"
    : "Botu Aktifleştir"
}
</button>

</form>

<form
method="POST"
action="/bots/${bot.id}/delete"
onsubmit="
return confirm('Bu bot silinsin mi?')
"
>

<button class="delete">
Botu Sil
</button>

</form>

</div>

</div>

</div>

</body>

</html>
`);

});
app.post("/bots/:id/toggle", async (c) => {

  if (!isLoggedIn(c)) {
    return c.redirect("/login");
  }

  const id = Number(
    c.req.param("id")
  );

  await c.env.DB
    .prepare(`
      UPDATE bots
      SET
        status = CASE
          WHEN status = 1 THEN 0
          ELSE 1
        END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    .bind(id)
    .run();

  return c.redirect(
    `/bots/${id}`
  );
});
app.post("/bots/:id/delete", async (c) => {

  if (!isLoggedIn(c)) {
    return c.redirect("/login");
  }

  const id = Number(
    c.req.param("id")
  );

  await c.env.DB
    .prepare(`
      DELETE FROM bots
      WHERE id = ?
    `)
    .bind(id)
    .run();

  return c.redirect("/");
});

app.get("/api/health", async (c) => {

  try {

    const result = await c.env.DB
      .prepare(`
        SELECT 1 AS ok
      `)
      .first<{ ok: number }>();

    return c.json({
      success: true,
      database: result?.ok === 1
    });

  } catch (error) {

    return c.json({
      success: false,
      database: false,
      error: "Database connection failed"
    }, 500);

  }

});

export default app;