class AgSpotManager extends HTMLElement {
  constructor() {
    super();
    // Бүх spot-card ийг хадгална
    this._cards = [];
    this._filters = {
      bus: [],        
      cate: [],       
      activity: [],  
      rating: [],     
    };

    this._onFilterChanged = this._onFilterChanged.bind(this);
  }


  connectedCallback() {
    // Бүх app-spot-card элементүүдийг олоод хадгална
    const container = this.closest(".spot-cards-container") || document;
    this._cards = Array.from(container.querySelectorAll("app-spot-card"));

    // URL query params-ыг уншиж анхны шүүлт хийх
    this._applyInitialFiltersFromURL();

    // Filter өөрчлөгдөх event-г сонсох
    document.addEventListener("filter-changed", this._onFilterChanged);
  }


  disconnectedCallback() {
    document.removeEventListener("filter-changed", this._onFilterChanged);
  }


  _applyInitialFiltersFromURL() {
    // URL hash-аас query string-ийг салгах 
    const hash = window.location.hash;
    const queryString = hash.includes('?') ? hash.split('?')[1] : '';
    const params = new URLSearchParams(queryString);

    // Query params-ыг уншиж filter-т хадгалах
    const bus = params.get("bus");
    const cate = params.get("cate");

    if (bus)  this._filters.bus  = [bus];
    if (cate) this._filters.cate = [cate];

    //картуудыг шүүнэ
    this._applyFilters();

    // ag-filter-үүдийн checkbox-ийг URL-ийн утгатай тааруулж check хийнэ
    const filters = document.querySelectorAll("app-filter");

    filters.forEach(filter => {
      const type = filter.getAttribute("ner");
      let values = [];

      if (type === "Бүс нутаг") {
        values = this._filters.bus;
      } else if (type === "Kategори") {
        values = this._filters.cate;
      } else {
        return; 
      }

      if (!values || !values.length) return;

      // Утгуудыг нормалчлах 
      const normValues = values.map(v => this._normalize(v));

      // Filter доторх checkbox-уудыг олж checked хийх
      const root = filter.shadowRoot;
      if (!root) return;
      filter.querySelectorAll("input[type='checkbox']").forEach(cb => {
        const cbVal = this._normalize(cb.value);
        if (normValues.includes(cbVal)) {
          cb.checked = true;
        }
      });

      filter.update();
    });
  }


  _onFilterChanged(event) {
    const { type, values } = event.detail || {};

    const arr = Array.isArray(values) ? values : [];

    // Filter төрлөөс хамааран тохирох property-г шинэчлэх
    if (type === "Бүс нутаг") {
      this._filters.bus = arr;
    } else if (type === "Категори") {
      this._filters.cate = arr;
    } else if (type === "Үйл ажиллагаа") {
      this._filters.activity = arr;
    } else if (type === "Үнэлгээ") {
      this._filters.rating = arr;
    }

    // Шинэчлэгдсэн шүүлтүүдийг ашиглаж картуудыг дахин шүүнэ
    this._applyFilters();
  }

  //Бүх шүүлтүүдийг ашиглаж картуудыг шүүнэ

   
  _applyFilters() {
    if (!this._cards.length) return;

    // Шүүлтүүдийг нормалчлах 
    const busFilters = (this._filters.bus||[]).map(v => this._normalize(v)).filter(Boolean);
    const cateFilters = (this._filters.cate||[]).map(v => this._normalize(v)).filter(Boolean);
    const activityFilters = (this._filters.activity||[]).map(v => this._normalize(v)).filter(Boolean);
    const ratingFilters = (this._filters.rating||[]).filter(Boolean);

    this._cards.forEach(card => {
      // Картын attribute утгуудыг унших
      const busVal = this._normalize(card.getAttribute("bus"));          
      const cateVal = this._normalize(card.getAttribute("cate"));         
      const activityVal = this._normalize(card.getAttribute("activity")); 
      const ratingVal = parseFloat(card.getAttribute("unelgee")) || 0;   

      // Бүс нутагт таарах эсэх 
      const matchBus = busFilters.length === 0 || (busVal && busFilters.some(f => busVal.includes(f)));

      // Категорит таарах эсэх 
      const matchCate = cateFilters.length === 0 || (cateVal && cateFilters.some(f => cateVal.includes(f)));

      // Үйл ажиллагаанд таарах эсэх 
      const matchActivity = activityFilters.length === 0 || (activityVal && activityFilters.some(f => activityVal.includes(f)));

      // Үнэлгээнд таарах эсэх
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

      // Бүх шүүлтэд таарвал харуулна 
      const visible = matchBus && matchCate && matchActivity && matchRating;

      // DOM дээр харуулах/нуух
      card.style.display = visible ? "" : "none";
    });
  }

  _normalize(value) {
    return value ? value.toString().trim().toLowerCase() : "";
  }
}

customElements.define("ag-spot-manager", AgSpotManager);
