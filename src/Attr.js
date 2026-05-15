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

// Regex to extract all numbers from a path string
const PATH_NUM_RE = /-?[\d.]+(?:e[+-]?\d+)?/gi;

// Extract the "template" (letters + structure) and numbers from a path string
function parsePath(d) {
  const nums = [];
  const template = d.replace(PATH_NUM_RE, (match) => {
    nums.push(parseFloat(match));
    return "\0";
  });
  return { template, nums };
}

// Reconstruct a path string from a template and interpolated numbers
function buildPath(template, nums) {
  let i = 0;
  return template.replace(/\0/g, () => {
    const val = nums[i++];
    return val % 1 === 0 ? String(val) : val.toFixed(2);
  });
}

/**
 * Attr Effect — animates numeric SVG/DOM attributes directly.
 *
 * Numeric attributes:
 *   new Attr({ animatedAttrs: { x1: 100, y1: 200 } }, { selector: "#myLine", duration: 500 })
 *
 * Path (string) attributes — animates all numbers in the path string:
 *   new Attr(
 *     { animatedAttrs: { d: "M 200,50 C 200,150 300,150 300,250" } },
 *     { selector: "#myPath", duration: 1000 }
 *   )
 *   Both start and end paths must have the same command structure (same letters, same number count).
 *
 * Composite attributes:
 *   new Attr({ animatedAttrs: { viewBox: { minX: 0, minY: 0, width: 800, height: 600 } } }, ...)
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

    // Detect path (string) mode
    this._isPath = typeof this.targetValue === "string";
    if (this._isPath) {
      const initial = typeof this.initialValue === "string"
        ? this.initialValue
        : (this.element.getAttribute(this._svgAttr) || "");

      this._pathStart = parsePath(initial);
      this._pathEnd = parsePath(this.targetValue);

      if (this._pathStart.nums.length !== this._pathEnd.nums.length) {
        this._pathError = true;
        if (typeof console !== "undefined") {
          console.error(
            `[mc-attr] Path interpolation error: start path has ${this._pathStart.nums.length} numbers, ` +
            `end path has ${this._pathEnd.nums.length}. They must match. Attribute: "${this._svgAttr}".`
          );
        }
      }
    }
  }

  getScratchValue() {
    if (this._compositeInfo) {
      return this._getCompositePartValue();
    }
    const raw = this.element.getAttribute(this._svgAttr);
    if (this._isPath || typeof this.targetValue === "string") {
      return raw || "";
    }
    return parseFloat(raw) || 0;
  }

  onProgress(ms) {
    const f = ms / this.props.duration;

    // Path (string) mode
    if (this._isPath) {
      if (this._pathError) return; // non-breaking: just don't animate
      const startNums = this._pathStart.nums;
      const endNums = this._pathEnd.nums;
      const interpolated = startNums.map((s, i) => s + (endNums[i] - s) * f);
      this.element.setAttribute(this._svgAttr, buildPath(this._pathEnd.template, interpolated));
      return;
    }

    // Composite mode
    if (this._compositeInfo) {
      const value = this.initialValue + (this.targetValue - this.initialValue) * f;
      this._setCompositePartValue(value);
      return;
    }

    // Simple numeric mode
    const value = this.initialValue + (this.targetValue - this.initialValue) * f;
    this.element.setAttribute(this._svgAttr, value);
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
