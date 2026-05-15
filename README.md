# mc-attr

MotorCortex Effect plugin for animating SVG and DOM element attributes.

Animates any numeric attribute directly on the element — SVG geometry (`x1`, `y1`, `cx`, `r`, `width`, ...), presentation (`stroke-width`, `fill-opacity`, ...), and composite attributes (`viewBox`, `stroke-dasharray`).

## Installation

```bash
npm i @kissmybutton/mc-attr
```

## Usage

```js
import { loadPlugin, HTMLClip } from "@donkeyclip/motorcortex";
import Player from "@donkeyclip/motorcortex-player";
import AttrPlugin from "@kissmybutton/mc-attr";

const McAttr = loadPlugin(AttrPlugin);
```

### Animate SVG line endpoints

```js
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { x2: 500, y2: 300 } },
    { selector: "#myLine", duration: 1000, easing: "easeInOutCubic" }
  ),
  0
);
```

### Animate circle geometry

```js
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { cx: 200, cy: 150, r: 80 } },
    { selector: "#myCircle", duration: 800, easing: "easeOutBack" }
  ),
  500
);
```

### Animate stroke properties

```js
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { strokeWidth: 5, strokeDashoffset: -100 } },
    { selector: "#myPath", duration: 1200 }
  ),
  0
);
```

### Animate viewBox (composite)

```js
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { viewBox: { minX: 100, minY: 100, width: 400, height: 300 } } },
    { selector: "svg", duration: 2000, easing: "easeInOutCubic" }
  ),
  0
);
```

## Supported attributes

### SVG geometry

| Attribute | Element(s) |
|-----------|-----------|
| `x`, `y` | rect, image, text, foreignObject |
| `width`, `height` | rect, image, foreignObject, svg |
| `cx`, `cy`, `r` | circle |
| `rx`, `ry` | ellipse, rect |
| `x1`, `y1`, `x2`, `y2` | line |
| `dx`, `dy` | text, tspan |
| `rotate` | text, tspan |
| `pathLength` | path, line, circle, etc. |
| `textLength` | text |
| `startOffset` | textPath |
| `offset` | stop (gradient) |

### SVG presentation

| JS name | SVG attribute |
|---------|--------------|
| `opacity` | `opacity` |
| `strokeWidth` | `stroke-width` |
| `strokeOpacity` | `stroke-opacity` |
| `fillOpacity` | `fill-opacity` |
| `strokeDashoffset` | `stroke-dashoffset` |
| `strokeMiterlimit` | `stroke-miterlimit` |
| `fontSize` | `font-size` |
| `letterSpacing` | `letter-spacing` |

### Composite attributes

| Attribute | Sub-keys | SVG output |
|-----------|----------|------------|
| `viewBox` | `minX`, `minY`, `width`, `height` | `"0 0 800 600"` |
| `strokeDasharray` | `dash`, `gap` | `"10 5"` |

## How it works

- Extends MC's `Effect` base class
- `getScratchValue()` reads the current attribute value from the element via `getAttribute()`, parsed as a number
- `onProgress(ms)` computes the interpolated value at `ms / duration` and sets it via `setAttribute()`
- CamelCase attribute names are auto-mapped to kebab-case for SVG (e.g. `strokeWidth` → `stroke-width`)
- Composite attributes split into sub-effects per MC convention; each sub-value is interpolated independently and combined into the attribute string on every frame
- All MC features work: easing, chaining, initialValues, seek, reverse

## Development

```bash
npm install
npm start     # builds lib + starts demo on localhost:8091
npm run build # production build
```

## License

MIT
