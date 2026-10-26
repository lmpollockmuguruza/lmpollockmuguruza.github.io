/*
 * <lpm-mark> — Lucas Pollock Muguruza logo mark
 *
 * Rest state: L (axes / viewfinder) with a dot.
 * On hover (or tap): morphs L → P → M → open circle, then the ring + dot spin.
 * On leave: the spin eases to a stop, then it folds back into the L.
 *
 * Attributes
 *   sequence="spell" | "direct"   spell = L→P→M→○ (default), direct = L→○
 *   trigger="<css selector>"      hover target: closest ancestor matching it (e.g. "a").
 *                                 Default: the element itself.
 *   weight="5"                    stroke weight in a 100-unit box (use 7–9 at small sizes)
 *   tile                          draws a cream tile that flips to black on the circle
 *   static="circle"               render a non-interactive circle (default static is none)
 *
 * CSS custom properties
 *   --lpm-size   width/height of the mark (default 48px)
 *   --lpm-ink    stroke colour (default currentColor)
 *   --lpm-dot    dot colour (default #6b2737)
 *
 * Respects prefers-reduced-motion (short morph, no spin).
 */
(() => {
  const N = 300;
  const CX = 50, CY = 52;

  const line = (x1, y1, x2, y2) => ({ t: 'l', x1, y1, x2, y2, len: Math.hypot(x2 - x1, y2 - y1) });
  const arc = (cx, cy, r, a0, a1) => ({ t: 'a', cx, cy, r, a0, a1, len: Math.abs(a1 - a0) * Math.PI / 180 * r });

  const SHAPES = {
    L: [line(25, 18, 25, 78), line(25, 78, 85, 78)],
    P: [line(30, 84, 30, 16), line(30, 16, 50, 16), arc(50, 33, 17, -90, 90), line(50, 50, 30, 50)],
    M: [line(18, 82, 18, 20), line(18, 20, 50, 58), line(50, 58, 82, 20), line(82, 20, 82, 82)],
    O: [arc(CX, CY, 32, 0, 300)],
  };
  const rad = (a) => a * Math.PI / 180;
  const DOTS = {
    L: [62, 44, 5],
    P: [64, 74, 4.5],
    M: [50, 80, 4.5],
    O: [CX + 32 * Math.cos(rad(330)), CY + 32 * Math.sin(rad(330)), 4.2], // bead in the gap
  };

  function sample(segs) {
    const total = segs.reduce((s, g) => s + g.len, 0);
    const pts = [];
    for (let i = 0; i < N; i++) {
      let d = total * i / (N - 1);
      let k = 0;
      while (k < segs.length - 1 && d > segs[k].len) { d -= segs[k].len; k++; }
      const g = segs[k], u = g.len ? Math.min(1, d / g.len) : 0;
      if (g.t === 'l') pts.push([g.x1 + (g.x2 - g.x1) * u, g.y1 + (g.y2 - g.y1) * u]);
      else { const a = rad(g.a0 + (g.a1 - g.a0) * u); pts.push([g.cx + g.r * Math.cos(a), g.cy + g.r * Math.sin(a)]); }
    }
    return pts;
  }
  const RAW = Object.fromEntries(Object.entries(SHAPES).map(([k, v]) => [k, sample(v)]));
  const dist = (a, b) => a.reduce((s, p, i) => s + Math.hypot(p[0] - b[i][0], p[1] - b[i][1]), 0);
  function chain(keys) {
    const out = [RAW[keys[0]]];
    for (let i = 1; i < keys.length; i++) {
      const f = RAW[keys[i]], r = f.slice().reverse(), prev = out[i - 1];
      out.push(dist(prev, f) <= dist(prev, r) ? f : r);
    }
    return out;
  }
  const SEQ = { spell: ['L', 'P', 'M', 'O'], direct: ['L', 'O'] };
  const CHAINS = { spell: chain(SEQ.spell), direct: chain(SEQ.direct) };

  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const easeOut = (x) => 1 - Math.pow(1 - x, 3);
  const HOLD = 0.72; // share of each segment spent morphing; rest is a pause on the letter
  const pToT = (p, n) => {
    if (n < 3) return p;
    const x = p * (n - 1), s = Math.min(n - 2, Math.floor(x)), f = x - s;
    return (s + Math.min(1, f / HOLD)) / (n - 1);
  };
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16));
  const mix = (a, b, u) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * u)).join(',')})`; };

  const TPL = `
    <style>
      :host{display:inline-block;width:var(--lpm-size,48px);height:var(--lpm-size,48px);line-height:0;cursor:pointer;-webkit-tap-highlight-color:transparent}
      :host([tile]){border-radius:16%;background:#f2efe9}
      svg{width:100%;height:100%;overflow:visible}
      path{fill:none;stroke:var(--lpm-ink,currentColor);stroke-linecap:round;stroke-linejoin:round}
      circle{fill:var(--lpm-dot,#6b2737)}
    </style>
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <g transform="translate(50 50) scale(.72) translate(-52 -50)">
        <g id="rot"><path id="m"/><circle id="d"/></g>
      </g>
    </svg>`;

  class LpmMark extends HTMLElement {
    static get observedAttributes() { return ['sequence', 'weight', 'static']; }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' }).innerHTML = TPL;
      this.$m = this.shadowRoot.getElementById('m');
      this.$d = this.shadowRoot.getElementById('d');
      this.$rot = this.shadowRoot.getElementById('rot');
      this.p = 0; this.want = false; this.theta = 0; this.v = 0;
      this.phase = 'idle'; this.settle = null; this.raf = null; this.last = null;
      this.reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      this._enter = () => this.open();
      this._leave = () => this.close();
      this._tap = (e) => { if (e.pointerType !== 'mouse') this.want ? this.close() : this.open(); };
    }

    get seq() { return SEQ[this.getAttribute('sequence') === 'direct' ? 'direct' : 'spell']; }
    get chain() { return CHAINS[this.getAttribute('sequence') === 'direct' ? 'direct' : 'spell']; }

    connectedCallback() {
      if (!this.hasAttribute('role')) this.setAttribute('role', 'img');
      if (!this.hasAttribute('aria-label')) this.setAttribute('aria-label', 'Lucas Pollock Muguruza');
      this.$m.style.strokeWidth = this.getAttribute('weight') || 5;
      if (this.getAttribute('static') === 'circle') { this.p = 1; this.render(); return; }
      const sel = this.getAttribute('trigger');
      this.target = (sel && this.closest(sel)) || this;
      this.target.addEventListener('mouseenter', this._enter);
      this.target.addEventListener('mouseleave', this._leave);
      this.target.addEventListener('focusin', this._enter);
      this.target.addEventListener('focusout', this._leave);
      this.addEventListener('pointerup', this._tap);
      this.render();
    }

    disconnectedCallback() {
      if (this.target) {
        this.target.removeEventListener('mouseenter', this._enter);
        this.target.removeEventListener('mouseleave', this._leave);
        this.target.removeEventListener('focusin', this._enter);
        this.target.removeEventListener('focusout', this._leave);
      }
      this.removeEventListener('pointerup', this._tap);
      cancelAnimationFrame(this.raf);
    }

    attributeChangedCallback() { if (this.$m) { this.$m.style.strokeWidth = this.getAttribute('weight') || 5; this.render(); } }

    open() { this.want = true; if (this.phase === 'settling') { this.phase = 'spinning'; this.v = 120; } this.kick(); }
    close() { this.want = false; this.kick(); }
    kick() { if (!this.raf) { this.last = null; this.raf = requestAnimationFrame((t) => this.tick(t)); } }

    tick(now) {
      const dt = this.last == null ? 1 / 60 : Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      const dur = this.reduce ? 0.3 : this.seq.length > 2 ? 2.4 : 0.9;
      const VMAX = 150, ACC = 220; // deg/s, deg/s²

      if (this.want) {
        if (this.p < 1) {
          this.p = Math.min(1, this.p + dt / dur);
          if (this.p === 1) { this.phase = 'spinning'; this.v = 0; }
        } else if (!this.reduce) {
          this.phase = 'spinning';
          this.v = Math.min(VMAX, this.v + ACC * dt);
          this.theta += this.v * dt;
        }
      } else if (this.p === 1 && this.theta % 360 !== 0 && !this.reduce) {
        if (this.phase !== 'settling') {
          const from = this.theta, to = Math.ceil(from / 360) * 360;
          const r = to - from, v = Math.max(this.v, 60);
          this.settle = { from, to, T: Math.min(1.2, Math.max(0.35, (2 * r) / v)), e: 0 };
          this.phase = 'settling';
        }
        const s = this.settle;
        s.e += dt;
        const u = Math.min(1, s.e / s.T);
        this.theta = s.from + (s.to - s.from) * easeOut(u);
        if (u === 1) { this.theta = 0; this.v = 0; this.phase = 'closing'; }
      } else {
        this.theta = 0;
        this.phase = 'closing';
        this.p = Math.max(0, this.p - dt / dur);
      }

      this.render();
      const atRest = !this.want && this.p === 0;
      const parked = this.want && this.p === 1 && this.reduce;
      if (atRest || parked) { this.raf = null; this.phase = 'idle'; return; }
      this.raf = requestAnimationFrame((t) => this.tick(t));
    }

    render() {
      const keys = this.seq, sh = this.chain, n = keys.length;
      const t = pToT(this.p, n), x = t * (n - 1);
      const s = Math.min(n - 2, Math.floor(x)), u = ease(x - s);
      const A = sh[s], B = sh[s + 1];
      let d = '';
      for (let i = 0; i < N; i++) {
        const X = A[i][0] + (B[i][0] - A[i][0]) * u, Y = A[i][1] + (B[i][1] - A[i][1]) * u;
        d += (i ? 'L' : 'M') + X.toFixed(2) + ' ' + Y.toFixed(2);
      }
      this.$m.setAttribute('d', d);
      const da = DOTS[keys[s]], db = DOTS[keys[s + 1]];
      const w = (+this.getAttribute('weight') || 5) / 5;
      this.$d.setAttribute('cx', da[0] + (db[0] - da[0]) * u);
      this.$d.setAttribute('cy', da[1] + (db[1] - da[1]) * u);
      this.$d.setAttribute('r', (da[2] + (db[2] - da[2]) * u) * Math.max(1, w * 0.9));
      this.$rot.setAttribute('transform', `rotate(${this.theta.toFixed(2)} ${CX} ${CY})`);

      if (this.hasAttribute('tile')) {
        const c = s === n - 2 ? u : 0;
        this.style.background = mix('#f2efe9', '#1a1816', c);
        this.$m.style.stroke = mix('#1a1816', '#f2efe9', c);
        this.$d.style.fill = mix('#6b2737', '#c4707f', c);
      }
    }
  }

  if (!customElements.get('lpm-mark')) customElements.define('lpm-mark', LpmMark);
})();
