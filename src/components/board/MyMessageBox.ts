import { LitElement, html, css, unsafeCSS } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { customElement, property } from "lit/decorators.js";
import "../input/MyMenuButton";
import tailwindcss from "../../style/tailwind.css?inline";
import indexcss from "../../style/index.css?inline";
import messageBack from "../../assets/Home/messageback.png";

@customElement("my-message-box")
export class MyMessageBox extends LitElement {
  static styles = css`
    ${unsafeCSS(tailwindcss)}
    ${unsafeCSS(indexcss)}
    .message {
      background-image: url(${unsafeCSS(messageBack)});
    }
  `;
  @property({ type: String }) title: string = "";
  @property({ type: String }) content: string = "";
  @property({ type: Array<String> }) buttons: string[] = [];
  @property({ type: String }) type: "input" | "message" = "message";
  @property({ type: Function }) result: (res: string) => void = (_) => {};
  value = "";
  private _onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
  }
  isInput() {
    return this.type === "input"
      ? html`
          <input
            type="text"
            placeholder="请输入内容"
            class="text-white border-none outline-none bg-gray-300 w-[90%] h-7.5 rounded-[5px] p-1.25 mt-2.5"
            .value=${this.value}
            @input=${this._onInput}
          />
        `
      : html``;
  }
  returnResult(index: number) {
    this.result(
      this.type === "input"
        ? index === 1
          ? ""
          : this.value
        : index.toString(),
    );
  }
  render() {
    return html`
      <div class="fixed top-0 left-0 w-screen h-screen bg-[#00000077] z-999">
        <div
          class="bg-img-full message fixed top-[50%] left-[50%] transform-[translate(-50%,-50%)] w-auto min-w-100 h-75 bg-transparent p-2.5 rounded-[5px] shadow-[0_0_10px_#0000001a] z-1000 flex flex-col items-center"
        >
          <div class="text-white font-bold text-[20px] mt-7.5">
            ${unsafeHTML(this.title)}
          </div>
          <div
            class="text-white whitespace-normal overflow-hidden w-[90%] flex-1"
          >
            ${unsafeHTML(this.content)}
          </div>
          ${this.isInput()}
          <div
            class="flex mx-5 mt-2.5 mb-5 h-7.5 w-auto gap-2.5 justify-between items-start"
          >
            ${(this.type === "input" ? ["ok", "cancel"] : this.buttons).map(
              (item, index) =>
                html`<my-menu-button .click=${() => this.returnResult(index)}>
                  ${unsafeHTML(
                    { ok: "确认", cancel: "取消", yes: "是", no: "否" }[item] ??
                      item,
                  )}
                </my-menu-button>`,
            )}
          </div>
        </div>
      </div>
    `;
  }
}
