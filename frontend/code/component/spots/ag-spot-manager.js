class AgSpotManager extends HTMLElement {
  constructor() {
    super();
    //buh spotiig hadgalna
    this._cards = [];
    //filteruudiig hadgala
    this._filters = {
      bus: [],
      cate: [],
      activity: [],
      rating: [],
    };

    this._onFilterChanged = this._onFilterChanged.bind(this);
  }

  connectedCallback() {
    const container = this.closest(".spot-cards-container") || document;
    this._cards = Array.from(container.querySelectorAll("ag-spot-card"));

    this._applyInitialFiltersFromURL();

    document.addEventListener("filter-changed", this._onFilterChanged);
  }

  disconnectedCallback() {
    document.removeEventListener("filter-changed", this._onFilterChanged);
  }

  _applyInitialFiltersFromURL() {
  // Parse query params from hash (e.g., #/spots?bus=Төв&cate=Соёл)
  const hash = window.location.hash;
  const queryString = hash.includes('?') ? hash.split('?')[1] : '';
  const params = new URLSearchParams(queryString);

  const bus = params.get("bus");
  const cate = params.get("cate");

  if (bus)  this._filters.bus  = [bus];
  if (cate) this._filters.cate = [cate];

  // 1) эхлээд картуудыг шүүнэ
  this._applyFilters();

  // 2) дараа нь ag-filter-үүдийн checkbox-ийг URL-ийн утгатай тааруулж check хийнэ
  const filters = document.querySelectorAll("ag-filter");

  filters.forEach(filter => {
    const type = filter.getAttribute("ner");
    let values = [];

    if (type === "Бүс нутаг") {
      values = this._filters.bus;
    } else if (type === "Категори") {
      values = this._filters.cate;
    } else {
      return; // энэ filter-д URL-ээс утга байхгүй
    }

    if (!values || !values.length) return;

    const normValues = values.map(v => this._normalize(v));

    const root = filter.shadowRoot;
    if (!root) return;
    filter.querySelectorAll("input[type='checkbox']").forEach(cb => {
      const cbVal = this._normalize(cb.value);
      if (normValues.includes(cbVal)) {
        cb.checked = true;
      }
    });

    // checked өөрчлөгдсөн тул event-ээ гараар дуудах
    filter.update();
  });
}


  _onFilterChanged(event) {
    const { type, values } = event.detail || {};

    const arr = Array.isArray(values) ? values : [];

    if (type === "Бүс нутаг") {
      this._filters.bus = arr;
    } else if (type === "Категори") {
      this._filters.cate = arr;
    } else if (type === "Үйл ажиллагаа") {
      this._filters.activity = arr;
    } else if (type === "Үнэлгээ") {
      this._filters.rating = arr;
    }

    this._applyFilters();
  }

  _applyFilters() {
    if (!this._cards.length) return;

    const busFilters = (this._filters.bus||[]).map(v => this._normalize(v)).filter(Boolean);
    const cateFilters = (this._filters.cate||[]).map(v => this._normalize(v)).filter(Boolean);
    const activityFilters = (this._filters.activity||[]).map(v => this._normalize(v)).filter(Boolean);
    const ratingFilters = (this._filters.rating||[]).filter(Boolean);

    this._cards.forEach(card => {
      const busVal = this._normalize(card.getAttribute("bus"));
      const cateVal = this._normalize(card.getAttribute("cate"));
      const activityVal = this._normalize(card.getAttribute("activity"));
      const ratingVal = parseFloat(card.getAttribute("unelgee")) || 0;

      const matchBus = busFilters.length === 0 || (busVal && busFilters.some(f => busVal.includes(f)));

      const matchCate = cateFilters.length === 0 || (cateVal && cateFilters.some(f => cateVal.includes(f)));

      const matchActivity = activityFilters.length === 0 || (activityVal && activityFilters.some(f => activityVal.includes(f)));

      const matchRating = ratingFilters.length === 0 || ratingFilters.some(range => {
        if (range === '5') {
          return ratingVal === 5;
        } else if (range === '5-4') {
          return ratingVal >= 4 && ratingVal < 5;
        } else if (range === '4-3') {
          return ratingVal >= 3 && ratingVal < 4;
        } else if (range === '3-аас бага') {
          return ratingVal < 3;
        }
        return false;
      });

      const visible = matchBus && matchCate && matchActivity && matchRating;

      card.style.display = visible ? "" : "none";
    });
  }

  _normalize(value) {
    return value ? value.toString().trim().toLowerCase() : "";
  }
}

customElements.define("ag-spot-manager", AgSpotManager);
