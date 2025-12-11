// code/theme-toggle.js

const STORAGE_KEY = "ayalgo-theme";
const html = document.documentElement;
const toggleBtn = document.getElementById("theme-toggle");

// 🚀 1. Эхлээд theme-ийг тогтооно (localStorage → системийн setting → default light)
function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;

  // Хэрэв хадгалсан байхгүй бол системийн theme-г харгалзана
  const prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}

// 🌓 2. Theme-г DOM дээр тавих + товчны icon солих
function applyTheme(theme) {
  html.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);

  if (!toggleBtn) return;

  if (theme === "dark") {
    toggleBtn.textContent = "☀️";       // dark дээр бол "light болгоё" гэсэн утгатай
    toggleBtn.setAttribute("aria-label", "Light theme рүү шилжих");
  } else {
    toggleBtn.textContent = "🌙";
    toggleBtn.setAttribute("aria-label", "Dark theme рүү шилжих");
  }
}

// 🔄 3. Товч дээр дарахад theme солигдох
function toggleTheme() {
  const current = html.dataset.theme === "dark" ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
}

// ✅ 4. Page ачаалахад эхний theme-г тохируулна
const initialTheme = getInitialTheme();
applyTheme(initialTheme);

// ✅ 5. Товч ажиллагаатай болгоно
if (toggleBtn) {
  toggleBtn.addEventListener("click", toggleTheme);
}

// (Optional) 6. Системийн theme өөрчлөгдвөл дагаж өөрчлөмөөр байвал:
if (window.matchMedia) {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      // Хэрэв хэрэглэгч өөрөө гараар сонгосон байвал системийнхийг үл тоож болно.
      // Доорх мөрийг хүсвэл uncomment хийгээд, системийн өөрчлөлтийг юу ч хийхгүй байж болно:
      // if (localStorage.getItem(STORAGE_KEY)) return;

      const newTheme = event.matches ? "dark" : "light";
      applyTheme(newTheme);
    });
}
