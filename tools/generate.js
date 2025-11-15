const fs = require("fs");
const path = require("path");

// =====================================================
// 1) games.json'u yükle
// =====================================================
const gamesPath = path.resolve(__dirname, "../data/games.json");
const games = JSON.parse(fs.readFileSync(gamesPath, "utf8"));


// =====================================================
// 2) Oyun klasörünü ve images klasörünü oluştur + screenshotları oku
// =====================================================
function getGameScreenshots(gameSlug) {
    const baseFolder = path.resolve(__dirname, `../${gameSlug}`);
    const imgFolder = path.join(baseFolder, "images");

    // klasör yoksa oluştur
    if (!fs.existsSync(baseFolder)) fs.mkdirSync(baseFolder);
    if (!fs.existsSync(imgFolder)) fs.mkdirSync(imgFolder);

    // desteklenen formatlar
    const validExt = [".png", ".jpg", ".jpeg", ".webp"];

    let screenshots = [];

    // klasördeki dosyaları tara
    const files = fs.readdirSync(imgFolder);

    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        if (validExt.includes(ext)) {
            screenshots.push(`images/${file}`);
        }
    });

    return screenshots;
}



// =====================================================
// 3) Detay sayfası oluştur
// =====================================================
function generatePages() {
    const rootDir = path.resolve(__dirname, "..");

    games.forEach(game => {

        const gameFolder = path.join(rootDir, game.slug);
        if (!fs.existsSync(gameFolder)) fs.mkdirSync(gameFolder);

        const screenshots = getGameScreenshots(game.slug);

        const htmlContent = generateGameDetailsHTML(game, screenshots);
        fs.writeFileSync(path.join(gameFolder, "index.html"), htmlContent);
    });

    console.log("🎉 Oyun detay sayfaları başarıyla üretildi.");
}



// =====================================================
// 4) DETAY SAYFASI TEMPLATE (GALERİ DESTEKLİ)
// =====================================================
function generateGameDetailsHTML(game, screenshots) {

    // -------------------------------------------
    // Galeri HTML
    // -------------------------------------------
    let galleryHTML = "";
    if (screenshots.length > 0) {
        galleryHTML = `
        <div class="gallery">
            ${screenshots.map(src => `
                <img src="${src}" alt="${game.name} screenshot">
            `).join("")}
        </div>`;
    }

return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>

<title>${game.name} – ExpCrow</title>
<meta name="description" content="${game.description.en}"/>
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<link rel="stylesheet" href="../css/style.css"/>

<style>
body {
    background: linear-gradient(135deg, #0b0f19, #1c2333);
    color: white;
    font-family: "Poppins", sans-serif;
    background-size: cover;
}

.details-wrapper {
    max-width: 760px;
    width: 90%;
    margin: 40px auto;
    padding: 22px 26px;
    border-radius: 20px;

    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);

    box-shadow: 0 6px 28px rgba(0,0,0,0.28);
    border: 1px solid rgba(255,255,255,0.08);
}

.game-thumb-large {
    text-align: center;
    margin-bottom: 25px;
}
.game-thumb-large img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 28px;
    padding: 6px;
    background: rgba(255,255,255,0.08);
    border: 2px solid rgba(255,255,255,0.15);
    filter: drop-shadow(0 10px 25px rgba(0,0,0,0.45));
    transition: 0.25s;
}

.game-thumb-large img:hover {
    transform: scale(1.03);
    filter: drop-shadow(0 16px 35px rgba(0,0,0,0.55));
}

h1 {
    text-align: center;
    font-size: 36px;
    margin-bottom: 20px;
}

.description {
    line-height: 1.6;
    font-size: 18px;
    text-align: center;
    opacity: 0.95;
}

/* Galeri */
.gallery {
    margin-top: 35px;
    display: flex;
    justify-content: center;   /* galeriyi ortalıyoruz */
    flex-wrap: wrap;           /* alt satıra geçebilir */
    gap: 14px;
    padding: 10px 0;
}

.gallery img {
    height: 140px;
    border-radius: 12px;
    cursor: pointer;
    transition: 0.25s;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.gallery img:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 28px rgba(0,0,0,0.4);
}

/* Store Butonları */
.store-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 30px 0;
}
.store-btn {
    padding: 12px 22px;
    border-radius: 12px;
    color: white;
    font-weight: 600;
    text-decoration: none;
}
.store-btn.android { background: #3ddc84; }
.store-btn.ios { background: #007aff; }

/* Back Button */
.back-btn {
    display: block;
    text-align: center;
    margin-top: 25px;
    color: #ffffff;
    opacity: 0.7;
}
.back-btn:hover { opacity: 1; }

.lightbox-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.85);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 999999;
}

.lightbox-overlay img {
    max-width: 90%;
    max-height: 90%;
    border-radius: 16px;
    box-shadow: 0 0 35px rgba(0,0,0,0.6);
    animation: fadeIn 0.25s ease;
}

.lightbox-close {
    position: fixed;
    top: 25px;
    right: 25px;
    font-size: 32px;
    color: white;
    cursor: pointer;
    z-index: 1000000;
    font-weight: bold;
    text-shadow: 0 0 10px black;
}
.lang-menu {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.lang-icon {
  background: none;
  border: none;
  outline: none;
  color: var(--text, #fff);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  margin: 0;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, color 0.2s ease;
}

.lang-icon i {
  font-family: "Font Awesome 6 Free";
  font-weight: 900;
  background: none !important;
  color: inherit;
}

.lang-icon:hover {
  transform: scale(1.1);
  color: var(--accent, #5d7bff);
}

.lang-dropdown {
  position: absolute;
  top: 140%;
  right: 0;
  background: rgba(0,0,0,0.75);
  border-radius: 10px;
  padding: 6px 0;
  display: none;
  flex-direction: column;
  min-width: 120px;
  backdrop-filter: blur(10px);
}

.lang-dropdown button {
  background: none;
  border: none;
  color: #fff;
  padding: 8px 12px;
  text-align: left;
}

.lang-dropdown button:hover {
  background: rgba(255,255,255,0.1);
}

.lang-menu.open .lang-dropdown {
  display: flex;
}
/* Menü açıldığında */
.detail-lang-menu.open .detail-lang-dropdown {
  display: flex;
}@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}


/* Mobilde taşmayı engelle */
@media (max-width: 480px) {
    .details-wrapper {
        padding: 18px;
        margin: 20px auto;
        width: calc(100% - 24px);
        border-radius: 16px;
    }

    .gallery img {
        height: 110px;
    }
}

</style>

</head>

<body>

<div class="details-wrapper">
<div class="lang-menu">
    <button class="lang-icon" aria-label="Change language">
        <i class="fa-solid fa-language"></i>
    </button>

    <div class="lang-dropdown">
        <button data-lang="en">English</button>
        <button data-lang="tr">Türkçe</button>
    </div>
</div>
   <div class="game-thumb-large">
        <img src="../images/${game.slug}.png" alt="${game.name}">
    </div>

    <h1 data-en="${game.name}" data-tr="${game.name}">${game.name}</h1>

    <p class="description"
       data-en="${game.description.en}"
       data-tr="${game.description.tr}">
       ${game.description.en}
    </p>

    ${galleryHTML}

    <div class="store-buttons">
        <a href="${game.android}" target="_blank" class="store-btn android">Android</a>
        <a href="${game.ios}" target="_blank" class="store-btn ios">iOS</a>
    </div>

    <a href="../index.html" class="back-btn">Back</a>
</div>

<script src="../js/script.js"></script>
<div class="lightbox-overlay" id="lightbox">
    <span class="lightbox-close" id="lightboxClose">×</span>
    <img id="lightboxImage" src="">
</div>
<script src="../js/script.js"></script>
<script>
document.addEventListener("DOMContentLoaded", () => {

      const menu = document.querySelector(".detail-lang-menu");
    const icon = document.querySelector(".detail-lang-icon");
    const options = document.querySelectorAll(".detail-lang-dropdown button");

    // Menü aç/kapa
    icon.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("open");
    });

    document.addEventListener("click", () => {
        menu.classList.remove("open");
    });

    // Dil seçimi
    options.forEach(btn => {
        btn.addEventListener("click", () => {
            const lang = btn.dataset.lang;
            localStorage.setItem("lang", lang);
            applyTranslations(lang);  
            menu.classList.remove("open");
        });
    });

    // Sayfa yüklenince dil
    const saved = localStorage.getItem("lang") || "en";
    applyTranslations(saved);

    /* ======================================================
       🔥 2) LIGHTBOX GÖRSEL BÜYÜTME
    ====================================================== */

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImage");
    const closeBtn = document.getElementById("lightboxClose");

    document.querySelectorAll(".gallery img").forEach(img => {
        img.addEventListener("click", () => {
            lightbox.style.display = "flex";
            lightboxImg.src = img.src;
        });
    });

    closeBtn.addEventListener("click", () => {
        lightbox.style.display = "none";
    });

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
        }
    });

});
</script>

</body>
</html>
`;
}



// =====================================================
// 5) Ana sayfa kartlarını oluştur
// =====================================================
function injectCardsIntoIndex() {
    const indexPath = path.resolve(__dirname, "../index.html");
    let indexHTML = fs.readFileSync(indexPath, "utf8");

    const startMarker = "<!-- AUTO-GENERATED-CARDS-START -->";
    const endMarker   = "<!-- AUTO-GENERATED-CARDS-END -->";

    const startIndex = indexHTML.indexOf(startMarker);
    const endIndex   = indexHTML.indexOf(endMarker);

    if (startIndex === -1 || endIndex === -1) {
        console.error("❌ Marker bulunamadı.");
        return;
    }

    let cardsHTML = "";
    games.forEach(game => {
        cardsHTML += `
        <article class="game-card">
            <div class="game-thumb">
                <img src="images/${game.slug}.png" alt="${game.name} logo">
            </div>

            <div class="game-body">
                <h3 data-en="${game.name}" data-tr="${game.name}">
                    ${game.name}
                </h3>

                <p data-en="${game.description.en}" data-tr="${game.description.tr}">
                    ${game.description.en}
                </p>
            </div>

            <div class="store-links">
                <a href="${game.android}" target="_blank">Android</a>
                <a href="${game.ios}" target="_blank">iOS</a>
            </div>

           <a class="seo-page-link"
   href="./${game.slug}/"
   data-en="More details"
   data-tr="Daha fazla bilgi">
   More details
</a>
        </article>
        `;
    });

    const before = indexHTML.slice(0, startIndex + startMarker.length);
    const after  = indexHTML.slice(endIndex);

    indexHTML = before + "\n" + cardsHTML + "\n" + after;
    fs.writeFileSync(indexPath, indexHTML);

    console.log("🏆 Ana sayfa kartları güncellendi!");
}


// =====================================================
// ÇALIŞTIR
// =====================================================
function generateAll() {
    generatePages();
    injectCardsIntoIndex();
}

generateAll();
