// Shared game logic. Cards are built from the game code + card number, so no server is needed.
// A game is 1-4 rounds, one category per round. Each round's card is 3 rows x 5 columns (B-I-N-G-O), no free square.

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

// Code = one letter per round + dash + 3 random characters, e.g. "TNAD-K7Q".
function newCode(cats) {
  const L = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 3; i++) s += L[Math.floor(Math.random() * L.length)];
  return cats.map(c => c.id).join('') + '-' + s;
}

// Accepts "tnad-k7q", "TNADK7Q", etc. Returns {code, cats} or null.
function parseCode(raw) {
  const c = (raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (c.length < 4 || c.length > 7) return null;
  const ids = c.slice(0, -3), tail = c.slice(-3);
  const cats = [...ids].map(id => CATEGORIES.find(k => k.id === id));
  if (!cats.length || cats.some(x => !x)) return null;
  return { code: ids + '-' + tail, cats };
}

// 15 song indexes for one round of one card.
function makeCard(code, cat, n, round) {
  return shuffle([...cat.songs.keys()], code + '#' + n + '#' + round).slice(0, 15);
}

const ROWS = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14]];
const PATTERNS = { line: 'One line across', two: 'Two lines across', full: 'Full card' };

// marked(i) -> true if square i is covered
function isWinner(marked, pattern) {
  if (pattern === 'full') return [...Array(15).keys()].every(marked);
  const n = ROWS.filter(r => r.every(marked)).length;
  return pattern === 'two' ? n >= 2 : n >= 1;
}

// What a square shows: big text and small text.
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

function baseURL() {
  return location.href.replace(/[^/]*([?#].*)?$/, '');
}
