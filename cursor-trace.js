/* ─────────────────────────────────────────────────────────────────────────
   Cursor trace — a few thin, slightly irregular lines that follow the
   pointer, CircoLoco style. Fast moves stretch the trail; stop, and it snaps
   back to the cursor. Always drawn in the live accent colour.

   The reader can pick another style (or tune every setting) in the "Your
   mode" panel on the home page; that choice is kept in localStorage under
   'cursorTrace' and followed on every page that loads this file.

   Off on touch screens and for reduced motion. Never catches clicks.

       <script src="cursor-trace.js" defer></script>
   ───────────────────────────────────────────────────────────────────────── */
(function () {
    var DEFAULTS = {
        preset: 'circoloco',
        enabled: true,
        strands: 3,        // how many irregular lines
        life: 220,         // ms a point survives -> how fast the trail retracts
        maxPoints: 80,     // hard cap on number of points in the trail
        minStep: 6,        // px the cursor must move before a new point is added
        smooth: 0,         // 0 = straight segments, 1 = curved
        jitter: 10,        // max px a strand drifts from the path (at the tail)
        mainTight: 0.65,   // how closely strand 1 sticks to the true path (0-1)
        wobble: 0,         // live shimmer in px
        lag: 0,            // points that extra strands trail behind
        width: 1.6,        // line width in px
        taper: 0,          // 0 = even line, 1 = thins/fades fully to the tail
        mainAlpha: 0.9,    // opacity of the main strand
        alpha: 0.4,        // opacity of the other strands
        glow: 4,           // soft blur around lines
        join: 'miter',     // corner style: miter | round | bevel
        blend: 'source-over'
    };
    var PRESETS = {
        circoloco: {},
        tight:    { life: 120, jitter: 4, strands: 2, minStep: 5, mainTight: 0.9 },
        whip:     { life: 600, maxPoints: 160, jitter: 14, minStep: 8, taper: 0.7 },
        scribble: { strands: 5, jitter: 22, wobble: 3, minStep: 10, alpha: 0.5, lag: 2 },
        silk:     { smooth: 1, join: 'round', jitter: 6, strands: 4, taper: 0.8, glow: 0, life: 380, width: 1.2, alpha: 0.3 },
        neon:     { glow: 22, width: 2.2, blend: 'lighter', taper: 0.5, life: 320 },
        off:      { enabled: false }
    };
    var MAX_STRANDS = 8, KEY = 'cursorTrace';

    function assign(t) {
        for (var i = 1; i < arguments.length; i++) {
            var src = arguments[i];
            if (src) for (var k in src) if (Object.prototype.hasOwnProperty.call(src, k)) t[k] = src[k];
        }
        return t;
    }
    function saved() {
        try { var raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
    }
    function fromSaved() {
        var s = saved() || {};
        var base = PRESETS[s.preset] && s.preset !== 'custom' ? PRESETS[s.preset] : {};
        return assign({}, DEFAULTS, base, s);
    }

    var CONFIG = fromSaved();

    /* the API the "Your mode" panel uses — set() previews, save() keeps */
    window.CursorTrace = {
        DEFAULTS: DEFAULTS,
        PRESETS: PRESETS,
        get: function () { return assign({}, CONFIG); },
        set: function (patch) { assign(CONFIG, patch); },
        preset: function (name) { CONFIG = assign({}, DEFAULTS, PRESETS[name] || {}, { preset: PRESETS[name] ? name : 'circoloco' }); },
        save: function () { try { localStorage.setItem(KEY, JSON.stringify(CONFIG)); } catch (e) {} },
        load: function () { CONFIG = fromSaved(); },
        reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} CONFIG = assign({}, DEFAULTS); }
    };

    var off = matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)');
    var html = document.documentElement;

    function start() {
        var canvas = document.createElement('canvas');
        canvas.className = 'cursor-trace';
        canvas.setAttribute('aria-hidden', 'true');
        canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:400;pointer-events:none';
        var ctx = canvas.getContext && canvas.getContext('2d');
        if (!ctx) return;
        document.body.appendChild(canvas);

        var dpr = 1, w = 0, h = 0;
        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = innerWidth; h = innerHeight;
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resize();
        addEventListener('resize', resize);

        /* ── the accent, as [r,g,b] ─────────────────────────────────────── */
        var FALLBACK = {   /* pages that don't share the site's colours */
            og:     { light: '#6b2737', dark: '#c4707f' },
            vercel: { light: '#6b7a00', dark: '#eaff00' },
            lse:    { light: '#e0112b', dark: '#ff4d5e' }
        };
        function hexRgb(hx) { var n = parseInt(String(hx).replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
        var probe = document.createElement('span');
        probe.style.display = 'none';
        function accent() {
            if (getComputedStyle(html).getPropertyValue('--burgundy').trim()) {
                probe.style.color = 'var(--burgundy)';
                document.body.appendChild(probe);
                var m = getComputedStyle(probe).color.match(/(\d+(?:\.\d+)?)\D+(\d+(?:\.\d+)?)\D+(\d+(?:\.\d+)?)/);
                probe.remove();
                if (m) return [+m[1], +m[2], +m[3]];
            }
            try {
                var t = localStorage.getItem('theme');
                if (t === 'custom') {
                    var p = JSON.parse(localStorage.getItem('customPalette') || 'null');
                    if (p && p.accent) return hexRgb(p.accent);
                }
                var sc = FALLBACK[localStorage.getItem('scheme')] ? localStorage.getItem('scheme') : 'og';
                var dark = t === 'dark' || (t !== 'light' && !matchMedia('(prefers-color-scheme: light)').matches);
                return hexRgb(FALLBACK[sc][dark ? 'dark' : 'light']);
            } catch (e) { return hexRgb('#6b2737'); }
        }
        var RGB = accent();
        document.addEventListener('palettechange', function () { RGB = accent(); });

        /* ── points ─────────────────────────────────────────────────────── */
        var points = [], mouse = { x: -9999, y: -9999, active: false }, raf = 0;

        function addPoint(x, y) {
            var last = points[points.length - 1];
            if (last && Math.hypot(x - last.x, y - last.y) < CONFIG.minStep) return;
            if (!points.length) RGB = accent();
            var offs = [];
            for (var s = 0; s < MAX_STRANDS; s++) offs.push({ x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 });
            points.push({ x: x, y: y, t: performance.now(), offs: offs });
            while (points.length > CONFIG.maxPoints) points.shift();
        }

        addEventListener('pointermove', function (e) {
            if (off.matches || e.pointerType === 'touch' || !CONFIG.enabled) return;
            mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
            addPoint(e.clientX, e.clientY);
            if (!raf) raf = requestAnimationFrame(frame);
        }, { passive: true });
        document.addEventListener('mouseleave', function () { mouse.active = false; });

        /* a polyline; with smooth > 0 the corners become quadratic curves */
        function strokePath(pts, smooth) {
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            if (smooth <= 0 || pts.length < 3) {
                for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
            } else {
                for (var j = 1; j < pts.length - 1; j++) {
                    var p = pts[j], n = pts[j + 1];
                    var mx = (p.x + n.x) / 2, my = (p.y + n.y) / 2;
                    var ex = p.x + (mx - p.x) * smooth, ey = p.y + (my - p.y) * smooth;
                    var sx = p.x + (pts[j - 1].x - p.x) * smooth * 0.5, sy = p.y + (pts[j - 1].y - p.y) * smooth * 0.5;
                    ctx.lineTo(sx, sy);
                    ctx.quadraticCurveTo(p.x, p.y, ex, ey);
                }
                var last = pts[pts.length - 1];
                ctx.lineTo(last.x, last.y);
            }
            ctx.stroke();
        }

        function frame(now) {
            while (points.length && now - points[0].t > CONFIG.life) points.shift();
            ctx.clearRect(0, 0, w, h);
            if (!points.length || !CONFIG.enabled) { points = []; raf = 0; return; }

            var path = points.slice();
            if (mouse.active) path.push({ x: mouse.x, y: mouse.y, t: now, offs: null });
            var n = path.length;

            if (n > 1) {
                var r = RGB[0], g = RGB[1], b = RGB[2];
                ctx.globalCompositeOperation = CONFIG.blend;
                ctx.lineJoin = CONFIG.join;
                ctx.lineCap = 'round';
                ctx.shadowColor = 'rgba(' + r + ',' + g + ',' + b + ',0.7)';
                ctx.shadowBlur = CONFIG.glow;

                for (var s = 0; s < CONFIG.strands; s++) {
                    var isMain = s === 0;
                    var lagN = isMain ? 0 : Math.min(CONFIG.lag * s, n - 2);
                    var end = n - lagN, pts = [];
                    for (var i = 0; i < end; i++) {
                        var p = path[i], k = i / (n - 1);   /* 0 = tail, 1 = head */
                        var spread = CONFIG.jitter * (1 - k) * (isMain ? 1 - CONFIG.mainTight : 1);
                        var ox = p.offs ? p.offs[s].x * spread : 0;
                        var oy = p.offs ? p.offs[s].y * spread : 0;
                        if (CONFIG.wobble > 0 && p.offs) {
                            ox += Math.sin(now * 0.02 + i * 1.7 + s * 2.3) * CONFIG.wobble * (1 - k * 0.7);
                            oy += Math.cos(now * 0.023 + i * 1.3 + s * 1.9) * CONFIG.wobble * (1 - k * 0.7);
                        }
                        pts.push({ x: p.x + ox, y: p.y + oy });
                    }
                    if (pts.length < 2) continue;
                    var a = isMain ? CONFIG.mainAlpha : CONFIG.alpha;

                    if (CONFIG.taper <= 0) {
                        ctx.lineWidth = CONFIG.width;
                        ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
                        strokePath(pts, CONFIG.smooth);
                    } else {
                        /* thinner and fainter towards the tail, in short chunks */
                        var chunk = 3;
                        for (var c = 0; c < pts.length - 1; c += chunk - 1) {
                            var seg = pts.slice(c, c + chunk);
                            if (seg.length < 2) break;
                            var kk = (c + seg.length / 2) / (pts.length - 1);
                            var f = 1 - CONFIG.taper * (1 - kk);
                            ctx.lineWidth = Math.max(0.2, CONFIG.width * f);
                            ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (a * f) + ')';
                            strokePath(seg, CONFIG.smooth);
                        }
                    }
                }
                ctx.globalCompositeOperation = 'source-over';
            }
            raf = requestAnimationFrame(frame);
        }
    }

    if (document.body) start();
    else document.addEventListener('DOMContentLoaded', start);
}());
