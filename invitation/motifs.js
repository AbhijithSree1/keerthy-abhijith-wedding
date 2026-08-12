/* ============================================================
   Motif library — hand-built SVG, no external libraries.
   Everything is stroked in currentColor so it inherits the gold.

   Usage:  <span class="motif" data-motif="chai" data-w="120"></span>
   ============================================================ */

/* ---- a single coconut palm, drawn from its base ------------------------- */
function palm({ h = 90, lean = 10, fronds = 7, seed = 0 } = {}) {
  const rnd = (i) => {
    const x = Math.sin((seed + 1) * 12.9898 + i * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const topX = lean;
  const topY = -h;
  // trunk: two nearly-parallel strokes so it reads as a trunk, not a wire
  const trunk = `M0,0 C${lean * 0.1},${-h * 0.4} ${lean * 0.55},${-h * 0.72} ${topX},${topY}`;

  let d = "";
  for (let i = 0; i < fronds; i++) {
    const t = fronds === 1 ? 0.5 : i / (fronds - 1);
    // spread fronds across a downward-drooping fan
    const ang = -170 + t * 160 + (rnd(i) - 0.5) * 14;
    const len = h * (0.44 + rnd(i + 9) * 0.2);
    const a = (ang * Math.PI) / 180;
    // control point lifts the frond before it droops
    const cx = topX + Math.cos(a) * len * 0.5;
    const cy = topY + Math.sin(a) * len * 0.5 - len * 0.3;
    const ex = topX + Math.cos(a) * len;
    const ey = topY + Math.sin(a) * len * 0.55 + len * 0.24;
    d += `M${topX},${topY} Q${cx.toFixed(1)},${cy.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)} `;
  }
  // coconuts
  const nuts = `M${topX - 4},${topY + 5} a2.6,2.6 0 1,0 0.1,0 M${topX + 4},${topY + 7} a2.6,2.6 0 1,0 0.1,0`;
  return `<path d="${trunk}"/><path d="${d}"/><path d="${nuts}"/>`;
}

/* ---- vallam: the Kerala country boat, poled from the stern -------------- */
function vallam({ len = 150 } = {}) {
  const L = len;
  const hull = `M${-L / 2},0 C${-L / 2 + 8},9 ${L / 2 - 8},9 ${L / 2},0`;
  // the upturned prows that make it unmistakably a vallam
  const prowL = `M${-L / 2},0 c-9,-1 -14,-4 -17,-9`;
  const prowR = `M${L / 2},0 c9,-1 14,-4 17,-9`;
  const gunwale = `M${-L / 2 + 4},0 L${L / 2 - 4},0`;
  // the boatman, poling
  const figure =
    `M${L * 0.24},0 l0,-15 M${L * 0.24},-15 a3.2,3.2 0 1,0 0.1,0 ` +
    `M${L * 0.24},-11 l-7,6 M${L * 0.24},-11 l6,5 M${L * 0.2},-24 l14,30`;
  return `<path d="${hull}"/><path d="${prowL}"/><path d="${prowR}"/><path d="${gunwale}"/><path d="${figure}"/>`;
}

/* ---- the backwater panorama — card back / envelope back footer ----------
   `boat` is opt-out: on the card back the QR sits mid-footer and would bury
   the vallam, so that page asks for palms and water only.                   */
function backwater(w = 1000, { boat = true } = {}) {
  const g = (x, y, s, body) =>
    `<g transform="translate(${x},${y}) scale(${s})">${body}</g>`;

  const palms =
    g(56, 104, 1.0, palm({ h: 92, lean: -13, seed: 1 })) +
    g(104, 104, 0.74, palm({ h: 86, lean: 9, seed: 2 })) +
    g(150, 104, 0.5, palm({ h: 80, lean: -6, seed: 5 })) +
    g(w - 60, 104, 0.96, palm({ h: 90, lean: 12, seed: 3 })) +
    g(w - 112, 104, 0.68, palm({ h: 84, lean: -8, seed: 4 })) +
    g(w - 156, 104, 0.46, palm({ h: 78, lean: 7, seed: 6 }));

  // far bank + water
  const bank = `<path d="M0,104 H${w}" opacity="0.5"/>`;
  const ripples = [
    `M${w * 0.1},124 q22,-5 44,0 t44,0`,
    `M${w * 0.62},131 q20,-5 40,0 t40,0`,
    `M${w * 0.24},140 q26,-5 52,0 t52,0`,
    `M${w * 0.7},146 q18,-4 36,0`,
  ]
    .map((d) => `<path d="${d}" opacity="0.55"/>`)
    .join("");

  const boatArt = boat ? g(w / 2, 118, 1, vallam({ len: 150 })) : "";

  // a couple of birds, high and small
  const birds =
    `<path d="M${w * 0.36},46 q6,-6 12,0 q6,-6 12,0" opacity="0.6"/>` +
    `<path d="M${w * 0.29},62 q4.5,-4.5 9,0 q4.5,-4.5 9,0" opacity="0.45"/>`;

  return `<svg viewBox="0 0 ${w} 165" width="100%" fill="none" stroke="currentColor"
      stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      ${birds}${palms}${bank}${boatArt}${ripples}
    </svg>`;
}

/* ---- two glasses of evening chai — the couple's own motif --------------- */
function chai(w = 132) {
  // Kerala chaya glass: narrow foot, flaring to a wide rim
  const glass = (x, s) => `
    <g transform="translate(${x},0) scale(${s})">
      <path d="M-15,0 L-10.5,33 a4,4 0 0 0 4,3.6 h13 a4,4 0 0 0 4,-3.6 L15,0"/>
      <ellipse cx="0" cy="0" rx="15" ry="4.2"/>
      <path d="M-12.2,9 q12,3.4 24.4,0" opacity="0.6"/>
      <path d="M-9,40.5 h18" opacity="0.75"/>
    </g>`;
  // steam — two curls that lean into each other
  const steam = `
    <path d="M-16,-12 q5.5,-8 0,-15 q-5,-6.5 0.5,-12" opacity="0.8"/>
    <path d="M16,-12 q-5.5,-8 0,-15 q5,-6.5 -0.5,-12" opacity="0.8"/>
    <path d="M0,-18 q4.5,-7 0,-13" opacity="0.5"/>`;
  return `<svg viewBox="-66 -44 132 96" width="${w}" fill="none" stroke="currentColor"
      stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
      <g transform="translate(0,4)">${steam}</g>
      ${glass(-17, 1)}${glass(17, 1)}
    </svg>`;
}

/* ---- small lozenge divider ---------------------------------------------- */
function diamond(w = 22) {
  return `<svg viewBox="-14 -14 28 28" width="${w}" fill="none" stroke="currentColor"
      stroke-width="1.4" stroke-linejoin="round">
      <path d="M0,-9 L6,0 L0,9 L-6,0 Z"/>
      <path d="M0,-13 L0,-11 M0,11 L0,13 M-10,0 L-8,0 M8,0 L10,0" opacity="0.7"/>
    </svg>`;
}

/* ---- the seal: a monogram roundel for the envelope flap ----------------- */
function seal(w = 190, { arcs = true } = {}) {
  const arc = (text, r, startDeg, sweep, size, opacity) => {
    const chars = text.split("");
    const step = sweep / Math.max(chars.length - 1, 1);
    return chars
      .map((c, i) => {
        const a = ((startDeg + i * step) * Math.PI) / 180;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        const rot = startDeg + i * step + 90;
        return `<text x="${x.toFixed(2)}" y="${y.toFixed(2)}"
          transform="rotate(${rot.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)})"
          font-family="Cinzel, serif" font-size="${size}" letter-spacing="0.5"
          fill="currentColor" fill-opacity="${opacity}" text-anchor="middle">${c}</text>`;
      })
      .join("");
  };

  return `<svg viewBox="-100 -100 200 200" width="${w}" fill="none" stroke="currentColor"
      stroke-linecap="round" stroke-linejoin="round">
      <circle r="92" stroke-width="1.5" opacity="0.55"/>
      <circle r="86" stroke-width="0.9" opacity="0.35"/>
      <circle r="64" stroke-width="1.2" opacity="0.75"/>
      <g stroke="none">
        ${arcs ? arc("THIRUVALLA", 77, 152, 76, 11, 0.8) : ""}
        ${arcs ? arc("KERALA", -75, -22, 44, 11, 0.8) : ""}
      </g>
      ${arcs ? '<path d="M-64,0 l-9,0 M64,0 l9,0" stroke-width="1.2" opacity="0.6"/>' : ""}
      <text x="0" y="16" text-anchor="middle" font-family="Great Vibes, cursive"
        font-size="62" fill="currentColor" stroke="none">K<tspan font-size="44" dy="-4">&amp;</tspan><tspan font-size="62" dy="4">A</tspan></text>
      <text x="0" y="42" text-anchor="middle" font-family="Cinzel, serif" font-size="11"
        letter-spacing="4" fill="currentColor" fill-opacity="0.75" stroke="none">2026</text>
    </svg>`;
}

/* ---- the long-distance line: Kerala to the UK and back ------------------ */
function distance(w = 420) {
  return `<svg viewBox="0 0 420 74" width="${w}" fill="none" stroke="currentColor"
      stroke-width="1.4" stroke-linecap="round">
      <circle cx="18" cy="56" r="4"/>
      <circle cx="402" cy="56" r="4"/>
      <path d="M18,56 C120,-4 300,-4 402,56" stroke-dasharray="1 7" opacity="0.85"/>
      <path d="M204,22 l10,4 -10,4 2,-4 z" fill="currentColor" stroke="none" opacity="0.9"/>
      <g stroke="none" fill="currentColor" font-family="Cinzel, serif" font-size="11"
         letter-spacing="2.4" fill-opacity="0.85">
        <text x="18" y="72" text-anchor="start">KERALA</text>
        <text x="402" y="72" text-anchor="end">UNITED KINGDOM</text>
      </g>
    </svg>`;
}

/* ------------------------------------------------------------------------ */

const MOTIFS = { chai, diamond, seal, distance, backwater, palm, vallam };

document.querySelectorAll("[data-motif]").forEach((el) => {
  const name = el.dataset.motif;
  const w = el.dataset.w ? Number(el.dataset.w) : undefined;
  const opts = el.dataset.opts ? JSON.parse(el.dataset.opts) : undefined;
  if (MOTIFS[name]) el.innerHTML = MOTIFS[name](w, opts);
});
document.documentElement.dataset.motifsReady = "1";
