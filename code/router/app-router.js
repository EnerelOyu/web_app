// Simple hash-based router
class AppRouter extends HTMLElement {
    constructor() {
        super();
        this.routes = new Map();
    }

    connectedCallback() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());

        // Handle initial route
        this.handleRoute();
    }

    handleRoute() {
        const hash = window.location.hash || '#/home';
        const path = hash.substring(1); // Remove #

        const routeHandler = this.routes.get(path);

        if (routeHandler) {
            this.innerHTML = routeHandler;
        } else {
            // Default to home if route not found
            window.location.hash = '#/home';
        }
    }

    registerRoute(path, component) {
        this.routes.set(path, component);
    }
}

customElements.define('app-router', AppRouter);
