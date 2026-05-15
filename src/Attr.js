import { Effect } from "@donkeyclip/motorcortex";

// camelCase → kebab-case mapping for SVG attributes
const ATTR_MAP = {
  strokeWidth: "stroke-width",
  strokeOpacity: "stroke-opacity",
  fillOpacity: "fill-opacity",
  strokeDashoffset: "stroke-dashoffset",
  strokeMiterlimit: "stroke-miterlimit",
  fontSize: "font-size",
  letterSpacing: "letter-spacing",
  strokeDasharray: "stroke-dasharray",
};

// Composite attribute definitions: attr → { svgName, parts, separator }
const COMPOSITES = {
  viewBox: { svgName: "viewBox", parts: ["minX", "minY", "width", "height"], separator: " " },
  strokeDasharray: { svgName: "stroke-dasharray", parts: ["dash", "gap"], separator: " " },
};

/**
 * Attr Effect — animates numeric SVG/DOM attributes directly.
 *
 * Simple attributes: each animatedAttr key maps to one element attribute.
 *   new Attr({ animatedAttrs: { x1: 100, y1: 200 } }, { selector: "#myLine", duration: 500 })
 *
 * Composite attributes: sub-keys are interpolated and combined into one attribute string.
 *   new Attr({ animatedAttrs: { viewBox: { minX: 0, minY: 0, width: 800, height: 600 } } }, ...)
 *
 * Follows CSSEffect's pattern: onProgress receives the easing-applied ms from MC,
 * fraction is computed as ms / duration.
 */
export default class Attr extends Effect {
  onGetContext() {
    // Determine if this is a composite sub-attribute
    this._compositeInfo = null;
    for (const [compKey, comp] of Object.entries(COMPOSITES)) {
      if (comp.parts.includes(this.attributeKey)) {
        this._compositeInfo = { key: compKey, ...comp };
        break;
      }
    }
    this._svgAttr = ATTR_MAP[this.attributeKey] || this.attributeKey;
  }

  getScratchValue() {
    if (this._compositeInfo) {
      return this._getCompositePartValue();
    }
    const raw = this.element.getAttribute(this._svgAttr);
    return parseFloat(raw) || 0;
  }

  onProgress(ms) {
    const f = ms / this.props.duration;
    const value = this.initialValue + (this.targetValue - this.initialValue) * f;

    if (this._compositeInfo) {
      this._setCompositePartValue(value);
    } else {
      this.element.setAttribute(this._svgAttr, value);
    }
  }

  // ─── Composite helpers ──────────────────────────────────────────────────────

  _getCompositePartValue() {
    const raw = this.element.getAttribute(this._compositeInfo.svgName) || "";
    const values = raw.split(/[\s,]+/).map(Number);
    const idx = this._compositeInfo.parts.indexOf(this.attributeKey);
    return values[idx] || 0;
  }

  _setCompositePartValue(newValue) {
    const { svgName, parts, separator } = this._compositeInfo;
    const raw = this.element.getAttribute(svgName) || "";
    const values = raw.split(/[\s,]+/).map(Number);
    while (values.length < parts.length) values.push(0);
    const idx = parts.indexOf(this.attributeKey);
    values[idx] = newValue;
    this.element.setAttribute(svgName, values.join(separator));
  }
}
