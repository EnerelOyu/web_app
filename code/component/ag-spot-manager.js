// ../code/component/ag-spot-manager.js
class AgSpotManager extends HTMLElement {
  constructor() {
    super();
    this._cards = [];
    this._filters = {
      bus: null,   // бүс нутаг
      cate: null,  // категори
      // цаашид "Үйл ажиллагаа", "Нас" гэх мэтийг нэмэх боломжтой
    };

    // event handler-ийг this-тэй нь bind хийж тогтооно
    this._onFilterChanged = this._onFilterChanged.bind(this);
  }

  connectedCallback() {
    // 1. Өөрийнхөө ойр орчмоос SPOT card-уудыг олж авна
    const container = this.closest(".spot-cards-container") || document;
    this._cards = Array.from(container.querySelectorAll("ag-spot-card"));

    // 2. URL-ээс анхны filter-ийг уншина (home.html-ээс ирсэн bus, cate)
    this._applyInitialFiltersFromURL();

    // 3. ag-filter-үүдийн "filter-changed" эвентүүдийг сонсоно
    document.addEventListener("filter-changed", this._onFilterChanged);
  }

  disconnectedCallback() {
    // memory leak-ээс сэргийлж listener-ээ салгана
    document.removeEventListener("filter-changed", this._onFilterChanged);
  }

  // ---------- URL-ээс filter унших ----------
  _applyInitialFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);

    const bus = params.get("bus");   // ?bus=...
    const cate = params.get("cate"); // ?cate=...

    if (bus)  this._filters.bus  = bus;
    if (cate) this._filters.cate = cate;

    this._applyFilters();
  }

  // ---------- ag-filter-ээс ирэх эвент ----------
  _onFilterChanged(event) {
    const { type, values } = event.detail || {};
    // values = checkbox-оор сонгосон бүх утгуудын массив
    // бид одоогоор эхнийхийг нь ашиглая (хэрвээ хоёроос олон байвал дараа өргөтгөж болно)
    const first = values && values.length ? values[0] : null;

    if (type === "Бүс нутаг") {
      this._filters.bus = first;
    } else if (type === "Категори") {
      this._filters.cate = first;
    }
    // Хэрвээ "Үйл ажиллагаа", "Насны ангилал"-аар бас шүүх бол
    // энд өөр key нэмж болно.

    this._applyFilters();
  }

  // ---------- Шүүх үндсэн логик ----------
  _applyFilters() {
    if (!this._cards.length) return;

    const busFilter  = this._normalize(this._filters.bus);
    const cateFilter = this._normalize(this._filters.cate);

    this._cards.forEach(card => {
      const bus  = this._normalize(card.getAttribute("bus"));
      const cate = this._normalize(card.getAttribute("cate"));

      // Бүс нутаг таарах эсэх (filter байхгүй бол үнэн гэж үзнэ)
      const matchBus =
        !busFilter || (bus && bus === busFilter);

      // Категори таарах эсэх
      // cate="Соёл, Түүхэн" байж болно → includes ашиглая
      const matchCate =
        !cateFilter || (cate && cate.includes(cateFilter));

      const visible = matchBus && matchCate;

      card.style.display = visible ? "" : "none";
    });
  }

  // Жижиг туслах функц: string-ийг жижиг үсэг + trim болгох
  _normalize(value) {
    return value ? value.toString().trim().toLowerCase() : "";
  }
}

customElements.define("ag-spot-manager", AgSpotManager);
