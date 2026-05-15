import { loadPlugin, HTMLClip } from "@donkeyclip/motorcortex";
import Player from "@donkeyclip/motorcortex-player";
import AttrPlugin from "../src/index.js";

const McAttr = loadPlugin(AttrPlugin);

// ── SVG scene with various elements ──────────────────────────────────────────

const clip = new HTMLClip({
  host: document.getElementById("clip"),
  html: `<svg viewBox="0 0 800 500" style="width:100%;height:100%;background:#0f172a;">
    <!-- Line that moves its endpoints -->
    <line id="line1" x1="100" y1="400" x2="100" y2="400"
          stroke="#2a9d8f" stroke-width="3" stroke-linecap="round"/>

    <!-- Circle that moves and resizes -->
    <circle id="circ1" cx="400" cy="250" r="5"
            fill="none" stroke="#e76f51" stroke-width="2" opacity="0"/>

    <!-- Rectangle that resizes -->
    <rect id="rect1" x="600" y="200" width="10" height="10" rx="0"
          fill="#264653" opacity="0"/>

    <!-- Text that moves -->
    <text id="label1" x="100" y="440" fill="#94a3b8" font-size="14"
          font-family="system-ui,sans-serif" opacity="0">mc-attr</text>

    <!-- Gradient stop animation -->
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop id="stop1" offset="0" stop-color="#2a9d8f"/>
        <stop id="stop2" offset="0.5" stop-color="#e76f51"/>
      </linearGradient>
    </defs>
    <rect id="gradRect" x="50" y="50" width="700" height="8" rx="4"
          fill="url(#grad1)" opacity="0"/>

    <!-- Dashed circle for strokeDashoffset animation -->
    <circle id="dashCirc" cx="400" cy="250" r="100"
            fill="none" stroke="#7209b7" stroke-width="2"
            stroke-dasharray="20 10" stroke-dashoffset="0" opacity="0"/>
  </svg>`,
  containerParams: { width: "800px", height: "500px" },
});

// ── Animations ───────────────────────────────────────────────────────────────

// 1. Line draws from left to right (animate x2, y2)
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { x2: 700 } },
    { selector: "#line1", duration: 2000, easing: "easeInOutCubic" },
  ),
  0,
);
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { y2: 100 } },
    { selector: "#line1", duration: 2000, easing: "easeInOutCubic" },
  ),
  0,
);

// 2. Circle appears and grows
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { opacity: 1 } },
    { selector: "#circ1", duration: 500 },
  ),
  500,
);
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { r: 80 } },
    { selector: "#circ1", duration: 1500, easing: "easeOutBack" },
  ),
  500,
);
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { strokeWidth: 4 } },
    { selector: "#circ1", duration: 1500, easing: "easeOutBack" },
  ),
  500,
);

// 3. Circle moves
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { cx: 200 } },
    { selector: "#circ1", duration: 1500, easing: "easeInOutCubic" },
  ),
  2500,
);
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { cy: 150 } },
    { selector: "#circ1", duration: 1500, easing: "easeInOutCubic" },
  ),
  2500,
);

// 4. Rectangle appears, grows, and rounds corners
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { opacity: 1 } },
    { selector: "#rect1", duration: 300 },
  ),
  1000,
);
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { width: 150 } },
    { selector: "#rect1", duration: 1500, easing: "easeInOutCubic" },
  ),
  1000,
);
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { height: 100 } },
    { selector: "#rect1", duration: 1500, easing: "easeInOutCubic" },
  ),
  1000,
);
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { rx: 20 } },
    { selector: "#rect1", duration: 1500, easing: "easeInOutCubic" },
  ),
  1000,
);

// 5. Text fades in and moves up
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { opacity: 1 } },
    { selector: "#label1", duration: 500 },
  ),
  1500,
);
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { y: 480 } },
    { selector: "#label1", duration: 1000, easing: "easeInOutCubic" },
  ),
  1500,
);
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { fontSize: 28 } },
    { selector: "#label1", duration: 1000, easing: "easeInOutCubic" },
  ),
  1500,
);

// 6. Gradient bar fades in, stops animate
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { opacity: 1 } },
    { selector: "#gradRect", duration: 400 },
  ),
  200,
);
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { offset: 0.3 } },
    { selector: "#stop1", duration: 3000, easing: "easeInOutSine" },
  ),
  500,
);
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { offset: 1 } },
    { selector: "#stop2", duration: 3000, easing: "easeInOutSine" },
  ),
  500,
);

// 7. Dashed circle — strokeDashoffset animation (spinner effect)
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { opacity: 0.6 } },
    { selector: "#dashCirc", duration: 400 },
  ),
  2000,
);
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { strokeDashoffset: -200 } },
    { selector: "#dashCirc", duration: 3000, easing: "linear" },
  ),
  2000,
);

// 8. Line stroke width pulses
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { strokeWidth: 6 } },
    { selector: "#line1", duration: 500, easing: "easeInOutCubic" },
  ),
  3000,
);
clip.addIncident(
  new McAttr.Attr(
    { animatedAttrs: { strokeWidth: 2 } },
    { selector: "#line1", duration: 500, easing: "easeInOutCubic" },
  ),
  3500,
);

// ── Player ───────────────────────────────────────────────────────────────────

new Player({ clip });
