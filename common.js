// Shared game logic. Cards are built from the game code + card number, so no server is needed.
// A game is 1-6 rounds. Each round has a category and a win pattern; both are in the game code,
// e.g. "TLNVAHDF-K7Q" = TV Tunes/line, Name Game/V, Artists/H, Drinking/full, then 3 random characters.
// Each round's card is 3 rows x 5 columns (B-I-N-G-O), no free square.

function seededRandom(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, seed) {
  const r = seed ? seededRandom(seed) : Math.random;
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- Patterns ----------
// Squares are numbered 0-4 (top row), 5-9 (middle), 10-14 (bottom).
const ROWS = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14]];
const PATTERNS = {
  line: { letter: 'L', name: 'One line across', rows: 1, show: [5, 6, 7, 8, 9] },
  two: { letter: 'W', name: 'Two lines across', rows: 2, show: [0, 1, 2, 3, 4, 10, 11, 12, 13, 14] },
  v: { letter: 'V', name: 'V shape', cells: [0, 4, 6, 8, 12] },
  h: { letter: 'H', name: 'H shape', cells: [0, 5, 10, 4, 9, 14, 6, 7, 8] },
  corners: { letter: 'C', name: 'Four corners', cells: [0, 4, 10, 14] },
  x: { letter: 'X', name: 'X shape', cells: [0, 4, 6, 7, 8, 10, 14] },
  cross: { letter: 'P', name: 'Cross (plus sign)', cells: [2, 5, 6, 7, 8, 9, 12] },
  full: { letter: 'F', name: 'Full card', cells: [...Array(15).keys()] }
};
const patternByLetter = l => Object.keys(PATTERNS).find(k => PATTERNS[k].letter === l);

// How many more squares are needed to win. 0 = bingo.
function squaresNeeded(marked, pattern) {
  const p = PATTERNS[pattern];
  if (p.rows) {
    const gaps = ROWS.map(r => r.filter(i => !marked(i)).length).sort((a, b) => a - b);
    return gaps.slice(0, p.rows).reduce((a, b) => a + b, 0);
  }
  return p.cells.filter(i => !marked(i)).length;
}
const isWinner = (marked, pattern) => squaresNeeded(marked, pattern) === 0;

function patternHTML(pattern) {
  const p = PATTERNS[pattern], on = new Set(p.cells || p.show);
  return '<div class="pat">' + [...Array(15).keys()].map(i => `<i class="${on.has(i) ? 'on' : ''}"></i>`).join('') + '</div>';
}

// ---------- Game codes ----------
function newCode(rounds) {
  const L = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 3; i++) s += L[Math.floor(Math.random() * L.length)];
  return rounds.map(r => r.cat.id + PATTERNS[r.pattern].letter).join('') + '-' + s;
}

// Accepts "tlnv-k7q", "TLNVK7Q", etc. Returns {code, cats, pats} or null.
function parseCode(raw) {
  const c = (raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const head = c.slice(0, -3), tail = c.slice(-3);
  if (!head || head.length % 2 || head.length > 12) return null;
  const cats = [], pats = [];
  for (let i = 0; i < head.length; i += 2) {
    const cat = CATEGORIES.find(k => k.id === head[i]), pat = patternByLetter(head[i + 1]);
    if (!cat || !pat) return null;
    cats.push(cat); pats.push(pat);
  }
  return { code: head + '-' + tail, cats, pats };
}

function baseURL() { return location.href.replace(/[^/]*([?#].*)?$/, ''); }
function joinURL(code, n) { return baseURL() + 'play.html?g=' + code + (n ? '&n=' + n : ''); }

// ---------- Cards ----------
function makeCard(code, cat, n, round) {
  return shuffle([...cat.songs.keys()], code + '#' + n + '#' + round).slice(0, 15);
}

function squareText(cat, i) {
  const s = cat.songs[i];
  if (cat.small) return [s[0], cat.small];
  if (cat.swap) return [s[1], s[0]];
  return [s[0], s[1]];
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function cardHTML(cat, card, markedFn) {
  return '<div class="grid">' + [...'BINGO'].map(l => `<div class="hd">${l}</div>`).join('') +
    card.map((s, i) => {
      const [big, small] = squareText(cat, s);
      return `<div class="sq${markedFn && markedFn(i) ? ' on' : ''}" data-i="${i}"><span>${esc(big)}<small>${esc(small)}</small></span></div>`;
    }).join('') + '</div>';
}

// ---------- Look: category colors and icons ----------
const LOOK = {
  T: { color: '#3fd6ff', icon: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M8 2l4 4 4-4"/>' },
  N: { color: '#ffcf4a', icon: '<path d="M3 7h12l6 5-6 5H3z"/><circle cx="7" cy="12" r="1.3"/>' },
  A: { color: '#ffb02e', icon: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3a9 9 0 0 1 9 9"/>' },
  D: { color: '#ff4fa3', icon: '<path d="M4 4h16l-8 9z"/><path d="M12 13v7M8 20h8"/>' },
  E: { color: '#b06bff', icon: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="8.5" cy="12" r="2"/><circle cx="15.5" cy="12" r="2"/>' },
  M: { color: '#ff8a3d', icon: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4"/>' },
  X: { color: '#4bd67b', icon: '<path d="M12 2l5 7h-3l4 6h-4l3 5H7l3-5H6l4-6H7z"/>' },
  F: { color: '#ff5f5f', icon: '<path d="M6 20L12 4l6 16M8.5 14h7"/>' },
  B: { color: '#5f8bff', icon: '<path d="M7 4h6a4 4 0 0 1 0 8H7zM7 12h7a4 4 0 0 1 0 8H7z"/>' },
  C: { color: '#2ee6c8', icon: '<path d="M18 7a7 7 0 1 0 0 10"/>' },
  G: { color: '#e6e62e', icon: '<path d="M6 4h5a8 8 0 0 1 0 16H6z"/>' }
};
function catIcon(cat) {
  const l = LOOK[cat.id] || { color: '#ff4fa3', icon: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>' };
  return `<svg class="ico" viewBox="0 0 24 24" style="color:${l.color}">${l.icon}</svg>`;
}
const catColor = cat => (LOOK[cat.id] || {}).color || '#ff4fa3';

// ---------- QR code (uses qrcode.js, MIT license, Kazuhiko Arase) ----------
function qrSVG(text) {
  const q = qrcode(0, 'M'); q.addData(text); q.make();
  return q.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
}

// ---------- Keep the screen awake ----------
function keepAwake() {
  if (!('wakeLock' in navigator)) return;
  const ask = () => navigator.wakeLock.request('screen').catch(() => {});
  ask();
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') ask(); });
}

// ---------- Confetti ----------
function confetti() {
  const c = document.createElement('canvas');
  c.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99';
  c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c);
  const g = c.getContext('2d'), cols = ['#ff4fa3', '#ffcf4a', '#3fd6ff', '#b06bff', '#4bd67b'];
  const ps = Array.from({ length: 180 }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height / 2,
    vx: (Math.random() - .5) * 4, vy: 2 + Math.random() * 4, r: Math.random() * 6, s: 6 + Math.random() * 6, c: cols[Math.floor(Math.random() * 5)] }));
  const t0 = performance.now();
  (function f(t) {
    g.clearRect(0, 0, c.width, c.height);
    ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.r += .1; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); });
    t - t0 < 3500 ? requestAnimationFrame(f) : c.remove();
  })(t0);
}

// ---------- Sound effects, made in the browser (no audio files) ----------
let _ac;
function audio() { return _ac || (_ac = new (window.AudioContext || window.webkitAudioContext)()); }

function sfxScratch() {
  const ac = audio(), len = ac.sampleRate * 0.45, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(), t = ac.currentTime;
  src.buffer = buf; f.type = 'bandpass'; f.Q.value = 6;
  f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(2500, t + 0.15);
  f.frequency.exponentialRampToValueAtTime(250, t + 0.42);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.7, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.44);
  src.connect(f).connect(g).connect(ac.destination); src.start();
}

function sfxAirhorn() {
  const ac = audio(), t = ac.currentTime;
  [[0, 0.22], [0.28, 0.12], [0.45, 0.7]].forEach(([at, dur]) => {
    const g = ac.createGain(); g.connect(ac.destination);
    g.gain.setValueAtTime(0.0001, t + at); g.gain.exponentialRampToValueAtTime(0.25, t + at + 0.02);
    g.gain.setValueAtTime(0.25, t + at + dur - 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + at + dur);
    [415, 420, 622].forEach(fq => { const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = fq; o.connect(g); o.start(t + at); o.stop(t + at + dur); });
  });
}
