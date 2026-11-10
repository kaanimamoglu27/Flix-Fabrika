# Flix Fabrika

Flix Toys'un fabrika oyunu (sürüm 1.9). Hindi çiftliğinden FLIX üret, test et, paketle, sat; fabrikanı büyüt.

**Oyna:** https://kaanimamoglu27.github.io/Flix-Fabrika/

- `index.html` oyunun kendisi (tek dosya)
- `kaynak/` kaynak dosyalar (`python3 build.py` ile derlenir)
- `app/` iOS uygulaması (Capacitor 8, com.flixtoys.fabrika)

Not: Bu sürümde Ayarlar → 🧪 Endgame test modu herkese açık; App Store öncesi gizlenecek.

## Yasal Bilgiler / Legal & Information (2026-11-09)

Ayarlar'da (Sen Olsaydın'da ana ekranın altında) **Yasal Bilgiler** ve **Hakkında** düğmeleri var. Panel TR/EN, dili cihaz diline göre seçer, üstteki TR/EN ile değişir.
Belgeler flixtoysofficial.com'daki resmi sayfalar; uygulamada Safari'de, web'de yeni sekmede açılır (oyun içinde WebView yok). İnternet yoksa uyarı ve adres gösterilir.
Hakkında: geliştiriciler, %50/%50 telif sahipliği, yayıncı FLIX TOYS, destek e-postası, açık kaynak bileşenler.
Kod oyunun içinde tek bir `<script>/* FLIX legal */` bloğu (FlixLegal), düğmeler `data-flixlegal="legal|about"`. Oynanış, reklam, satın alma ve kayıtlar değişmedi.
