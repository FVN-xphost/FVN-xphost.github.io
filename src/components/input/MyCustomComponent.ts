import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * 以下内容借鉴了 AI，感谢 DeepSeek 老师！！
 * 颤抖文本标签
 */
@customElement('c-scare')
export class ScareElement extends LitElement {
    // 静态标志，确保全局样式只添加一次
    static hasAddedStyle = false;

    // 不使用 Shadow DOM，直接渲染到 light DOM
    createRenderRoot() {
        return this;
    }

    connectedCallback() {
        super.connectedCallback();
        // 如果样式尚未添加，则插入到 <head> 中
        if (!ScareElement.hasAddedStyle) {
            const style = document.createElement('style');
            // 定义样式字符串（使用模板字符串，方便阅读）
            style.textContent = `
  .scare-char {
    display: inline-block;
    animation: scare-shake 0.2s infinite ease-in-out;
  }
  @keyframes scare-shake {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(var(--dx1, 0), var(--dy1, 0)); }
    50% { transform: translate(var(--dx2, 0), var(--dy2, 0)); }
    75% { transform: translate(var(--dx3, 0), var(--dy3, 0)); }
  }`;
            document.head.appendChild(style);
            ScareElement.hasAddedStyle = true;
        }
    }

    firstUpdated() {
        this._processContent();
    }

    // 处理所有文本节点，将其拆分为带动画的字符 span
    private _processContent() {
        const walker = document.createTreeWalker(
            this,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // 忽略空白节点（可根据需要调整）
                    if (node.textContent?.trim() === '') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes: Text[] = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode as Text);
        }

        for (const node of textNodes) {
            this._splitTextNode(node);
        }
    }

    private _splitTextNode(textNode: Text) {
        const parent = textNode.parentNode;
        if (!parent) return;

        const text = textNode.textContent || '';
        const chars = Array.from(text); // 正确处理 Unicode 字符

        const fragment = document.createDocumentFragment();

        for (const char of chars) {
            // 生成随机偏移量（-1.5px 到 1.5px）
            const dx = (Math.random() * 3 - 1.5).toFixed(1);
            const dy = (Math.random() * 3 - 1.5).toFixed(1);

            const span = document.createElement('span');
            span.className = 'scare-char';
            // 设置 CSS 变量，用于动画中的不同阶段
            span.style.setProperty('--dx1', dx + 'px');
            span.style.setProperty('--dy1', dy + 'px');
            span.style.setProperty('--dx2', (-dy) + 'px');
            span.style.setProperty('--dy2', dx + 'px');
            span.style.setProperty('--dx3', (-dx) + 'px');
            span.style.setProperty('--dy3', (-dy) + 'px');
            span.textContent = char;

            fragment.appendChild(span);
        }

        parent.replaceChild(fragment, textNode);
    }
}

/**
 * 彩虹文字标签
 */
@customElement('c-rainbow')
export class RainbowElement extends LitElement {
  static styles = css`
    :host {
      display: inline-block; /* 让组件表现为内联元素，适合包裹文本 */
    }
    .rainbow-text {
      display: inline-block;
      /* 彩虹渐变：红橙黄绿蓝靛紫 */
      background: linear-gradient(
        90deg,
        #ff0000,
        #ff7f00,
        #ffff00,
        #00ff00,
        #0000ff,
        #4b0082,
        #8f00ff,
        #ff0000
      );
      background-size: 200% auto;    /* 放大背景宽度，为移动留出空间 */
      background-clip: text;          /* 标准属性 */
      -webkit-background-clip: text;  /* 兼容 WebKit 浏览器 */
      color: transparent;             /* 隐藏原始文字颜色，露出背景 */
      animation: rainbow-flow 6s linear infinite;
    }
    @keyframes rainbow-flow {
      0% {
        background-position: 0% center;
      }
      100% {
        background-position: 200% center; /* 移动整个渐变宽度，形成流动 */
      }
    }
  `;

  render() {
    return html`
      <div class="rainbow-text">
        <slot></slot> <!-- 此处插入外部内容 -->
      </div>
    `;
  }
}