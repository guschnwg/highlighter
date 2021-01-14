const EXCLUDED_ELEMENTS = ["script", "style", "meta", "link"];

export default class Highlight {
  constructor(element, lookup) {
    this.highlights = [];
    this.element = element;
    this.lookup = lookup;
    this.highlightContainer = document.body;

    this.nodes = this.textNodesUnder();

    this.process = this.process.bind(this);
    this.element.addEventListener("scroll", this.process);
  }

  removeHighlights() {
    for (let highlight of this.highlights) {
      highlight.remove();
    }
    this.highlights = [];
  }

  process() {
    // Would be better just to reposition, but let's keep this way for now
    this.removeHighlights();

    for (let node of this.nodes) {
      const indexes = this.indexes(node.textContent, this.lookup);

      for (let index of indexes) {
        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + this.lookup.length);

        this.processHighlight(range, "deeppink", "Hey");
      }
    }
  }

  textNodesUnder() {
    const walk = document.createTreeWalker(
      this.element,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    const nodes = [];
    let node = walk.nextNode();

    while (node) {
      if (!EXCLUDED_ELEMENTS.includes(node.parentElement.tagName)) {
        nodes.push(node);
      }
      node = walk.nextNode();
    }

    return nodes;
  }

  indexesForRegex(text, regex) {
    const indices = [];
    let result = regex.exec(text);

    while (result) {
      indices.push(result.index);
      result = regex.exec(text);
    }

    return indices;
  }

  indexes(text = "", lookup = "") {
    const regex = new RegExp(`\\b(${lookup})\\b`, "g");

    return this.indexesForRegex(text, regex);
  }

  processHighlight(range, color, message) {
    const rects = range.getClientRects();
    const elementPosition = this.element.getBoundingClientRect();

    for (let rect of rects) {
      const { top: rectTop, left: leftTop, width, height } = rect.toJSON();

      const top = Math.floor(rectTop + height - 4 + window.scrollY);
      const left = Math.floor(leftTop + window.scrollX);

      if (
        top < elementPosition.top ||
        top > elementPosition.top + elementPosition.height ||
        left < elementPosition.left ||
        left > elementPosition.left + elementPosition.width
      ) {
        continue;
      }

      const element = document.createElement("div");
      element.setAttribute("class", "highlight");

      element.style.top = top + "px";
      element.style.left = left + "px";
      element.style.width = Math.floor(width) + "px";
      element.style.setProperty("--background", color);

      this.highlightContainer.appendChild(element);
      this.highlights.push(element);

      if (message) {
        const hint = document.createElement("div");
        hint.setAttribute("class", "highlight-message");
        hint.innerText = message.replace(/`/g, '"');
        element.appendChild(hint);
      }
    }
  }
}
