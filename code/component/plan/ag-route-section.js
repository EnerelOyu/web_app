class routeSection  extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const image=this.getAttribute("image") || "../files/11statue1.jpg";
        const title = this.getAttribute("title") ||"Unknown";
        const location = this.getAttribute("area") || "unknown";
        const guide = this.getAttribute("guide") || "Unknown"
        this.innerHTML=`<section>
            <div class="route-divider">
                <!-- <div class ><svg><use href="../styles/icons.svg#route-dash"></use></svg> </div> -->
                <div class="divider-line"></div>
                <div class="divider-content">
                    <button class="add-block-btn">
                        <svg>
                            <use href="../styles/icons.svg#icon-add"></use>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Route item -->
            <div class="route-item" draggable="true">
                <div class="drag-handle">
                    <svg>
                        <use href="../styles/icons.svg#drag"></use>
                    </svg>
                </div>

                <!-- Main content -->
                <div class="route-main">
                    <!-- Place info -->
                    <div class="place-info">
                        <div class="place-header">
                            <h3 class="place-title">Аяллын цэгийн гарчиг</h3>
                            <p class="location-text">Газрын байршил</p>
                        </div>
                        <div class="place-description">
                            <p>Энэ бол тухайн газрын дэлгэрэнгүй тайлбар юм. Энэ тайлбарт эхлэх үнэ, цагийн хуваарь байх болно. Мөн анхаарах зүйлсийг хүн өөрөө нэмэлтээр оруулж өөрчилж болно.</p>
                        </div>
                    </div>

                    <!-- Image and Inst section -->
                    <div class="media-section">
                        <!-- Image -->
                        <div class="place-image">
                            <div class="image-container">
                                <img src="../files/spot-img/11statue1.jpg" alt="Аяллын цэгийн зураг">
                            </div>
                        </div>

                        <!-- Inst section -->
                        <div class="inst" aria-live="polite">
                            <div class="inst-select" id="instSelect">
                                <label for="guideSelect">Хөтөч сонгох</label>
                                <select id="guideSelect" aria-label="Guide select">
                                    <option value="">Сонгох</option>
                                </select>
                            </div>

                            <div class="inst-card" id="instCard" hidden>
                                <button class="change-guide-btn" id="changeGuideBtn" aria-label="Change guide">
                                    <svg>
                                        <use href="../styles/icons.svg#icon-change"></use>
                                    </svg>
                                </button>
                                
                                <div class="inst-card-left">
                                    <img id="instPhoto" src="../files/spot-img/zurag.jpg" alt="Guide photo">
                                </div>
                                <div class="inst-card-right">
                                    <h4 id="instName">Хөтөчийн нэр</h4>
                                    <div class="inst-rating" id="instRating" aria-hidden="true">
                                        <!-- stars inserted by JS -->
                                    </div>
                                    <p class="inst-meta"><strong>Байрлал:</strong> <span id="instArea"></span></p>
                                    <p class="inst-meta"><strong>Утас:</strong> <a id="instPhone" href="#">-</a></p>
                                </div>
                            </div>
                        </div>

                <!-- Right delete button -->
                <div class="route-actions">
                    <button class="delete-btn">
                        <svg>
                            <use href="../styles/icons.svg#icon-trash"></use>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
            </div>
        </section>
        `;
    }

    disconnectedCallback() {
        //implementation
    }

    attributeChangedCallback(name, oldVal, newVal) {
        //implementation
    }

    adoptedCallback() {
        //implementation
    }
}
window.customElements.define('route-section', routeSection);