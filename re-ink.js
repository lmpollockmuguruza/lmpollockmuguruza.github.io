/* ─────────────────────────────────────────────────────────────────────────
   Re-ink — hover over the name or a section title and three thin outlines
   of the words appear, scribbled wide at first, then settle onto the
   letterforms like wet ink while the printed text fades back. The three
   outlines are the same three strands as the cursor trace (cursor-trace.js),
   and they are drawn in the live accent colour, so they follow the palette.

   Mark up any text you want re-inked:

       <h2><span class="reink">About</span></h2>

   The hover target is the nearest link around the span (so the whole
   "Lucas Pollock Muguruza" link in the top bar counts), otherwise the span.
   Keyboard focus on that link triggers it as well.

   Off on touch screens and for reduced motion. Never catches clicks.

       <script src="re-ink.js" defer></script>
   ───────────────────────────────────────────────────────────────────────── */
(function () {
    var NS = 'http://www.w3.org/2000/svg';
    var OFF = [[0, 0], [1.6, -1.1], [-1.4, 1.5]];   /* strand offsets at 40px */
    var OP = [1, 0.6, 0.4];                          /* strand opacities */
    var DUR = 650, GAP = 90, BOIL = 100;
    var uid = 0;

    var able = matchMedia('(hover: hover) and (pointer: fine)');
    var calm = matchMedia('(prefers-reduced-motion: reduce)');

    var css = document.createElement('style');
    css.textContent =
        '.reink{position:relative;display:inline-block}' +
        '.reink-t{transition:opacity .5s cubic-bezier(.4,0,.2,1)}' +
        '.reink.on .reink-t{opacity:.12}' +
        '.reink-svg{position:absolute;left:0;top:0;overflow:visible;pointer-events:none}' +
        '.reink-svg text{fill:none;stroke:var(--burgundy,#6b2737);font-kerning:normal}';
    document.head.appendChild(css);

    var ease = function (x) { return 1 - Math.pow(1 - x, 3); };
    function el(tag, attrs) {
        var n = document.createElementNS(NS, tag);
        for (var k in attrs) n.setAttribute(k, attrs[k]);
        return n;
    }

    function setup(span) {
        if (span.__reink) return;
        /* the printed text moves into .reink-t; the outlines sit on top of it */
        var t = document.createElement('span');
        t.className = 'reink-t';
        while (span.firstChild) t.appendChild(span.firstChild);
        span.appendChild(t);

        var id = 'ri' + (uid++);
        var svg = el('svg', { 'class': 'reink-svg', 'aria-hidden': 'true', focusable: 'false' });
        var defs = el('defs', {}), groups = [], disp = [], turb = [];
        OFF.forEach(function (_, i) {
            var f = el('filter', { id: id + 'f' + i, x: '-20%', y: '-60%', width: '140%', height: '220%' });
            var tb = el('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.04', numOctaves: '2', seed: String(i + 1) });
            var dm = el('feDisplacementMap', { 'in': 'SourceGraphic', scale: '0' });
            f.appendChild(tb); f.appendChild(dm); defs.appendChild(f);
            turb.push(tb); disp.push(dm);
            var outer = el('g', { filter: 'url(#' + id + 'f' + i + ')' });
            var g = el('g', { opacity: '0' });
            outer.appendChild(g); groups.push(g);
        });
        svg.appendChild(defs);
        groups.forEach(function (g) { svg.appendChild(g.parentNode); });
        span.appendChild(svg);

        var host = span.closest('a') || span;
        var S = { span: span, t: t, svg: svg, groups: groups, disp: disp, turb: turb,
                  on: false, t0: 0, raf: 0, boil: 0, p: [0, 0, 0], k: 1 };
        span.__reink = S;

        host.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse' || e.pointerType === 'pen') enter(S); });
        host.addEventListener('pointerleave', function () { leave(S); });
        host.addEventListener('focusin', function () { if (host.matches(':focus-visible')) enter(S); });
        host.addEventListener('focusout', function () { leave(S); });
    }

    /* measure where each word sits and write the outlines to match — done on
       every hover, so hidden sections, late fonts and resizes all come out right */
    function layout(S) {
        var span = S.span, t = S.t, cs = getComputedStyle(t);
        var box = span.getBoundingClientRect();
        if (!box.width) return false;

        var marker = document.createElement('span');
        marker.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
        var words = [], walker = document.createTreeWalker(t, NodeFilter.SHOW_TEXT), node;
        while ((node = walker.nextNode())) {
            var re = /\S+/g, m;
            while ((m = re.exec(node.data))) {
                var r = document.createRange();
                r.setStart(node, m.index); r.setEnd(node, m.index + m[0].length);
                var rr = r.getBoundingClientRect();
                if (rr.width) words.push({ s: m[0], x: rr.left - box.left, top: rr.top - box.top });
            }
        }
        if (!words.length) return false;
        /* baseline: a zero-height inline-block sits on it */
        t.insertBefore(marker, t.firstChild);
        var A = marker.getBoundingClientRect().top - box.top - words[0].top;
        marker.remove();

        var size = parseFloat(cs.fontSize) || 16, k = size / 40;
        S.k = k;
        var style = 'font-family:' + cs.fontFamily + ';font-size:' + cs.fontSize + ';font-weight:' + cs.fontWeight +
                    ';font-style:' + cs.fontStyle + ';letter-spacing:' + cs.letterSpacing;
        var sw = Math.max(0.6, 1.1 * Math.max(k, 0.55)).toFixed(2);
        S.svg.setAttribute('width', Math.ceil(box.width));
        S.svg.setAttribute('height', Math.ceil(box.height));
        S.groups.forEach(function (g, i) {
            while (g.firstChild) g.firstChild.remove();
            words.forEach(function (w) {
                var tx = el('text', { x: w.x.toFixed(2), y: (w.top + A).toFixed(2), style: style, 'stroke-width': sw, opacity: String(OP[i]) });
                tx.textContent = w.s;
                g.appendChild(tx);
            });
        });
        return true;
    }

    function frame(S, now) {
        var t = now - S.t0, k = Math.max(S.k, 0.4);
        S.p = S.p.map(function (v, i) {
            return S.on ? Math.max(v, ease(Math.min(1, Math.max(0, (t - i * GAP) / DUR)))) : Math.max(0, v - 0.05);
        });
        S.p.forEach(function (v, i) {
            var op = v === 0 ? 0 : Math.min(1, v * 1.6);
            var sc = (2.5 + i + (1 - v) * 30) * k;
            var g = S.groups[i];
            g.setAttribute('opacity', op.toFixed(3));
            g.setAttribute('transform', 'translate(' + (OFF[i][0] * k).toFixed(2) + ',' + (OFF[i][1] * k).toFixed(2) + ')');
            S.disp[i].setAttribute('scale', sc.toFixed(2));
        });
        if (S.on && now - S.boil > BOIL) {
            S.boil = now;
            S.turb.forEach(function (f) { f.setAttribute('seed', String(Math.floor(Math.random() * 999))); });
        }
        S.raf = (S.on || S.p.some(function (v) { return v > 0; })) ? requestAnimationFrame(function (n) { frame(S, n); }) : 0;
    }

    function enter(S) {
        if (!able.matches || calm.matches || S.on) return;
        if (!S.raf && !layout(S)) return;
        S.on = true; S.t0 = performance.now();
        S.span.classList.add('on');
        if (!S.raf) S.raf = requestAnimationFrame(function (n) { frame(S, n); });
    }
    function leave(S) {
        if (!S.on) return;
        S.on = false;
        S.span.classList.remove('on');
        if (!S.raf) S.raf = requestAnimationFrame(function (n) { frame(S, n); });
    }

    function init() { document.querySelectorAll('.reink').forEach(setup); }
    window.ReInk = { scan: init };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
}());
