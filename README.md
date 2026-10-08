# BotMaster 4.0
Cloudflare Workers + Hono + D1 Telegram bot management panel.

## Kurulum
1. `wrangler.toml` içindeki `BURAYA_BOTMASTER_D1_DATABASE_ID` değerini kendi botmaster-db ID'n ile değiştir.
2. `schema.sql` dosyasını D1 SQL Console'da bir kez çalıştır.
3. GitHub'a tüm proje dosyalarını yükle.
4. Build/deploy command: `npx wrangler deploy`
5. Worker açıldıktan sonra `/setup` adresinden ilk admin hesabını oluştur.

## Dahil olanlar
- Dashboard
- Bot ekleme / silme / aktif-pasif
- **Toplu bot ekleme** (satır satır token)
- Telegram `getMe` doğrulama
- Bot bilgilerini yenileme
- Online/offline kontrolü
- Webhook set/sil
- Start / ana sayfa mesajı
- Fotoğraf/video file_id
- Inline URL butonu
- Toplu ana sayfa güncelleme; yalnızca doldurulan ana sayfa alanlarını değiştirir
- Kullanıcı listesi ve bot filtresi
- Toplu duyuru: metin/fotoğraf/video/buton
- Başarı/başarısız sayacı
- Telegram webhook ile kullanıcı kaydı
- `/start` ile kayıt + ana sayfa mesajı
- Loglar
- Mobil responsive panel
