import Attr from "./Attr.js";
import pkg from "../package.json";

const { name, version } = pkg;

// Simple numeric attributes — all accept a single number
const numericRule = { type: "number", optional: true };
const stringRule = { type: "string", optional: true };

const attrValidationRules = {
  animatedAttrs: {
    type: "object",
    props: {
      // ── SVG path (string interpolation) ─────────────────────────────
      d: stringRule,

      // ── SVG geometry ────────────────────────────────────────────────
      x: numericRule,
      y: numericRule,
      width: numericRule,
      height: numericRule,
      cx: numericRule,
      cy: numericRule,
      r: numericRule,
      rx: numericRule,
      ry: numericRule,
      x1: numericRule,
      y1: numericRule,
      x2: numericRule,
      y2: numericRule,
      dx: numericRule,
      dy: numericRule,
      rotate: numericRule,
      pathLength: numericRule,
      textLength: numericRule,
      startOffset: numericRule,
      offset: numericRule,

      // ── SVG presentation (camelCase → kebab-case in Attr.js) ────────
      opacity: numericRule,
      strokeWidth: numericRule,
      strokeOpacity: numericRule,
      fillOpacity: numericRule,
      strokeDashoffset: numericRule,
      strokeMiterlimit: numericRule,
      fontSize: numericRule,
      letterSpacing: numericRule,

      // ── Composite: viewBox ──────────────────────────────────────────
      viewBox: {
        type: "object",
        optional: true,
        props: {
          minX: numericRule,
          minY: numericRule,
          width: numericRule,
          height: numericRule,
        },
      },

      // ── Composite: strokeDasharray ──────────────────────────────────
      strokeDasharray: {
        type: "object",
        optional: true,
        props: {
          dash: numericRule,
          gap: numericRule,
        },
      },
    },
  },
};

const compositeAttributes = {
  viewBox: ["minX", "minY", "width", "height"],
  strokeDasharray: ["dash", "gap"],
};

export default {
  npm_name: name,
  version: version,
  incidents: [
    {
      exportable: Attr,
      name: "Attr",
      attributesValidationRules: attrValidationRules,
      compositeAttributes: compositeAttributes,
    },
  ],
};
