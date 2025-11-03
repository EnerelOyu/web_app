// ag-spot-manager.js  — FILTER ONLY (нуух/гаргах)

const $  = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function parseCsv(value) {
  return String(value || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

function getCardData(card) {
  return {
    el: card,
    area: (card.getAttribute("area") || "").trim(),
    categories: parseCsv(card.getAttribute("categories")),
    activities: parseCsv(card.getAttribute("activities")),
    age: (card.getAttribute("age") || "").trim(),
  };
}

// --- Шүүлтүүрийн төлөв ---
const filterState = new Map(); // Map<group, Set<values>>

function selectedOf(group) {
  return filterState.get(group) ?? new Set();
}

// <ag-filter> доторх сонголтуудыг унших
function collectFilters() {
  $$(".filter-section ag-filter").forEach(filterBox => {
    const groupName = (filterBox.getAttribute("ner") || "").trim();
    if (!groupName) return;
    const selectedValues = $$("input[type='checkbox']", filterBox)
      .filter(input => input.checked)
      .map(input => input.value);
    filterState.set(groupName, new Set(selectedValues));
  });
}

// Карт тухайн шүүлтүүдэд нийцэж байна уу?
function cardMatchesFilter(card) {
  const catSel = selectedOf("Категори");
  if (catSel.size && !card.categories.some(c => catSel.has(c))) return false;

  const areaSel = selectedOf("Бүс нутаг");
  if (areaSel.size && !areaSel.has(card.area)) return false;

  const actSel = selectedOf("Үйл ажиллагаа");
  if (actSel.size && !card.activities.some(a => actSel.has(a))) return false;

  const ageSel = selectedOf("Насны ангилал");
  if (ageSel.size && !ageSel.has(card.age)) return false;

  return true;
}

// Шүүлт хэрэгжүүлэх (таарахгүйг нууж, таарсныг харуулна)
function applyFilter() {
  const cards = $$("ag-spot-card").map(getCardData);

  let shown = 0;
  cards.forEach(card => {
    const ok = cardMatchesFilter(card);
    card.el.style.display = ok ? "block" : "none";
    if (ok) shown++;
  });

  // Тоолуур
  let count = $("#filterCount");
  if (!count) {
    const h2 = $(".spot-cards-container h2");
    count = document.createElement("span");
    count.id = "filterCount";
    count.style.marginLeft = "8px";
    h2?.appendChild(count);
  }
  count.textContent = `— Нийт: ${shown}`;
}

// Checkbox өөрчлөгдөх бүрд шүүнэ
function onFilterChange() {
  collectFilters();
  applyFilter();
}

document.addEventListener("DOMContentLoaded", () => {
  // ag-filter доторх checkbox өөрчлөгдвөл
  document.addEventListener("change", (e) => {
    if (e.target?.matches?.("ag-filter input[type='checkbox']")) {
      onFilterChange();
    }
  });

  // ag-filter өөрөө custom эвент цацдаг бол мөн барина
  document.addEventListener("filter-change", onFilterChange);

  // Эхний удаа
  onFilterChange();
});
