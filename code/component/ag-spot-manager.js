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
      age: [],      
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
    const params = new URLSearchParams(window.location.search);

    const bus = params.get("bus");
    const cate = params.get("cate");

    if (bus)  this._filters.bus  = [bus];
    if (cate) this._filters.cate = [cate];

    this._applyFilters();
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
    } else if (type === "Насны ангилал") {
      this._filters.age = arr;
    }

    this._applyFilters();
  }

  _applyFilters() {
    if (!this._cards.length) return;

    const busFilters = (this._filters.bus||[]).map(v => this._normalize(v)).filter(Boolean);
    const cateFilters = (this._filters.cate||[]).map(v => this._normalize(v)).filter(Boolean);
    const activityFilters = (this._filters.activity||[]).map(v => this._normalize(v)).filter(Boolean);
    const ageFilters = (this._filters.age||[]).map(v => this._normalize(v)).filter(Boolean);

    this._cards.forEach(card => {
      const busVal = this._normalize(card.getAttribute("bus"));
      const cateVal = this._normalize(card.getAttribute("cate"));
      const activityVal = this._normalize(card.getAttribute("activity"));
      const ageVal = this._normalize(card.getAttribute("age"));

      const matchBus = busFilters.length === 0 || (busVal && busFilters.some(f => busVal.includes(f)));

      const matchCate = cateFilters.length === 0 || (cateVal && cateFilters.some(f => cateVal.includes(f)));

      const matchActivity = activityFilters.length === 0 || (activityVal && activityFilters.some(f => activityVal.includes(f)));

      const matchAge = ageFilters.length === 0 || (ageVal && ageFilters.some(f => ageVal.includes(f)));

      const visible = matchBus && matchCate && matchActivity && matchAge;

      card.style.display = visible ? "" : "none";
    });
  }

  _normalize(value) {
    return value ? value.toString().trim().toLowerCase() : "";
  }
}

customElements.define("ag-spot-manager", AgSpotManager);
