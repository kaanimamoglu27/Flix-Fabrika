# Flix Fabrika

Flix Toys'un fabrika oyunu (sürüm 2.5, yatay). Hindi çiftliğinden FLIX üret, test et, paketle, sat; fabrikanı büyüt.

**Oyna:** https://kaanimamoglu27.github.io/Flix-Fabrika/

- `index.html` oyunun kendisi (tek dosya)
- `kaynak/` kaynak dosyalar (`python3 build.py` ile derlenir)
- `app/` iOS uygulaması (Capacitor 8, com.flixtoys.fabrika)

Not: 🧪 Endgame test modu yalnızca web'de (Pages/artifact) görünür; iOS uygulamasında tamamen kapalı (2.0.1).

## 2.5 (2026-11-17): istasyon daireleri, takılan kutular, ayrıntılı Nasıl oynanır
- **Kutular artık havada asılı kalmıyor, yığından kaymıyor.** Bir kutu bir yere uçarken (masa, tezgah, sandık) karakter ya da eleman onu alırsa eski hareketi sürüyordu ve kutu elin yanında, havada ya da yığının dışında kalıyordu. Her nesnenin artık tek bir hareketi var (`killTw`, `retarget`). Bot testi: eski sürümde 500 ölçümün 62'sinde yığın bozuk, yenisinde 0.
- **Elde takılan kutular:** Geri dönüşüm açılmadan HATALI kutular alınabiliyordu, bırakacak yer olmadığı için elde kalıyordu. Artık geri dönüşüm yoksa alınmıyor.
- **Her istasyonun yanında bir daire** (kamyon dahil). Alma ve bırakma sadece dairenin içindeyken olur (`ZIN = 1.25`), içindeyken daire parlar. Şov sahnesi de görünen dairesinde başlar.
- **Nasıl oynanır** genişledi: daire kuralları, ham madde / ürün kuralı, DOLU, bırakmıyorsa ne yapmalı; ilerleyen 13 istasyonun kısa anlatımı (TR + EN). "DOLU" İngilizcede "FULL".
- Not: `index.html` bu sürümde `kaynak/` derlenip içindeki oyun betiği değiştirilerek üretildi (fontlar repoda yok); `shell.html`'e eklenen CSS de aynı şekilde aktarıldı.

## 2.2 (2026-11-13): yatay oyun
- Oyun artık yatay oynanır. Telefon dik tutulursa oyun kendini yataya döndürür (ARKANA'daki sistem); ters görünürse menüdeki "⟲ Ters mi? Çevir" butonu, ayrıca cihaz hareketiyle otomatik çevirme.
- Yatay düzen: ana menü iki sütun (solda logo, sağda istatistik/Oyna/kartlar), ofis/ayarlar/nasıl oynanır panelleri sağda yan panel, HUD ve butonlar sağ alt, kamera yataya göre ayarlı. Joystick dönmüş ekranda doğru yönde.
- iOS uygulaması sadece yatay (LandscapeLeft/Right, `app/tools/ios_setup.py`).
- App Store görselleri yatay yeniden çekildi: `app/store/appstore/iphone_6.9_2796x1290` ve `iphone_6.5_2688x1242`, TR/EN 8'er adet, kırmızı FLIX logosu.

## 2.1 (2026-11-13): yeni istasyonlar ve oynanış

- **Boya atölyesi** (5.000, Peluş atölyesinden sonra): test edilmiş FLIX'i halkaya bırak, altın şeritli boyalı FLIX çıkar, 1,5 kat değerli. Elemanlar da kullanır.
- **Kargo dronu** (22.000, Robot garajından sonra): istasyonlardan ve tezgahlardan FLIX toplayıp 1,3 kat fiyata satar, parayı pistine bırakır.
- **Altın tüy avı:** 2,5-4 dakikada bir haritada ışık sütunlu altın tüy belirir (1 dakika kalır). Üstünden geç: sıradaki bölümün fiyatının %12'si kadar para, bazen 1-2 elmas.
- Performans: mantık adımı ve bellek 2.0 ile aynı seviyede, görsellere dokunulmadı.
- Bot ölçümü: orta 299 dk, kolay 308 dk (5 saatin üstünde), ~50 geçiş reklamı.

## 2.0.1 (2026-11-11): App Store hazırlığı

- Endgame test modu iOS uygulamasında kapalı: düğme görünmez, eski test kaydı açılmaz (web'de Kaan'ın testi için duruyor).
- Takip izni (ATT) metni Türkçe + İngilizce.
- Uygulamada zaten olanlar: satın alımları geri yükle düğmesi, Yasal Bilgiler ve Hakkında, reklamsız paket geçiş reklamlarını kapatır, ödüllü reklamlar isteğe bağlı, şifreleme beyanı (ITSAppUsesNonExemptEncryption = NO), yalnızca iPhone ve dikey.

## 2.0 (2026-11-11)

**Oyun süresi 5 saatin üstüne çıktı.** Bot ölçümü (oyunun sonuna, son bölüm açılana kadar):

| Oyuncu | 1.9 | 2.0 | Geçiş reklamı (2.0) |
|---|---|---|---|
| Kolay (yavaş) | 127 dk | 315 dk (~5 sa 15 dk) | 51 |
| Orta | 85 dk | 310 dk | 52 |
| Zor (hızlı) | 88 dk | 322 dk | 55 |
| Çok zor (çok hızlı) | 86 dk | 309 dk | 52 |

Geçiş reklamı en fazla 4 dakikada bir (ortalama ~6 dakikada bir). Ödüllü bonus kutusu yaklaşık 105 saniyede bir çıkar (oyun boyu ~180 teklif, izlemek isteğe bağlı). Oyunun sonu gelire bağlı olduğu için hızlı oyuncu da kolay oyuncuya yakın sürede bitirir.

**Yeni içerik:** C Blok (salon doğuya genişler), 6. ve 7. kasa, 5. montaj masası, Elmas ve Gökkuşağı hindi (FLIX değeri 90 ve 135), FLIX Müzesi (+%15 satış), havada dönen oyuncak treni (müşteriler daha sık gelir), Şov Stadyumu (şov kazancı 2 kat, kalabalık tribün), dev FLIX Anıtı (+%25 satış). Kasiyer sayısı 7'ye çıktı.

**Düzeltmeler:**
- Diller ayrıldı: İngilizcede para K/M ve ondalık nokta, dolap/ayarlar/tabelalar tamamen İngilizce. Yasal panel oyunun dilini izler.
- Pres makinesi, mini makine ve tüy sandıklarından her yönden yük alınır.
- Yeni **Nasıl oynanır** paneli: 6 adım, oyundan alınmış görsellerle (TR ve EN ayrı). Ana menüde ❓ ve Ayarlar'da.

**Mağaza:** `app/store/icon-1024.png` (seçenek A), diğer seçenekler `app/store/icon_secenekleri/`. App Store görselleri `app/store/appstore/` (6.9" 1290×2796 ve 6.5" 1242×2688, TR ve EN, 8'er adet).

## Yasal Bilgiler / Legal & Information (2026-11-09)

Ayarlar'da (Sen Olsaydın'da ana ekranın altında) **Yasal Bilgiler** ve **Hakkında** düğmeleri var. Panel TR/EN, dili cihaz diline göre seçer, üstteki TR/EN ile değişir.
Belgeler flixtoysofficial.com'daki resmi sayfalar; uygulamada Safari'de, web'de yeni sekmede açılır (oyun içinde WebView yok). İnternet yoksa uyarı ve adres gösterilir.
Hakkında: geliştiriciler, %50/%50 telif sahipliği, yayıncı FLIX TOYS, destek e-postası, açık kaynak bileşenler.
Kod oyunun içinde tek bir `<script>/* FLIX legal */` bloğu (FlixLegal), düğmeler `data-flixlegal="legal|about"`. Oynanış, reklam, satın alma ve kayıtlar değişmedi.
