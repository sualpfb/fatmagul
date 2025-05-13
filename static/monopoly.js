const oyuncular = [
    { isim: "Sualp", para: 1500, konum: 0, mulkler: [], iflas: false },
    { isim: "Fatmagül", para: 1500, konum: 0, mulkler: [], iflas: false }
];

const kareIsimleri = [
    "MAIDAN", "KENTPARK", "STADYUM", "NAR DİŞÇİ", "ARMADA", "KIZILAY", "CITY", "BAM", "YILDIZ AMFİ", "STONEHOUSE",
    "ESKİŞEHİR", "AŞTİ", "BEŞEVLER", "HÜNİTEK", "ANTARES", "FORUM", "PROFESÖR DÖNER", "ATATEPE", "PARLAR", "MATEMATİK"
];

const tahta = kareIsimleri.map((isim, i) => ({
    isim,
    fiyat: 200 + (i + 1) * 10,
    sahip: null,
    ev: 0
}));

const sansKareleri = [3, 7, 13, 18];
const sansKartlari = [
    { mesaj: "Bankadan 200₺ bonus kazandın!", para: 200 },
    { mesaj: "Vergi cezası! 150₺ ödemelisin.", para: -150 },
    { mesaj: "Miras kaldı! 300₺ kazandın!", para: 300 },
    { mesaj: "Hatalı park! 100₺ ceza ödedin.", para: -100 },
    { mesaj: "Bedava tatil kazandın, direkt 5. kareye git!", goto: 5 },
    { mesaj: "Hastane masrafı çıktı! 200₺ ödedin.", para: -200 },
    { mesaj: "Halk ödülü kazandın! 250₺ al.", para: 250 },
    { mesaj: "Bağış yaptın, 50₺ kaybettin.", para: -50 }
];

let siradaki = 0;

function logYaz(metin) {
    const log = document.getElementById("log");
    log.innerHTML += `<div>${metin}</div>`;
    log.scrollTop = log.scrollHeight;
}

function oyuncuBilgiGuncelle() {
    const el = document.getElementById("oyuncular");
    el.innerHTML = oyuncular.map(o =>
        `<strong>${o.isim}</strong> - 💰 ${o.para}₺ - 📍 ${tahta[o.konum].isim}${o.iflas ? " ❌" : ""}`
    ).join("<br>");
}

function zarAt() {
    return Math.floor(Math.random() * 6) + 1;
}

function sansKartiCek(oyuncu) {
    const kart = sansKartlari[Math.floor(Math.random() * sansKartlari.length)];
    logYaz(`🃏 Şans Kartı: ${kart.mesaj}`);
    if (kart.para) {
        oyuncu.para += kart.para;
    }
    if (kart.goto !== undefined) {
        oyuncu.konum = kart.goto;
    }
}

function kiraOde(oyuncu, kare) {
    const kira = (kare.fiyat / 2) + (kare.ev * 50);
    const sahip = kare.sahip;
    if (oyuncu.para < kira) {
        logYaz(`💀 ${oyuncu.isim} iflas etti!`);
        oyuncu.iflas = true;
        return;
    }
    oyuncu.para -= kira;
    sahip.para += kira;
    logYaz(`${oyuncu.isim}, ${sahip.isim}'e ${kira}₺ kira ödedi.`);
}

function turBaslat() {
    const btn = document.getElementById("zarBtn");
    btn.disabled = true;

    const oyuncu = oyuncular[siradaki];
    if (oyuncu.iflas) {
        siradaki = (siradaki + 1) % oyuncular.length;
        btn.disabled = false;
        return;
    }

    logYaz(`🎲 ${oyuncu.isim} zar atıyor...`);
    const zar = zarAt();
    oyuncu.konum = (oyuncu.konum + zar) % tahta.length;
    const kare = tahta[oyuncu.konum];
    logYaz(`${oyuncu.isim}, ${kare.isim} karesine geldi.`);

    if (sansKareleri.includes(oyuncu.konum)) {
        sansKartiCek(oyuncu);
    }

    const guncelKare = tahta[oyuncu.konum];
    if (guncelKare.sahip && guncelKare.sahip !== oyuncu) {
        kiraOde(oyuncu, guncelKare);
    } else if (!guncelKare.sahip && oyuncu.para >= guncelKare.fiyat) {
        guncelKare.sahip = oyuncu;
        oyuncu.mulkler.push(guncelKare);
        oyuncu.para -= guncelKare.fiyat;
        logYaz(`${oyuncu.isim}, ${guncelKare.fiyat}₺ ile ${guncelKare.isim} karesini satın aldı.`);
    }

    oyuncuBilgiGuncelle();

    // Kazanan kontrol
    const ayaktaKalan = oyuncular.filter(o => !o.iflas);
    if (ayaktaKalan.length === 1) {
        logYaz(`🏆 Oyun bitti! Kazanan: ${ayaktaKalan[0].isim}`);
        btn.disabled = true;
        return;
    }

    siradaki = (siradaki + 1) % oyuncular.length;
    btn.disabled = false;
}
