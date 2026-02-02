import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import buttonNormal from "../../assets/Home/mybutton-normal.png";
import buttonHover from "../../assets/Home/mybutton-hover.png";
import buttonActive from "../../assets/Home/mybutton-active.png";
import tailwindcss from "../../style/tailwind.css?inline";
import indexcss from "../../style/index.css?inline";

@customElement("my-menu-button")
export class MyMenuButton extends LitElement {
  @property({ type: Function }) click = () => { };
  static styles = css`
    ${unsafeCSS(tailwindcss)}
    ${unsafeCSS(indexcss)}
    .self-button {
      background-image: url(${unsafeCSS(buttonNormal)});
    }
    .self-button:hover {
      background-image: url(${unsafeCSS(buttonHover)});
    }
    .self-button:active {
      background-image: url(${unsafeCSS(buttonActive)});
    }
    .self-button:active > .button-span {
      top: 1px;
    }
    .button-span {
      font-family: Silver !important;
    }
    .button-span * {
      font-family: Silver !important;
    }
    .button-span > * {
      font-family: Silver !important;
    }
  `;
  render() {
    return html`<button
      @click=${this.click}
      style=${this.style}
      class="self-button bg-img-full w-30 h-8.75 bg-transparent border-none transition-shadow duration-200 cursor-pointer hover:shadow-[0_0_10px_#ffc148] active:shadow-[0_0_10px_#ffc148] ${this
        .className}"
    >
      <span class="button-span text-black font-bold relative -top-0.5"><slot /></span>
    </button>`;
  }
}
