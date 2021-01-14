import "./styles.scss";
import ContentEditable from "./content-editable";
import TextArea from "./text-area";
import { nonBlockingLoop } from "./utils";
import Highlight from "./highlight";

const COLORS = ['deeppink', 'red', 'green', 'blue', 'yellow', 'orange', 'purple']

class Highlighter {
  constructor(lookup) {
    this.elements = [];
    this.lookup = lookup;

    const resizeObserver = new ResizeObserver(() => {
      this.process();
    });
    resizeObserver.observe(document.body);
  }

  addElement(element) {
    element.style.outline = COLORS[this.elements.length % COLORS.length] + ' solid 1px';

    if (element.isContentEditable) {
      this.elements.push(new ContentEditable(element, this.lookup));
    } else if (element.tagName === "TEXTAREA") {
      this.elements.push(new TextArea(element, this.lookup));
    } else {
      this.elements.push(new Highlight(element, this.lookup));
    }
  }

  addElements(elements) {
    for (let element of elements) {
      this.addElement(element);
    }
  }

  process() {
    nonBlockingLoop(element => {
      element.process();
    }, this.elements);
  }
}

const highlighter = new Highlighter("voluptate");
// highlighter.addElement(document.getElementById("any-text"));
// highlighter.addElement(document.getElementById("any-text-with-scroll"));
// highlighter.addElements(document.querySelectorAll("[contenteditable]"));
// highlighter.addElements(document.querySelectorAll("textarea"));
highlighter.addElement(document.getElementById("textarea-fixed-size"));
highlighter.process();
