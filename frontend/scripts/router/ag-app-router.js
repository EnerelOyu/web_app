class AppRouter extends HTMLElement {
  constructor() {
    super();
    // Замууд - path -> HTML template
    // Жишээ: '/home' -> '<ag-page-home></ag-page-home>'
    this.routes = new Map();

    // onRouteChange функцийн this-ийг тогтоох 
    this.onRouteChange = this.onRouteChange.bind(this);
  }

  /* Element DOM дээр холбогдох үед дуудагдана 
  Window-ийн hashchange event сонсож эхэлнэ
   */
  connectedCallback() {
    // URL-ийн hash өөрчлөгдөх бүрт route солих
    window.addEventListener("hashchange", this.onRouteChange);

    // Эхний ачаалал дээр шууд хуудсыг зурах
    this.onRouteChange();
  }

  /* Element DOM-оос салгах үед дуудагдана event listener-ийг цэвэрлэх */
  disconnectedCallback() {
    window.removeEventListener("hashchange", this.onRouteChange);
  }

  /**
   * Шинэ route бүртгэх
   *
   * @param {string} path - Замын нэр 
   * @param {string} template - Харуулах HTML template
   */
  registerRoute(path, template) {
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    this.routes.set(path, template);
  }

  /**
   * Одоогийн URL hash-аас замыг гаргаж авах
   * @returns {string} 
   */
  getCurrentPath() {
    // Hash байхгүй бол default нүүр хуудас
    let hash = window.location.hash || "#/home";

    // '#' тэмдгийг хасах
    let noHash = hash.replace(/^#/, "");

    // Query параметр (? -ээс хойш) хасах
    const [pathPart] = noHash.split("?");

    // Зам байхгүй бол default нүүр хуудас
    let path = pathPart || "/home";

    // Эхэнд '/' байхгүй бол нэмж өгнө
    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    return path;
  }

  //Route өөрчлөгдөх үед дуудагдах функц одоогийн URL-д тохирсон хуудсыг олж, харуулна
  onRouteChange() {
    // Одоогийн зам авах
    const path = this.getCurrentPath();

    // Тухайн замд бүртгэгдсэн template олох
    // Олдохгүй бол нүүр хуудас харуулна
    const template = this.routes.get(path) || this.routes.get("/home");

    // Template олдохгүй бол алдааны мессеж
    if (!template) {
      this.innerHTML = `<p>Page not found</p>`;
      return;
    }

    // Шинэ хуудсыг харуулах
    this.innerHTML = template;

    // Хуудас солигдоход хамгийн дээр нь гүйлгэх
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

customElements.define("ag-app-router", AppRouter);
