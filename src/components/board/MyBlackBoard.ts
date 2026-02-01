import { LitElement, html, css, unsafeCSS } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { customElement, property } from "lit/decorators.js";
import "../input/MyMenuButton";
import tailwindcss from "../../style/tailwind.css?inline";
import indexcss from "../../style/index.css?inline";
import board from "../../assets/Home/board.png";

@customElement("my-black-board")
export class MyBlackBoard extends LitElement {
  static styles = css`
    ${unsafeCSS(tailwindcss)}
    ${unsafeCSS(indexcss)}
    .board {
      background-image: url(${unsafeCSS(board)});
    }
  `;
  @property({ type: String })
  boardText: string = "";
  @property({ type: Function })
  close = () => {};
  render() {
    return html`<div
      class="backdrop-blur-sm fixed w-screen h-screen top-0 left-0 z-100"
    >
      <div
        class="fixed m-auto -top-25 -right-25 -bottom-90 -left-25 rounded-[10px] board bg-img-full"
      >
        <div class="fixed top-32 left-32 right-32 bottom-72">
          ${unsafeHTML(this.boardText)}
        </div>
      </div>
      <my-menu-button
        .click=${this.close}
        style="position: absolute; bottom: 60px; right: 60px;"
      >
        返回
      </my-menu-button>
    </div>`;
  }
}
