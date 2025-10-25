const yearHolder = document.getElementById('year');

if (yearHolder) {
  yearHolder.textContent = new Date().getFullYear();
}
