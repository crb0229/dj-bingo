// Shared game logic. Cards are built from the game code + card number, so no server is needed.

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

function newCode(cat) {
  const L = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 3; i++) s += L[Math.floor(Math.random() * L.length)];
  return cat.id + '-' + s;
}

// Accepts "tv-k7q", "TVK7Q", etc. Returns {code, cat} or null.
function parseCode(raw) {
  const c = (raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const cat = CATEGORIES.find(k => c.startsWith(k.id));
  if (!cat || c.length !== 5) return null;
  return { code: cat.id + '-' + c.slice(2), cat };
}

// 25 song indexes; -1 is the FREE center square.
function makeCard(code, cat, n) {
  const idx = shuffle([...cat.songs.keys()], code + '#' + n).slice(0, 24);
  idx.splice(12, 0, -1);
  return idx;
}

const LINES = (() => {
  const L = [];
  for (let r = 0; r < 5; r++) L.push([0, 1, 2, 3, 4].map(c => r * 5 + c));
  for (let c = 0; c < 5; c++) L.push([0, 1, 2, 3, 4].map(r => r * 5 + c));
  L.push([0, 6, 12, 18, 24], [4, 8, 12, 16, 20]);
  return L;
})();

const PATTERNS = { line: 'One line', two: 'Two lines', full: 'Full card' };

// marked(i) -> true if square i is covered
function isWinner(marked, pattern) {
  if (pattern === 'full') return [...Array(25).keys()].every(marked);
  const n = LINES.filter(l => l.every(marked)).length;
  return pattern === 'two' ? n >= 2 : n >= 1;
}

function cardLabel(cat, i) {
  return i === -1 ? 'FREE' : cat.songs[i][0];
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function cardHTML(cat, card, markedFn) {
  return '<div class="grid">' + card.map((s, i) =>
    `<div class="sq${s === -1 ? ' free' : ''}${markedFn && markedFn(i) ? ' on' : ''}" data-i="${i}"><span>${esc(cardLabel(cat, s))}</span></div>`
  ).join('') + '</div>';
}

function baseURL() {
  return location.href.replace(/[^/]*([?#].*)?$/, '');
}
