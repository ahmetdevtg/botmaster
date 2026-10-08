# BotMaster 3.0
Cloudflare Workers + Hono + D1 ile Telegram bot yönetim paneli.

## Kurulum
1. `wrangler.toml` içindeki `BURAYA_BOTMASTER_D1_DATABASE_ID` değerini Cloudflare D1 `botmaster-db` Database ID ile değiştir.
2. `schema.sql` içeriğini D1 SQL Console'da bir kez çalıştır.
3. GitHub reposunun içeriğini bu klasörle tamamen değiştir.
4. Cloudflare Worker'ın build/deploy ayarlarında `npm install` ve `npm run deploy` kullanabilir veya Git entegrasyonundan deploy edebilirsin.
5. Worker açıldıktan sonra `/setup` adresine POST ile ilk admin oluşturulabilir. En kolay yöntem D1 Console'da `admins` tablosuna kayıt eklemek değildir; geçici olarak `/setup` formunu kullanmak için HTML form gerekir. API/CLI ile: `curl -X POST -d 'username=admin&password=guclu-sifre' https://DOMAIN/setup`.

## Önemli
- Bot tokenlarını ChatGPT'ye gönderme; panel içine gir.
- `wrangler.toml` içindeki D1 ID gerçek ID olmalıdır.
- Bu sürüm tek `src/index.ts` ile çalışır; endpoint ve HTML aynı dosyada olduğundan eski proje dosyalarıyla karıştırılmamalıdır.
- Telegram kullanıcılarının otomatik oluşması için Telegram webhook/update ingestion katmanı ayrıca eklenmelidir; mevcut panel kayıtlı kullanıcılarla yayın yapar.
