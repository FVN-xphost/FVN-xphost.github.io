import { LitElement, html, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import "../../../components/input/MyMenuButton";
import tailwindcss from "../../../style/tailwind.css?inline";
import indexcss from "../../../style/index.css?inline";
import George from "../../../assets/illustration/george.png";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

@customElement("my-input-name")
export class MyInputName extends LitElement {
  static styles = css`
    ${unsafeCSS(tailwindcss)}
    ${unsafeCSS(indexcss)}
  `;
  @property({ type: Function }) result: (res: string) => void = (_) => {};
  value = "";
  isMount = false;
  private _onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
  }
  returnResult(index: number) {
    this.result(this.value);
  }

  render() {
    return html`
      <div class="fixed top-0 left-0 w-screen h-screen bg-black z-999">
        <div
          class="absolute left-0 w-screen transition-[top] duration-300 min-h-[20vh] bg-yellow-300 z-10 flex flex-col items-center"
          style=${this.isMount
            ? "margin-top: 0; margin-bottom: 0; top: 20vh;"
            : "margin-top: auto; margin-bottom: auto; top: 0; bottom: 0; height: fit-content;"}
        >
          <div
            class="h-[50%] w-[50vh] border-l-8 border-l-black shrink-0 flex items-center"
            style=${this.isMount
              ? ""
              : "top: 0; bottom: 0; height: fit-content; margin-top: auto; margin-bottom: auto;"}
          >
            <input
              @blur=${this._onInput}
              placeholder="请输入名字"
              class="outline-none border-none pl-[2vh] font-bold"
              style="font-size: 6vh"
            />
          </div>
          ${this.isMount
            ? html`<div class="h-[50%] w-[100vh] flex items-center justify-end">
                <div class="text-left pl-[24vh]" style="font-size: 2vh">
                  你是Aa-ω-7太空港垃圾分类操作中心的一名员工。<br />
                  得益于慷慨的员工成长计划，你能认得操作手册上的每一个字，并且肢体齐全。<br />
                  在其他方面……总之，你的能力足够让自己活到现在。加油，在未来继续保持。
                </div>
              </div>`
            : html``}
        </div>
        <div
          class="border border-yellow-300 border-solid absolute top-0 left-0 right-0 bottom-0 m-auto w-[105vh] h-[80vh]"
        >
          <div
            class="absolute top-4 right-4 text-gray-300"
            style="font-size: 2vh"
          >
            回想你的名字
          </div>
          <div
            class="absolute bottom-4 left-0 w-full flex flex-col items-center"
          >
            <div
              class="border-l-8 border-l-yellow-300 font-bold pl-6 -ml-6 text-yellow-300"
              style="font-size: 6vh"
            >
              办公室
            </div>
            <div
              class="text-center text-yellow-300 relative mt-4"
              style="font-size: 2vh"
            >
              你的面前是一间办公室。<br />
              准确的来说是一扇办公室的门，你还没有进去的打算，也尚未敲响它。<br />
              20分钟前，你收到通知。<br />
              这是你本行星年里第一次中断工作。<br />
              出来时太过匆忙，以至于现在回想不起来，到底有没有关掉磁源机械臂，<br />
              也许它还在那边重复着抓取、放下、抓取、放下……<br />
              你感到冷，疲惫也跟着翻涌上来。<br />
              走廊空调新风口的挡板坏掉了，机器的嗡嗡声伴着冷气一起垂降在你头顶。<br />
              你再次看向了那扇门。
            </div>
          </div>
        </div>
        <img
          src="${George}"
          alt="George"
          class="absolute top-[6vh] -left-[85vh] right-0 mx-auto h-[94vh] z-20"
        />
        <button
          class="absolute cursor-pointer bottom-[2.5vh] h-[5vh] mx-auto left-0 right-0 w-[50vh] bg-white text-black hover:bg-yellow-300 active:bg-black active:text-white"
          @click=${this.returnResult}
        >
          敲门
        </button>
      </div>
    `;
  }
}
