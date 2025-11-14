const fs = require("fs");
const path = require("path");

// =====================================================
// 1) games.json'u yükle
// =====================================================
const gamesPath = path.resolve(__dirname, "../data/games.json");
const games = JSON.parse(fs.readFileSync(gamesPath, "utf8"));


// =====================================================
// 2) SEO DETAY SAYFALARI OLUŞTUR
// =====================================================
function generatePages() {
    const rootDir = path.resolve(__dirname, "..");

    games.forEach(game => {
        const gameFolder = path.join(rootDir, game.slug);

        // klasör yoksa oluştur
        if (!fs.existsSync(gameFolder)) {
            fs.mkdirSync(gameFolder);
        }

        // detay sayfası HTML'i
        const htmlContent = generateGameDetailsHTML(game);

        fs.writeFileSync(path.join(gameFolder, "index.html"), htmlContent);
    });

    console.log("🎉 Oyun detay sayfaları başarıyla üretildi.");
}



// =====================================================
// 3) DETAY SAYFASI TEMPLATE
// =====================================================
function generateGameDetailsHTML(game) {
    return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>

<title>${game.name} – ExpCrow Games</title>
<meta name="description" content="${game.description.en}"/>

<link rel="stylesheet" href="../css/style.css"/>
</head>

<body>

<div class="game-details-page">

    <div class="game-thumb-large">
        <img src="../images/${game.slug}.png" alt="${game.name} logo">
    </div>

    <h1 data-en="${game.name}" data-tr="${game.name}">
        ${game.name}
    </h1>

    <p data-en="${game.description.en}" data-tr="${game.description.tr}">
        ${game.description.en}
    </p>

    <div class="store-buttons">
        <a href="${game.android}" class="android-btn" target="_blank">Android</a>
        <a href="${game.ios}" class="ios-btn" target="_blank">iOS</a>
    </div>

    <a href="../index.html"
       class="back-btn"
       data-en="Back"
       data-tr="Geri dön">
       Back
    </a>

</div>

<script src="../js/script.js"></script>
</body>
</html>
`;
}



// =====================================================
// 4) ANA SAYFAYA OTOMATİK KART EKLE
// =====================================================
function injectCardsIntoIndex() {
    const indexPath = path.resolve(__dirname, "../index.html");
    let indexHTML = fs.readFileSync(indexPath, "utf8");

    let cardsHTML = "";

    games.forEach(game => {
        const pageURL = `./${game.slug}/`;

        cardsHTML += `
        <article class="game-card">

            <div class="game-thumb">
                <img src="images/${game.slug}.png" alt="${game.name} logo">
            </div>

            <div class="game-body">
                <h3 
                    data-en="${game.name}" 
                    data-tr="${game.name}">
                    ${game.name}
                </h3>

                <p 
                    data-en="${game.description.en}" 
                    data-tr="${game.description.tr}">
                    ${game.description.en}
                </p>
            </div>

            <div class="store-links">
                <a href="${game.android}" target="_blank" rel="noopener">Android</a>
                <a href="${game.ios}" target="_blank" rel="noopener">iOS</a>
            </div>

            <a class="seo-page-link"
               href="${pageURL}"
               data-en="More details"
               data-tr="Daha fazla bilgi"
               style="margin-top:10px; display:block; text-align:center; color:#5d7bff;">
                More details
            </a>

        </article>
        `;
    });


    // =====================================================
    // ⭐ START/END markerlarını bul ve içini tamamen yenile
    // =====================================================
    const startMarker = "<!-- AUTO-GENERATED-CARDS-START -->";
    const endMarker   = "<!-- AUTO-GENERATED-CARDS-END -->";

    const startIndex = indexHTML.indexOf(startMarker);
    const endIndex   = indexHTML.indexOf(endMarker);

    if (startIndex === -1 || endIndex === -1) {
        console.error("❌ Marker bulunamadı. index.html içinde START/END markerlarını eklediğinden emin ol.");
        return;
    }

    const before = indexHTML.slice(0, startIndex + startMarker.length);
    const after  = indexHTML.slice(endIndex);

    // START & END arasındaki alanı sıfırla → sadece yeni kartlar gelsin
    indexHTML = before + "\n" + cardsHTML + "\n" + after;

    fs.writeFileSync(indexPath, indexHTML);

    console.log("🏆 Ana sayfa kartları temizlenip yeniden oluşturuldu!");
}



// =====================================================
// 5) HER ŞEYİ BAŞLAT
// =====================================================
function generateAll() {
    generatePages();
    injectCardsIntoIndex();
}

generateAll();
