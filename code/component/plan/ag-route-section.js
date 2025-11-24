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
                <div class="top-route">
                    <svg role="img" area-label="route">
                        <use xlink:href="../styles/icons.svg#top-route"></use>
                    </svg>
                    <button type="button" class="add-btn">Нэмэх</button>
                </div>

                <div class="rt-details">
                    <svg id="drag" role="icon" aria-label="drag">
                            <use xlink:href="../styles/icons.svg#drag"></use>
                        </svg>
                    <div class="text-box">    
                        <h3>Аяллын цэгийн гарчиг</h3>
                        <p class="loc_text">Газрын байршил</p>
                        <p>Энэ тайлбарт эхлэх үнэ, цагийн хуваарь байх болно. Мөн анхаарах зүйлсийг хүн өөрөө нэмэлтээр оруулж өөрчилж болно.</p>
                    </div>
                    <img src="../files/spot-img/11statue1.jpg" alt="">
                    <!-- <span class="delete">Цуцлах</span> -->
                    <!-- place this inside your route-section HTML where .inst previously байсан -->
                    <div class="inst" aria-live="polite">
                        <div class="inst-select">
                            <label for="guideSelect">Хөтөч сонгох</label>
                            <select id="guideSelect" aria-label="Guide select">
                            <option value="">Сонгох</option>
                            </select>
                        </div>

                        <div class="inst-card" id="instCard" hidden>
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
                            <div class="inst-actions">
                                <button id="contactBtn" type="button">Захиалах</button>
                                <button id="profileBtn" type="button">Дэлгэрэнгүй</button>
                            </div>
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