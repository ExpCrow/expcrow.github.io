// Yıl göstergesi
const yearHolder = document.getElementById('year');
if (yearHolder) {
  yearHolder.textContent = new Date().getFullYear();
}

// ---- Çoklu Dil Sistemi (TR - EN) ----
const langButtons = document.querySelectorAll('.lang-btn');
const translatableEls = document.querySelectorAll('[data-tr]');

function setLanguage(lang) {
  const selectedLang = (lang === 'tr' || lang === 'en') ? lang : 'en';

  // Buton görünümü
  langButtons.forEach(b => b.classList.remove('active'));
  const activeBtn = document.getElementById(`lang-${selectedLang}`);
  if (activeBtn) activeBtn.classList.add('active');

  // Metinleri değiştir
  translatableEls.forEach(el => {
    const value = el.getAttribute(`data-${selectedLang}`);
    if (value !== null) {
      el.textContent = value;
    }
  });

  // <html lang> ayarla
  document.documentElement.setAttribute('lang', selectedLang);

  // Kaydet
  try {
    localStorage.setItem('lang', selectedLang);
  } catch (e) {
    // localStorage başarısız olsa bile site çalışmaya devam etsin
  }
}

const langMenu = document.querySelector(".lang-menu");
const langIcon = document.querySelector(".lang-icon");
const langOptions = document.querySelectorAll(".lang-dropdown button");

if (langIcon) {
  langIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    langMenu.classList.toggle("open");
  });

  document.addEventListener("click", () => {
    langMenu.classList.remove("open");
  });
}

langOptions.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const lang = e.target.getAttribute("data-lang");
    setLanguage(lang);
    langMenu.classList.remove("open");
  });
});


// Buton tıklamaları
langButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const selected = btn.id.replace('lang-', '');
    setLanguage(selected);
  });
});

// Sayfa yüklenince sistem dilini algıla
window.addEventListener('DOMContentLoaded', () => {
  let initialLang = 'en';

  try {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      initialLang = savedLang;
    } else {
      const browserLang = navigator.language || navigator.userLanguage || 'en';
      initialLang = browserLang.toLowerCase().includes('tr') ? 'tr' : 'en';
    }
  } catch (e) {
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    initialLang = browserLang.toLowerCase().includes('tr') ? 'tr' : 'en';
  }

  setLanguage(initialLang);
});
