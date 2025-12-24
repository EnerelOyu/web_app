// router/app-router.js
class AppRouter extends HTMLElement {
  constructor() {
    super();
    // path -> template map
    this.routes = new Map();
    this.onRouteChange = this.onRouteChange.bind(this);
  }

  connectedCallback() {
    // Hash өөрчлөгдөх бүрт route солих
    window.addEventListener("hashchange", this.onRouteChange);

    // Эхний ачаалал дээр шууд зурагдаж байг
    this.onRouteChange();
  }

  disconnectedCallback() {
    window.removeEventListener("hashchange", this.onRouteChange);
  }

  /**
   * index.html дотроос:
   *   router.registerRoute('/home', '<page-home></page-home>');
   * гэх мэтээр дуудагдана
   */
  registerRoute(path, template) {
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    this.routes.set(path, template);
  }

  /**
   * '#/home' → '/home'
   * '#/spots' → '/spots'
   */
  getCurrentPath() {
    let hash = window.location.hash || "#/home";

    // '#/spot-info?id=xxx' → '/spot-info?id=xxx'
    let noHash = hash.replace(/^#/, "");

    // '/spot-info?id=xxx' → ['/spot-info', 'id=xxx']
    const [pathPart] = noHash.split("?");

    let path = pathPart || "/home";

    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    return path;
  }


  onRouteChange() {
    const path = this.getCurrentPath(); // ж: '/spots'
    const template = this.routes.get(path) || this.routes.get("/home");

    if (!template) {
      this.innerHTML = `<p>Page not found</p>`;
      return;
    }

    // Шинэ page-ийг үзүүлэх
    this.innerHTML = template;

    // Route солигдоход хамгийн дээр нь гүйлгэж өгвөл гоё
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

customElements.define("ag-app-router", AppRouter);
