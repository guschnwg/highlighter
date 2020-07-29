import Highlight from "./highlight";

export default class TextArea extends Highlight {
  constructor(element, lookup) {
    super(element, lookup);

    this.originalElement = element;

    this.createMirror();

    this.originalElement.addEventListener("input", () => this.positionMirror());
    const resizeObserver = new ResizeObserver(() => this.positionMirror());
    resizeObserver.observe(this.originalElement);

    // Remove original one, just to make sure we reposition the mirror first
    this.originalElement.removeEventListener("scroll", super.process);
    this.originalElement.addEventListener("scroll", () => {
      this.positionMirror();
      super.process();
    });
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
    const textAreaStyle = getComputedStyle(this.originalElement, "");

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
    this.mirror.style.zIndex = -9999999;
    this.mirror.style.opacity = 0;
    this.mirror.textContent = this.originalElement.value;

    this.mirror.scrollTop = this.originalElement.scrollTop;
    this.mirror.scrollLeft = this.originalElement.scrollLeft;
  }
}
