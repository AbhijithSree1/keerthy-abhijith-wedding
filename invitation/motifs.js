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

/* ---- the seal: a monogram roundel for the envelope flap -----------------
   Wax-seal logic: an opaque disc that sits *on* the fold, so the flap edge
   passes behind it rather than through the lettering.

   SVG's y axis points down, so an angle of 270deg is the top of the circle
   and 90deg is the bottom. Text around the top reads correctly when each
   glyph is turned by (angle + 90); around the bottom, by (angle - 90), and
   the angle has to run *backwards* or the word comes out mirrored. Getting
   that pair wrong is what made the first seal read "AllAVURIHT".            */
function seal(w = 190, { arcs = true } = {}) {
  const ring = (text, r, midDeg, spreadDeg, size, rotOffset) => {
    const chars = text.split("");
    const step = chars.length > 1 ? spreadDeg / (chars.length - 1) : 0;
    const start = midDeg - spreadDeg / 2;
    return chars
      .map((c, i) => {
        const deg = start + i * step;
        const a = (deg * Math.PI) / 180;
        const x = (Math.cos(a) * r).toFixed(2);
        const y = (Math.sin(a) * r).toFixed(2);
        const rot = (deg + rotOffset).toFixed(2);
        return `<text x="${x}" y="${y}" transform="rotate(${rot} ${x} ${y})"
          font-family="Cinzel, serif" font-size="${size}" letter-spacing="0.6"
          fill="currentColor" fill-opacity="0.82" text-anchor="middle"
          dominant-baseline="middle">${c}</text>`;
      })
      .join("");
  };

  // top arc reads left→right through 270deg; bottom arc runs backwards
  // through 90deg so it also reads left→right
  const topText = arcs ? ring("THIRUVALLA", 74, 270, 118, 11, 90) : "";
  const bottomText = arcs ? ring("KERALA", 74, 90, -64, 11, -90) : "";
  const pips = arcs
    ? `<circle cx="-74" cy="0" r="1.9" fill="currentColor" stroke="none" opacity="0.7"/>
       <circle cx="74" cy="0" r="1.9" fill="currentColor" stroke="none" opacity="0.7"/>`
    : "";

  return `<svg viewBox="-100 -100 200 200" width="${w}" fill="none" stroke="currentColor"
      stroke-linecap="round" stroke-linejoin="round">
      <circle r="90" fill="var(--seal-fill)" stroke="currentColor" stroke-width="1.6" stroke-opacity="0.7"/>
      <circle r="84" stroke-width="0.8" stroke-opacity="0.3"/>
      <circle r="62" stroke-width="1.1" stroke-opacity="0.5"/>
      <g stroke="none">${topText}${bottomText}</g>
      ${pips}
      <!-- Cinzel capitals, not the script: at seal size Great Vibes' K and A
           throw swashes into each other and the pair reads as one blob. The
           ampersand stays script, which keeps the tie to the names. -->
      <g stroke="none" fill="currentColor" font-family="Cinzel, serif"
         text-anchor="middle">
        <text x="0" y="10" font-size="38" letter-spacing="2">K<tspan
          font-family="Great Vibes, cursive" font-size="24" fill-opacity="0.75"
          dx="4" dy="-2">&amp;</tspan><tspan dx="4" dy="2">A</tspan></text>
      </g>
      <text x="0" y="43" text-anchor="middle" font-family="Cinzel, serif" font-size="10"
        letter-spacing="3.6" fill="currentColor" fill-opacity="0.7" stroke="none">2026</text>
    </svg>`;
}

/* ---- Ganapati, drawn as line-art for the envelope seal ------------------
   Front-facing and symmetric apart from the trunk, which sweeps left and
   hooks at the tip. Everything is stroked, nothing filled, so it foils or
   prints in the single gold the rest of the suite uses. The group is shifted
   down 24 units because the trunk hangs well below the head — without it the
   figure sits high in the seal instead of centred.                          */
function ganapati() {
  return `
  <g transform="translate(0,24)" stroke="currentColor" fill="none" stroke-width="2.4"
     stroke-linecap="round" stroke-linejoin="round">
    <!-- finial and crown -->
    <path d="M0,-92 C-5.5,-84 -5.5,-78 0,-73 C5.5,-78 5.5,-84 0,-92 Z"/>
    <path d="M-25,-52 C-25,-70 -12,-79 0,-79 C12,-79 25,-70 25,-52"/>
    <path d="M-29,-51 C-15,-55 15,-55 29,-51"/>
    <path d="M-29,-44 C-15,-48 15,-48 29,-44" stroke-width="1.3" opacity="0.7"/>
    <circle cx="0" cy="-63" r="3.2" stroke-width="1.4"/>

    <!-- head -->
    <path d="M-29,-46 C-33,-32 -32,-14 -24,-2 C-14,10 14,10 24,-2 C32,-14 33,-32 29,-46"/>

    <!-- ears: leaf-shaped rather than full circles, so the figure stays
         roughly as wide as it is tall and fits the seal -->
    <path d="M-28,-45 C-46,-52 -62,-40 -61,-20 C-60,-3 -46,7 -27,0"/>
    <path d="M-29,-37 C-42,-41 -52,-32 -51,-19 C-50,-8 -41,-1 -29,-5" stroke-width="1.2" opacity="0.7"/>
    <path d="M28,-45 C46,-52 62,-40 61,-20 C60,-3 46,7 27,0"/>
    <path d="M29,-37 C42,-41 52,-32 51,-19 C50,-8 41,-1 29,-5" stroke-width="1.2" opacity="0.7"/>

    <path d="M-7,-41 C-7,-32 7,-32 7,-41" stroke-width="1.5"/>

    <path d="M-20,-22 C-16,-27 -9,-27 -6,-21" stroke-width="1.7"/>
    <path d="M20,-22 C16,-27 9,-27 6,-21" stroke-width="1.7"/>

    <!-- tusks sit outboard of the trunk; inside it they read as whiskers -->
    <path d="M-19,-4 C-24,2 -26,8 -25,13" stroke-width="1.9"/>
    <path d="M19,-4 C24,1 25,5 25,8" stroke-width="1.9"/>

    <!-- trunk -->
    <path d="M-8,-12 C-11,8 -20,25 -33,31 C-43,36 -50,30 -48,22 C-47,17 -41,16 -39,20"/>
    <path d="M8,-12 C8,10 0,28 -16,36 C-32,44 -54,37 -54,21 C-54,11 -46,5 -38,10"/>
    <path d="M-39,20 C-35,17 -35,13 -38,10" stroke-width="1.8"/>
  </g>`;
}

/* ---- Ganapati, calligraphic ---------------------------------------------
   The style Keerthy and Abhijith picked: not an outline drawing but flowing
   calligraphic strokes — a domed crown under a finial, two lobed ears, and
   one long trunk sweeping down and curling into a spiral at bottom left,
   over a low scrolled body. Drawn as heavy round-capped strokes, which is
   what gives the ribbon quality; nothing here is an outline of a shape.     */
function ganapatiCalligraphic() {
  return `
  <g transform="translate(0,16)" fill="none" stroke="currentColor"
     stroke-linecap="round" stroke-linejoin="round">
    <path d="M0,-92 C-6,-84 -6,-78 0,-73 C6,-78 6,-84 0,-92 Z"
          fill="currentColor" stroke="none"/>
    <circle cx="0" cy="-68" r="4.5" fill="currentColor" stroke="none"/>

    <path d="M-27,-42 C-27,-58 -13,-64 0,-64 C13,-64 27,-58 27,-42" stroke-width="10"/>

    <!-- ears mirrored exactly; the reference pair is symmetric -->
    <path d="M-27,-40 C-48,-45 -64,-28 -60,-8 C-57,7 -42,13 -29,5" stroke-width="10"/>
    <path d="M27,-40 C48,-45 64,-28 60,-8 C57,7 42,13 29,5" stroke-width="10"/>

    <circle cx="-13" cy="-26" r="3.4" fill="currentColor" stroke="none"/>
    <circle cx="13" cy="-26" r="3.4" fill="currentColor" stroke="none"/>

    <path d="M0,-16 C3,4 -2,20 -16,31 C-32,44 -52,40 -55,25
             C-57,13 -46,6 -38,13 C-32,18 -34,27 -41,26" stroke-width="11"/>

    <path d="M-44,50 C-18,40 22,40 46,50" stroke-width="10"/>
    <path d="M-44,50 C-54,52 -56,62 -47,64 C-40,65 -38,58 -43,56" stroke-width="7"/>
    <path d="M46,50 C56,52 58,62 49,64 C42,65 40,58 45,56" stroke-width="7"/>
  </g>`;
}

/* ---- the seal that closes the envelope: Ganapati and nothing else ------- */
function ganapatiSeal(w = 190) {
  return `<svg viewBox="-100 -100 200 200" width="${w}" fill="none" stroke="currentColor"
      stroke-linecap="round" stroke-linejoin="round">
      <circle r="90" fill="var(--seal-fill)" stroke="currentColor" stroke-width="1.6" stroke-opacity="0.7"/>
      <circle r="84" stroke-width="0.8" stroke-opacity="0.32"/>
      <g transform="scale(0.9)">${ganapatiCalligraphic()}</g>
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

const MOTIFS = {
  chai, diamond, seal, ganapati, ganapatiCalligraphic, ganapatiSeal,
  distance, backwater, palm, vallam,
};

document.querySelectorAll("[data-motif]").forEach((el) => {
  const name = el.dataset.motif;
  const w = el.dataset.w ? Number(el.dataset.w) : undefined;
  const opts = el.dataset.opts ? JSON.parse(el.dataset.opts) : undefined;
  if (MOTIFS[name]) el.innerHTML = MOTIFS[name](w, opts);
});
document.documentElement.dataset.motifsReady = "1";
