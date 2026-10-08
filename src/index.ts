import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BotMaster</title>
<style>
*{box-sizing:border-box}
body{
  margin:0;
  font-family:Arial,sans-serif;
  background:#0f172a;
  color:#fff;
}
.container{
  max-width:1100px;
  margin:0 auto;
  padding:40px 20px;
}
.logo{
  font-size:32px;
  font-weight:800;
  margin-bottom:10px;
}
.sub{
  color:#94a3b8;
  margin-bottom:35px;
}
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:18px;
}
.card{
  background:#1e293b;
  border:1px solid #334155;
  border-radius:16px;
  padding:24px;
}
.number{
  font-size:32px;
  font-weight:800;
  margin-top:8px;
}
.label{
  color:#94a3b8;
}
.status{
  display:inline-block;
  margin-top:25px;
  padding:8px 12px;
  border-radius:8px;
  background:#14532d;
  color:#86efac;
}
</style>
</head>
<body>
<div class="container">
  <div class="logo">🤖 BotMaster</div>
  <div class="sub">Telegram Bot Management Platform</div>

  <div class="grid">
    <div class="card">
      <div class="label">Toplam Bot</div>
      <div class="number">0</div>
    </div>

    <div class="card">
      <div class="label">Aktif Bot</div>
      <div class="number">0</div>
    </div>

    <div class="card">
      <div class="label">Toplam Kullanıcı</div>
      <div class="number">0</div>
    </div>

    <div class="card">
      <div class="label">Bugünkü Kullanıcı</div>
      <div class="number">0</div>
    </div>
  </div>

  <div class="status">● BotMaster sistemi çalışıyor</div>
</div>
</body>
</html>
  `);
});

app.get("/api/health", async (c) => {
  try {
    const result = await c.env.DB
      .prepare("SELECT 1 AS ok")
      .first();

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