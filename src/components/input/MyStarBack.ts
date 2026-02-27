import { LitElement, html, css, unsafeCSS, type PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";
import tailwindcss from "../../style/tailwind.css?inline";
import indexcss from "../../style/index.css?inline";
import StarUp from "../../assets/Home/star_up.png";
import StarMiddle from "../../assets/Home/star_middle.png";
import StarDown from "../../assets/Home/star_down.png";
import { sleep } from "../../utils/all";

@customElement("my-star-back")
export class MyStarBack extends LitElement {
  static styles = css`
    ${unsafeCSS(tailwindcss)}
    ${unsafeCSS(indexcss)}
  `;

  // 存储生成的图层元素
  private layers: HTMLImageElement[] = [];

  // 绑定事件处理函数，确保移除时引用一致
  private _handleMouseMove = this.handleMouseMove.bind(this);

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("mousemove", this._handleMouseMove);
  }

  disconnectedCallback(): void {
    window.removeEventListener("mousemove", this._handleMouseMove);
    super.disconnectedCallback();
  }

  async firstUpdated(_changedProperties: PropertyValues) {
    await sleep(100); // 保留原有延迟逻辑

    const back = this.renderRoot.querySelector(".back") as HTMLDivElement;
    if (!back) return;

    // 清空之前可能残留的图层（重新渲染时）
    this.layers.forEach(layer => layer.remove());
    this.layers = [];

    for (let i = 0; i < 3; i++) {
      const starback = document.createElement("img");
      starback.src = [StarDown, StarMiddle, StarUp][i];
      starback.style.maxHeight = "none";
      starback.style.maxWidth = "none";
      starback.style.width = `${i * 30 + 80}vw`;
      starback.style.height = `${i * 30 + 80}vh`;
      starback.style.zIndex = (i + 1).toString();
      starback.style.position = "absolute";
      starback.style.transition = "transform 0.2s ease-out";
      starback.classList.add("starback");
      starback.setAttribute("data-speed", (i * 40 + 20).toString());

      back.appendChild(starback);
      this.layers.push(starback);
    }
  }

  private handleMouseMove(e: MouseEvent): void {
    const x = window.innerWidth / 2 - e.pageX;
    const y = window.innerHeight / 2 - e.pageY;

    this.layers.forEach((layer) => {
      const speed = parseInt(layer.getAttribute("data-speed")!);
      const xPos = (x * speed) / 500;
      const yPos = (y * speed) / 500;
      layer.style.transform = `translateX(${xPos}px) translateY(${yPos}px)`;
    });
  }

  render() {
    return html`
      <div class="back w-screen h-screen flex flex-col items-center justify-center fixed top-0 left-0 overflow-hidden bg-img-full bg-[url(/src/assets/Home/back.jpg)]">
      </div>
    `;
  }
}