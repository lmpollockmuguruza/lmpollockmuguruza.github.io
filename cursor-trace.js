/* ─────────────────────────────────────────────────────────────────────────
   Cursor trace — an irregular marker line in the accent colour that follows
   the pointer and fades. It reads the live accent (--burgundy) at the start
   of every stroke, so it follows light, dark and any custom palette.

   Off on touch screens and for reduced motion. Never catches clicks.

       <script src="cursor-trace.js" defer></script>
   ───────────────────────────────────────────────────────────────────────── */
(function () {
    var off = matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)');
    var html = document.documentElement;

    var cv = document.createElement('canvas');
    cv.className = 'cursor-trace';
    cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:150;pointer-events:none;mix-blend-mode:multiply';
    var ctx = cv.getContext && cv.getContext('2d');
    if (!ctx) return;
    document.body.appendChild(cv);

    var layer = document.createElement('canvas'), octx = layer.getContext('2d');
    var opt = { opacity: 0.55, life: 1500, rough: 0.45, width: 8 };
    var pts = [], raf = 0, dpr = 1, SIG = [107, 39, 55], night = false;

    function size() {
        dpr = Math.min(2, window.devicePixelRatio || 1);
        cv.width = Math.round(innerWidth * dpr);
        cv.height = Math.round(innerHeight * dpr);
    }
    addEventListener('resize', size);
    size();

    /* the accent as [r,g,b], whatever form the variable is written in */
    var probe = document.createElement('span');
    function accent() {
        probe.style.color = 'var(--burgundy)';
        probe.style.display = 'none';
        document.body.appendChild(probe);
        var m = getComputedStyle(probe).color.match(/(\d+(?:\.\d+)?)\D+(\d+(?:\.\d+)?)\D+(\d+(?:\.\d+)?)/);
        probe.remove();
        return m ? [+m[1], +m[2], +m[3]] : SIG;
    }
    function isDark() {
        if (window.SitePalette) return window.SitePalette.isDark();
        return html.getAttribute('data-theme') === 'dark';
    }

    /* a new stroke picks up the current colours */
    function startStroke() {
        SIG = accent();
        night = isDark();
        cv.style.mixBlendMode = night ? 'screen' : 'multiply';
    }

    function add(x, y, t) {
        if (!pts.length) startStroke();
        var last = pts[pts.length - 1];
        if (last && Math.hypot(x - last.x, y - last.y) < 2) return;
        pts.push({ x: x, y: y, t: t, j: (Math.random() - 0.5) * 2, w: 0.55 + Math.random() * 0.9 });
    }

    addEventListener('pointermove', function (e) {
        if (off.matches || e.pointerType === 'touch') return;
        var list = e.getCoalescedEvents ? e.getCoalescedEvents() : [e], now = performance.now();
        (list.length ? list : [e]).forEach(function (ev) { add(ev.clientX, ev.clientY, now); });
        if (!raf) raf = requestAnimationFrame(frame);
    }, { passive: true });
    document.addEventListener('mouseleave', function () { pts = []; });

    function frame(now) {
        if (layer.width !== cv.width || layer.height !== cv.height) { layer.width = cv.width; layer.height = cv.height; }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, cv.width, cv.height);
        pts = pts.filter(function (p) { return now - p.t < opt.life; });
        if (pts.length < 3) { raf = 0; return; }

        /* draw on white (or black) and blend, so the line fades into the paper */
        var base = night ? [0, 0, 0] : [255, 255, 255];
        octx.setTransform(1, 0, 0, 1, 0, 0);
        octx.fillStyle = night ? '#000' : '#fff';
        octx.fillRect(0, 0, layer.width, layer.height);
        octx.setTransform(dpr, 0, 0, dpr, 0, 0);
        octx.lineCap = 'round';
        octx.lineJoin = 'round';

        var P = pts.map(function (p, i) {
            var a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
            var dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
            dx /= L; dy /= L;
            var amp = p.j * opt.rough * opt.width * 1.1;
            return { x: p.x - dy * amp, y: p.y + dx * amp, age: (now - p.t) / opt.life, w: p.w };
        });
        for (var i = 1; i < P.length - 1; i++) {
            var p0 = P[i - 1], p1 = P[i], p2 = P[i + 1], life = 1 - p1.age, k = Math.pow(life, 1.3);
            octx.strokeStyle = 'rgb(' + SIG.map(function (v, j) { return Math.round(base[j] + (v - base[j]) * k); }) + ')';
            octx.lineWidth = Math.max(0.6, opt.width * p1.w * (0.35 + 0.65 * life));
            octx.beginPath();
            octx.moveTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
            octx.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
            octx.stroke();
        }
        ctx.globalAlpha = opt.opacity;
        ctx.drawImage(layer, 0, 0);
        ctx.globalAlpha = 1;
        raf = requestAnimationFrame(frame);
    }
}());
