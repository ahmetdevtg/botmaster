# BotMaster
Cloudflare Workers + Hono + D1 Telegram bot management panel.

## Kurulum
1. wrangler.toml içindeki BURAYA_MEVCUT_BOTMASTER_D1_ID alanını mevcut botmaster-db Database ID ile değiştir.
2. schema.sql dosyasını botmaster-db SQL Console'da çalıştır.
3. GitHub repo içeriğini bu proje ile değiştir ve Cloudflare deployment başlat.
4. /login açıldığında ilk yönetici hesabını oluştur.

## Modüller
Dashboard, bot ekleme/silme/aktif-pasif, Telegram doğrulama, bot arama, kullanıcı listesi, toplu ana sayfa alanları, toplu duyuru, loglar.

Not: Bu sürüm temel üretim altyapısıdır. Telegram update/webhook worker akışı ve gelişmiş medya gönderimi sonraki kod paketine eklenebilir.
