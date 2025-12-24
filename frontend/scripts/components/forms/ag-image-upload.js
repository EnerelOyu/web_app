class AgImageUpload extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.onChoose = this.onChoose.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.onRemove = this.onRemove.bind(this);

    this.file = null;
    this.previewUrl = "";
  }

  connectedCallback() {
    this.render();

    this.$chooseBtn = this.shadowRoot.getElementById("chooseBtn");
    this.$fileInput = this.shadowRoot.getElementById("fileInput");
    this.$preview = this.shadowRoot.getElementById("preview");
    this.$placeholder = this.shadowRoot.getElementById("placeholder");
    this.$removeBtn = this.shadowRoot.getElementById("removeBtn");

    this.$chooseBtn.addEventListener("click", this.onChoose);
    this.$fileInput.addEventListener("change", this.onFileChange);
    this.$removeBtn.addEventListener("click", this.onRemove);
  }

  disconnectedCallback() {
    this.$chooseBtn?.removeEventListener("click", this.onChoose);
    this.$fileInput?.removeEventListener("change", this.onFileChange);
    this.$removeBtn?.removeEventListener("click", this.onRemove);

    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
  }

  onChoose() {
    this.$fileInput.click();
  }

  onFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      this.dispatchEvent(
        new CustomEvent("image-error", {
          detail: { message: "Зөвхөн зураг (image/*) сонгоно уу." },
          bubbles: true,
          composed: true,
        })
      );
      this.$fileInput.value = "";
      return;
    }

    this.file = f;

    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = URL.createObjectURL(f);

    this.updateUI();

    this.dispatchEvent(
      new CustomEvent("image-change", {
        detail: { file: this.file },
        bubbles: true,
        composed: true,
      })
    );
  }

  onRemove() {
    this.file = null;
    this.$fileInput.value = "";

    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = "";

    this.updateUI();

    this.dispatchEvent(
      new CustomEvent("image-change", {
        detail: { file: null },
        bubbles: true,
        composed: true,
      })
    );
  }

  getFile() {
    return this.file; // parent-с авахад
  }

  updateUI() {
    const has = !!this.file;

    this.$preview.hidden = !has;
    this.$removeBtn.hidden = !has;
    this.$placeholder.hidden = has;

    if (has) {
      this.$preview.src = this.previewUrl;
      this.$preview.alt = this.file.name || "Selected image";
    } else {
      this.$preview.removeAttribute("src");
      this.$preview.alt = "";
    }
  }

  render() {
    // icon sprite path-г attribute-аар override хийж болно
    const iconPath = this.getAttribute("icon-path") || "./styles/icons.svg";
    const labelText = this.getAttribute("label") || "Зураг оруулах";
    const buttonText = this.getAttribute("button") || "Файл сонгох";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        .profile-card {
          display: flex;
          flex-direction: column;
          border: 2px dashed var(--text-color-2);
          justify-content: center;
          align-items: center;
          padding: var(--p-2xl) var(--p-xl);
          border-radius: var(--br-m);
          gap: var(--gap-size-m);
          transition: all 0.3s ease;
          background-color: var(--primary-5);
          position: relative;
          min-height: 300px;
        }

        .profile-card:hover {
          border-color: var(--primary);
          background-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        #placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--gap-size-s);
          transition: opacity 0.3s ease;
        }

        .profile-card svg {
          width: var(--svg-m);
          height: var(--svg-m);
          color: var(--primary);
          transition: all 0.3s ease;
        }

        .profile-card:hover svg {
          color: var(--secondary);
          transform: scale(1.1);
        }

        .profile-card p {
          text-transform: uppercase;
          font-family: 'NunitoSans';
          font-size: var(--fs-sm);
          color: var(--text-color-2);
          font-weight: 600;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .upload-btn {
          background-color: var(--primary);
          color: var(--primary-5);
          text-transform: uppercase;
          font-size: var(--fs-xs);
          font-family: 'NunitoSans';
          font-weight: 600;
          border-radius: var(--br-m);
          border: none;
          padding: var(--p-xs) var(--p-md);
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          letter-spacing: 0.5px;
        }

        .upload-btn:hover {
          background-color: var(--secondary);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .upload-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .preview {
          width: 200px;
          height: 200px;
          object-fit: cover;
          border-radius: var(--br-m);
          border: 3px solid var(--primary);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          animation: fadeIn 0.4s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .preview:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .actions {
          display: flex;
          gap: var(--gap-size-m);
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }

        .remove-btn {
          background: transparent;
          border: 2px solid var(--text-color-2);
          color: var(--text-color-2);
          border-radius: var(--br-m);
          padding: var(--p-xs) var(--p-md);
          font-family: 'NunitoSans';
          font-weight: 600;
          text-transform: uppercase;
          font-size: var(--fs-xs);
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
        }

        .remove-btn:hover {
          background-color: #ff4444;
          border-color: #ff4444;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(255, 68, 68, 0.3);
        }

        .remove-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(255, 68, 68, 0.2);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .profile-card {
            padding: var(--p-lg) var(--p-md);
            min-height: 250px;
          }

          .preview {
            width: 160px;
            height: 160px;
          }

          .upload-btn,
          .remove-btn {
            font-size: var(--fs-xxs);
            padding: var(--p-xxs) var(--p-sm);
          }
        }

        @media (max-width: 480px) {
          .profile-card {
            padding: var(--p-md);
            min-height: 220px;
          }

          .preview {
            width: 140px;
            height: 140px;
          }

          .actions {
            flex-direction: column;
            gap: var(--gap-size-s);
          }

          .upload-btn,
          .remove-btn {
            width: 100%;
            max-width: 200px;
          }
        }
      </style>

      <div class="profile-card">
        <div id="placeholder">
          <svg aria-hidden="true">
                <use href="/styles/icons.svg#icon-camera"></use>
          </svg>
            <p class="profile-text">Зураг оруулах</p>
        </div>

        <img id="preview" class="preview" hidden />

        <div class="actions">
          <button class="upload-btn" id="chooseBtn" type="button">${buttonText}</button>
          <button class="remove-btn" id="removeBtn" type="button" hidden>Арилгах</button>
        </div>

        <input type="file" id="fileInput" accept="image/*" hidden>
      </div>
    `;
  }
}

customElements.define("ag-image-upload", AgImageUpload);
export default AgImageUpload;
