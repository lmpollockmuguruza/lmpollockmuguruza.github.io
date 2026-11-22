/* ─────────────────────────────────────────────────────────────────────────
   Shared custom palette — "your mode"

   The palette is chosen on the home page (the Borges modal) and kept in
   localStorage. Every page that shares the burgundy scheme loads this file
   so the reader's colours follow them around the site.

   Load it synchronously in <head>, before anything paints:

       <script src="../palette.js"></script>                  glass pages
       <script src="../palette.js" data-profile="solid"></script>

   The two profiles differ only in how surfaces and hairlines are drawn:
   "glass" pages float translucent white cards over the paper, "solid" pages
   (architecture, gallery) use opaque cards with a fine ink border.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
    var html = document.documentElement;
    var script = document.currentScript;
    var profile = (script && script.getAttribute('data-profile')) || 'glass';

    var VARS = [
        'bg', 'bg-warm', 'bg-card', 'bg-card-hover', 'bg-glass', 'bg-glass-strong',
        'bg-surface', 'bg-elevated', 'warm-white', 'warm-white-strong',
        'ink', 'ink-soft', 'ink-muted', 'ink-faint', 'ink-ghost',
        'burgundy', 'burgundy-soft', 'burgundy-dark', 'burgundy-wash', 'burgundy-glow',
        'border', 'border-subtle', 'border-hover', 'border-focus', 'track',
        'glass-border', 'glass-shadow', 'glass-shadow-hover', 'glass-shadow-elevated',
        'shadow-sm', 'shadow-md', 'shadow-lg',
        'shadow-card', 'shadow-card-hover', 'shadow-preview',
        'shadow-photo', 'shadow-photo-hover', 'shadow-cluster',
        'selection'
    ];
    var DEFAULT = { paper: '#f2efe9', ink: '#1a1816', accent: '#6b2737' };
    var WHITE = [255, 255, 255];

    var hx = function (h) { h = String(h).replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; };
    var mix = function (a, b, t) { return a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }); };
    var rgb = function (c) { return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'; };
    var rgba = function (c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; };
    var lum = function (c) { return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255; };

    var on = false;

    function apply(p) {
        if (!p || !p.paper || !p.ink || !p.accent) return;
        /* the selection highlight is the accent — one colour, not two */
        var bg = hx(p.paper), ink = hx(p.ink), ac = hx(p.accent);
        var light = lum(bg) > 0.5;
        var s = html.style;
        var set = function (k, v) { s.setProperty('--' + k, v); };

        /* paper and ink */
        set('bg', rgb(bg));
        set('bg-warm', rgb(mix(bg, ink, 0.045)));
        set('ink', rgb(ink));
        set('ink-soft', rgb(mix(ink, bg, 0.14)));
        set('ink-muted', rgb(mix(ink, bg, 0.45)));
        set('ink-faint', rgb(mix(ink, bg, 0.66)));
        set('ink-ghost', rgb(mix(ink, bg, 0.8)));

        /* accent (still called burgundy everywhere) */
        set('burgundy', rgb(ac));
        set('burgundy-soft', rgb(mix(ac, bg, 0.18)));
        set('burgundy-dark', rgb(mix(ac, ink, 0.3)));
        set('burgundy-wash', rgba(ac, light ? 0.05 : 0.07));
        set('burgundy-glow', rgba(ac, light ? 0.10 : 0.13));
        set('border-hover', rgba(ac, light ? 0.2 : 0.22));
        set('border-focus', rgba(ac, light ? 0.25 : 0.28));
        set('selection', rgb(ac));

        /* surfaces — opaque on solid pages, floating glass elsewhere */
        var cardSolid = light ? rgb(mix(bg, WHITE, 0.55)) : rgb(mix(bg, ink, 0.055));
        var cardSolidHover = light ? rgb(mix(bg, WHITE, 0.9)) : rgb(mix(bg, ink, 0.105));
        var cardGlass = light ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.04)';
        var cardGlassHover = light ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.07)';
        var solid = profile === 'solid';

        set('bg-card', solid ? cardSolid : cardGlass);
        set('bg-card-hover', solid ? cardSolidHover : cardGlassHover);
        set('bg-surface', cardSolid);
        set('bg-elevated', cardSolidHover);
        set('warm-white', cardGlass);
        set('warm-white-strong', cardGlassHover);
        set('bg-glass', light ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.03)');
        set('bg-glass-strong', light ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.06)');
        set('track', rgba(ink, 0.10));

        /* borders */
        set('border', solid ? rgba(ink, light ? 0.07 : 0.06)
            : (light ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.08)'));
        set('border-subtle', light ? rgba(ink, 0.06) : 'rgba(255,255,255,0.04)');
        set('glass-border', light ? '1px solid rgba(255,255,255,0.55)' : '1px solid rgba(255,255,255,0.08)');

        /* shadows — tinted with ink on paper, plain black in the dark */
        var sh = function (a) { return light ? rgba(ink, a[0]) : 'rgba(0,0,0,' + a[1] + ')'; };
        set('glass-shadow', light
            ? '0 4px 24px ' + rgba(ink, 0.04) + ',0 1px 3px ' + rgba(ink, 0.03)
            : '0 4px 24px rgba(0,0,0,0.15),0 1px 3px rgba(0,0,0,0.1)');
        set('glass-shadow-hover', light
            ? '0 8px 32px ' + rgba(ac, 0.07) + ',0 2px 8px ' + rgba(ac, 0.04)
            : '0 8px 32px ' + rgba(ac, 0.12) + ',0 2px 8px ' + rgba(ac, 0.06));
        set('glass-shadow-elevated', light
            ? '0 12px 44px ' + rgba(ac, 0.1) + ',0 4px 12px ' + rgba(ac, 0.05) + ',0 6px 20px ' + rgba(ink, 0.04)
            : '0 12px 44px ' + rgba(ac, 0.15) + ',0 4px 12px ' + rgba(ac, 0.08) + ',0 6px 20px rgba(0,0,0,0.15)');
        set('shadow-sm', '0 1px 2px ' + sh([0.04, 0.12]));
        set('shadow-md', '0 4px 16px ' + sh([0.06, 0.15]));
        set('shadow-lg', '0 8px 32px ' + sh([0.08, 0.2]));
        set('shadow-card', '0 1px 3px ' + sh([0.03, 0.12]) + ',0 6px 24px ' + sh([0.04, 0.15]));
        set('shadow-card-hover', '0 2px 8px ' + sh([0.05, 0.15]) + ',0 12px 40px ' + sh([0.07, 0.2]));
        set('shadow-preview', '0 8px 40px ' + sh([0.12, 0.35]) + ',0 2px 12px ' + sh([0.06, 0.2]));
        set('shadow-photo', '0 1px 3px ' + sh([0.06, 0.15]) + ',0 4px 16px ' + sh([0.04, 0.12]));
        set('shadow-photo-hover', '0 8px 32px ' + sh([0.12, 0.3]) + ',0 2px 8px ' + sh([0.06, 0.15]));
        set('shadow-cluster', '0 1px 2px ' + sh([0.03, 0.1]));

        /* a custom palette replaces light/dark rather than layering on it */
        html.removeAttribute('data-theme');
        on = true;
        emit();
    }

    /* take the painted colours off, leaving what is saved alone */
    function unpaint() {
        VARS.forEach(function (k) { html.style.removeProperty('--' + k); });
        on = false;
    }

    function clear() {
        unpaint();
        try { localStorage.removeItem('customPalette'); } catch (e) {}
        emit();
    }

    /* ── Colour schemes ──────────────────────────────────────────────────
       Picked from the top bar: lucas' own colours (og), Vercel and LSE.
       Each comes in light and dark; the Light/Dark switch picks which.
       og is the stylesheet itself, so it paints nothing. */
    var SCHEMES = {
        og: null,
        vercel: {
            light: { paper: '#ffffff', ink: '#0a0a0a', accent: '#6b7a00' },
            dark:  { paper: '#0a0a0a', ink: '#ededed', accent: '#eaff00' }
        },
        lse: {
            light: { paper: '#ffffff', ink: '#14171c', accent: '#e0112b' },
            dark:  { paper: '#0f1115', ink: '#ebedf0', accent: '#ff4d5e' }
        }
    };
    var get = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
    var put = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };

    function scheme() {
        var sc = get('scheme');
        return SCHEMES.hasOwnProperty(sc) ? sc : 'og';
    }

    /* light or dark. With nothing chosen yet (or the older 'auto'), the site
       is dark unless the reader's system asks for light. */
    function mode() {
        var t = get('theme');
        if (t === 'dark') return 'dark';
        if (t === 'light') return 'light';
        if (t === 'custom' && on) return isDark() ? 'dark' : 'light';
        return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    /* paint whatever is saved: a custom palette, or a scheme in light/dark */
    function render() {
        if (get('theme') === 'custom') {
            var p = stored();
            if (p) { apply(p); return; }
            put('theme', 'light');
        }
        var sc = scheme(), m = mode();
        if (SCHEMES[sc]) apply(SCHEMES[sc][m]);
        else { unpaint(); emit(); }
        if (m === 'dark') html.setAttribute('data-theme', 'dark');
        else html.removeAttribute('data-theme');
    }

    function setMode(m) {
        if (get('theme') === 'custom') clear();
        put('theme', m === 'dark' ? 'dark' : 'light');
        if (get('gallery-theme')) put('gallery-theme', m === 'dark' ? 'dark' : 'light');
        render();
    }

    function setScheme(sc) {
        if (!SCHEMES.hasOwnProperty(sc)) sc = 'og';
        var m = mode();
        if (get('theme') === 'custom') clear();
        put('scheme', sc);
        put('theme', m);
        render();
    }

    /* for anything that paints its own colours (canvas, map tiles, markers) */
    function emit() {
        try { document.dispatchEvent(new CustomEvent('palettechange')); } catch (e) {}
    }

    /* palettes saved when accent and selection were separate: the old vercel
       preset kept its neon yellow in the selection, so that becomes the accent */
    function upgrade(p) {
        if (p && p.sel && String(p.sel).toLowerCase() === '#eaff00' &&
            String(p.accent).toLowerCase() === '#fafafa') p.accent = '#eaff00';
        if (p) delete p.sel;
        return p;
    }

    /* the saved palette, or null when the reader is on light/dark/auto */
    function stored() {
        try {
            if (localStorage.getItem('theme') !== 'custom') return null;
            var raw = localStorage.getItem('customPalette');
            return raw ? upgrade(JSON.parse(raw)) : null;
        } catch (e) { return null; }
    }

    /* is the page currently dark? works for both themes and custom palettes */
    function isDark() {
        if (!on) return html.getAttribute('data-theme') === 'dark';
        var bg = getComputedStyle(html).getPropertyValue('--bg').trim();
        var m = bg.match(/(\d+)\D+(\d+)\D+(\d+)/);
        return m ? lum([+m[1], +m[2], +m[3]]) <= 0.5 : false;
    }

    window.SitePalette = {
        VARS: VARS,
        DEFAULT: DEFAULT,
        apply: apply,
        clear: clear,
        stored: stored,
        isDark: isDark,
        upgrade: upgrade,
        SCHEMES: SCHEMES,
        scheme: scheme,
        mode: mode,
        render: render,
        setMode: setMode,
        setScheme: setScheme,
        custom: function () { return get('theme') === 'custom' && on; },
        active: function () { return on; }
    };

    /* Apply before first paint. On lucas' own colours each page keeps its
       own light/dark start-up, so there is nothing to do here. */
    if (get('theme') === 'custom' || scheme() !== 'og') render();

    /* The theme toggles on the other pages: under a custom palette they drop it
       and go back to lucas' colours; under Vercel or LSE they flip that scheme
       between light and dark. Capture the click before the page's own handler. */
    document.addEventListener('click', function (e) {
        if (!on || !e.target || !e.target.closest) return;
        if (!e.target.closest('.theme-toggle,#themeToggle')) return;
        e.preventDefault();
        e.stopPropagation();
        if (get('theme') === 'custom') {
            clear();
            put('theme', 'light');
            if (get('gallery-theme')) put('gallery-theme', 'light');
            html.removeAttribute('data-theme');
        } else {
            setMode(mode() === 'dark' ? 'light' : 'dark');
        }
    }, true);
}());
