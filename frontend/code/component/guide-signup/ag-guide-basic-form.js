class AgGuideBasicForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.onChange = this.onChange.bind(this);
  }

  connectedCallback() {
    this.render();
    this.shadowRoot.addEventListener("input", this.onChange);
  }

  disconnectedCallback() {
    this.shadowRoot.removeEventListener("input", this.onChange);
  }

  getValue() {
    const $ = (id) => this.shadowRoot.getElementById(id);
    return {
      firstName: $("fname").value.trim(),
      lastName: $("lname").value.trim(),
      phone: $("phone").value.trim(),
      email: $("email").value.trim(),
    };
  }

  onChange() {
    this.dispatchEvent(
      new CustomEvent("basic-change", {
        detail: this.getValue(),
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
        }

        form{
          display: flex;
          flex-direction: column;
          gap: var(--gap-size-m);
        }

        label{
          text-transform: uppercase;
          font-family: 'NunitoSans';
          font-size: var(--fs-sm);
          color: var(--text-color-2);
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        input{
          background-color: var(--primary-5);
          border-radius: var(--br-s);
          border: 1px solid var(--text-color-2);
          padding: var(--p-xs);
          font-family: 'NunitoSans';
          color: var(--text-color-3);
          transition: all 0.3s ease;
        }

        input::placeholder{
          font-family: 'NunitoSans';
          color: var(--text-color-3);
          opacity: 0.7;
        }

        input:hover{
          border-color: var(--primary);
        }

        input:focus{
          outline: none;
          border-color: var(--secondary);
          box-shadow: 0 0 0 2px rgba(var(--secondary-rgb, 76, 175, 80), 0.2);
        }
      </style>

      <form class="guide-info">
        <label for="fname">Овог</label>
        <input id="fname" type="text" placeholder="Овог" required>

        <label for="lname">Нэр</label>
        <input id="lname" type="text" placeholder="Нэр" required>

        <label for="phone">Утасны дугаар</label>
        <input id="phone" type="text" placeholder="Утасны дугаар" required>

        <label for="email">Цахим шуудан</label>
        <input id="email" type="email" placeholder="Цахим шуудан" required>
      </form>
    `;
  }
}

customElements.define("ag-guide-basic-form", AgGuideBasicForm);
export default AgGuideBasicForm;
