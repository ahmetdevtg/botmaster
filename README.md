# BotMaster SuperPro — çok dosyalı Cloudflare Workers projesi

Bu proje Hono + TypeScript + Cloudflare Workers + D1 kullanır. Kaynak kod tek `index.ts` dosyasına yığılmamıştır; route, view ve yardımcı işlevler ayrı dosyalardadır.

## Kurulum
1. ZIP'i çıkarın ve içindeki `BotMaster-SuperPro` klasörünün **içindeki tüm dosyaları** GitHub `botmaster` deposunun köküne yükleyin. ZIP'i GitHub'a doğrudan yüklemeyin; GitHub ZIP'i otomatik açmaz.
2. `wrangler.toml` içindeki `database_id` değerini Cloudflare D1 > `botmaster-db` sayfasındaki gerçek Database ID ile değiştirin. `database_name` ve `binding = "DB"` aynı kalmalıdır.
3. D1 Console'da, veritabanı yeni/boş ise önce `schema.sql` dosyasının tamamını çalıştırın.
4. Var olan veritabanında `schema.sql` dosyasını yeniden çalıştırmak yerine yalnızca daha önce uygulanmamış migration'ları çalıştırın. `0003_broadcast_failed_count.sql`, `broadcasts.failed_count` alanını ekler. Bu migration yalnızca bir kez çalıştırılmalıdır.
5. Cloudflare Worker deploy tamamlandıktan sonra `https://WORKER-ADRESIN/setup` adresinden ilk yönetici hesabını oluşturun. Sonra `/login` üzerinden giriş yapın.

## Özellikler
- Yönetici kurulumu, giriş/çıkış ve oturum kontrolü
- Tekli/toplu bot ekleme, bot doğrulama, aktif/pasif, silme ve kontrol
- Bot profili ve webhook yönetimi
- `/start` metni, fotoğraf/video `file_id`, HTML/Markdown modu ve bağlantı butonları
- Toplu ana sayfa ayarları
- Telegram komut menüsü ve özel komut cevapları
- Webhook ile kullanıcı kayıt/güncelleme
- Kullanıcı listesi/arama/bot filtresi
- Toplu duyuru, medya ve buton desteği
- Yönetim logları ve dashboard

## Kaynak yapısı
- `src/index.ts`: uygulama başlangıcı ve middleware
- `src/routes/`: auth, botlar, webhook, ana sayfa, kullanıcılar, duyuru, komutlar, loglar
- `src/lib/`: Telegram API, kimlik doğrulama, yardımcı fonksiyonlar
- `src/views/html.ts`: ortak panel arayüzü
- `schema.sql`: ilk kurulum veritabanı şeması
- `migrations/`: mevcut veritabanı değişiklikleri

## Kontrol
`npm run typecheck` TypeScript denetimini, `npm run deploy` deploy işlemini çalıştırır.

## Önemli notlar
- Gerçek Telegram tokenlarını GitHub issue'larına veya sohbetlere koymayın; yalnızca panelin token alanında kullanın.
- Toplu duyuruyu yalnızca botun mesaj almayı kabul etmiş kullanıcılara gönderin. Telegram hız sınırları nedeniyle çok büyük listelerde işlem uzun sürebilir.
- Canlı Telegram tokenları ve Cloudflare hesabı olmadan uzaktan uçtan uca doğrulama yapılamaz. Deploy sonrası `/api/health`, panel girişi, bir test botunun `/start` akışı ve bir test duyurusu kontrol edilmelidir.
