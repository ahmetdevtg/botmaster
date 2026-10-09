# BotMaster 4.1 — Cloudflare Workers + Hono + D1

Bu paket, BotMaster 4.0 projesinin tam kaynak paketidir. Toplu bot ekleme akışı hata ayrıntısını gösterecek şekilde iyileştirildi; tokenlar sonuç ekranında gösterilmez. Cloudflare Workers üzerinde çalışmak üzere hazırlanmıştır.

## Özellikler

- İlk yönetici oluşturma (`/setup`) ve oturum açma (`/login`)
- Dashboard: bot/kullanıcı temel sayıları
- Tekli bot ekleme ve Telegram `getMe` doğrulaması
- Toplu bot ekleme (satır, boşluk, virgül veya noktalı virgülle ayrılmış tokenlar; tek işlemde en fazla 100)
- Bot listesi, arama, detay ekranı, aktif/pasif, silme, kontrol ve bilgileri yenileme
- Bot başına `/start` mesajı: metin, HTML/Markdown, Telegram photo/video `file_id`
- Inline URL butonları (bot başına birden fazla kayıt, webhook akışında gönderilir)
- Webhook kurma/silme ve Telegram update endpoint'i: `/telegram/webhook/:id`
- Toplu ana sayfa alanı güncelleme; boş bırakılan metin/medya alanları korunur
- Kullanıcı listesi, bot filtresi ve arama
- Toplu duyuru: seçili aktif botların kayıtlı kullanıcılarına metin/fotoğraf/video ve tek URL butonu
- Duyuru başarı/başarısızlık sayacı; bloklayan kullanıcıların işaretlenmesi
- İşlem logları, sağlık endpoint'i (`/api/health`), 404 sayfası ve mobil uyumlu panel

## Dosyalar

- `src/index.ts` — Hono uygulaması ve panel rotaları
- `schema.sql` — D1 tabloları ve indeksler (`IF NOT EXISTS` kullanır)
- `wrangler.toml` — Worker ve D1 binding ayarları
- `package.json` — bağımlılıklar ve komutlar
- `tsconfig.json` — TypeScript ayarları

## Kurulum

1. ZIP'i açıp içindeki `BotMaster-Complete` klasörünün **içeriğini** GitHub'daki `botmaster` deposunun köküne yükle. `src/index.ts` yolu kökte bulunmalıdır.
2. `wrangler.toml` içindeki `database_id = "BURAYA_BOTMASTER_D1_DATABASE_ID"` alanını kendi `botmaster-db` veritabanının gerçek ID'siyle değiştir. `compatibility_date = "2026-10-08"` satırını gelecekteki bir tarihe alma.
3. Cloudflare D1 → `botmaster-db` → Console bölümünde `schema.sql` dosyasının içeriğini çalıştır. Bu şema mevcut tabloları silmez; ancak daha önce oluşturulmuş tabloların eksik sütunlarını otomatik eklemez.
4. GitHub'a commit et ve Cloudflare deploy'u bekle. Build ayarı kullanılıyorsa deploy komutu `npx wrangler deploy` olabilir.
5. `https://WORKER-ADRESIN/setup` adresinden ilk yönetici hesabını oluştur. İlk yönetici oluşturulduktan sonra `/setup` tekrar hesap açmaz.
6. `/login` üzerinden giriş yap.

## Webhook / kullanıcı kaydı

Bir botun kullanıcılarını otomatik kaydetmek için webhook URL'si `https://WORKER-ADRESIN/telegram/webhook/BOT_ID` biçiminde olmalıdır. Panelde bot detay sayfasından webhook URL'sini kaydedebilirsin. `BOT_ID`, BotMaster panelindeki dahili bot ID'sidir; Telegram bot ID'si değildir. Telegram'dan gelen `/start` mesajı kullanıcıyı kaydeder ve kaydedilmiş ana sayfa mesajını yollar.

## Önemli sınırlar ve güvenlik

- Telegram tokenlarını sohbet mesajlarına, GitHub issue'larına veya herkese açık loglara koyma. Tokenlar D1'de saklanır; bu sürümde veritabanında şifrelenmez. D1 erişimini ve Cloudflare hesabını koru.
- Medya alanları Telegram `file_id` bekler; bu sürüm panelden dosya yükleme arayüzü içermez. Telegram'da mevcut medya dosyasının `file_id` değerini kullan.
- Duyuru gönderimleri Worker isteği içinde sırayla yürütülür. Çok büyük kitlelerde Cloudflare istek süresi sınırlarına takılabilir; büyük kampanyalar için kuyruk/cron tabanlı arka plan gönderim sistemi gerekir.
- Bu ZIP, kaynak kodunu ve yapılandırmayı içerir; kullanıcının gerçek Cloudflare hesabına erişimimiz olmadığı için burada canlı deploy veya Telegram tokenlarıyla uçtan uca test yapılamadı. Deploy sonrası `/api/health`, giriş, tek bot ekleme ve önce 1–2 tokenla toplu ekleme testi yap.
- D1 veritabanında önemli kayıtların varsa şemayı çalıştırmadan önce yedek al. Bu şema tablo silmez; ancak eski şema sütunları farklıysa mevcut DB için ayrıca migration gerekebilir.

## Toplu bot ekleme hata teşhisi

Bu sürümde toplu ekleme hata verirse sonuç sayfası hata ayrıntısını göstermeye çalışır. `no such column`, `no such table` veya benzeri SQL hatası çıkarsa D1 şeması bu sürümle aynı değildir. Tokenları paylaşmadan hata metnini ilet; D1 şemasını ona göre düzeltmek gerekir.
