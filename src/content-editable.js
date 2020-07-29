import Highlight from "./highlight";

export default class ContentEditable extends Highlight {
  constructor(element, lookup) {
    super(element, lookup);

    element.addEventListener("input", () => {
      this.process();
    });
  }
}
