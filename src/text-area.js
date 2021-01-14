import Highlight from "./highlight";

export default class TextArea extends Highlight {
  constructor(element, lookup) {
    super(element, lookup);

    this.originalElement = element;

    this.createMirror();

    this.process = this.process.bind(this);

    this.originalElement.addEventListener("input", this.process);

    const resizeObserver = new ResizeObserver(this.process);
    resizeObserver.observe(this.originalElement);

    this.originalElement.removeEventListener("scroll", super.process);
    this.originalElement.addEventListener("scroll", this.process);
  }

  createMirror() {
    this.mirror = document.createElement("div");

    this.positionMirror();

    document.body.appendChild(this.mirror);

    this.element = this.mirror;
    this.nodes = this.textNodesUnder();
  }

  positionMirror() {
    const { top, left } = this.originalElement.getBoundingClientRect();
    const textAreaStyle = getComputedStyle(this.originalElement);

    this.mirror.style.cssText = textAreaStyle.cssText;
    this.mirror.style.position = "absolute";
    this.mirror.style.top = top + window.scrollY + "px";
    this.mirror.style.left = left + window.scrollX + "px";
    this.mirror.style.width = this.originalElement.offsetWidth + "px";
    this.mirror.style.height = this.originalElement.offsetHeight + "px";
    this.mirror.style.marginTop = "";
    this.mirror.style.marginLeft = "";
    this.mirror.style.marginRight = "";
    this.mirror.style.marginBottom = "";
    this.mirror.style.marginBlockStart = "";
    this.mirror.style.marginBlockEnd = "";
    this.mirror.style.marginInlineStart = "";
    this.mirror.style.marginInlineEnd = "";
    this.mirror.style.zIndex = -9999999;
    this.mirror.style.opacity = 0;
    this.mirror.textContent = this.originalElement.value;

    this.mirror.scrollTop = this.originalElement.scrollTop;
    this.mirror.scrollLeft = this.originalElement.scrollLeft;
  }

  process() {
    this.positionMirror();

    super.process();
  }
}
