/* ─────────────────────────────────────────────────────────────────────────
   Shared document viewer behaviour — /cv/ and every folder under /papers/.

   A page opts in with one element:

       <div class="viewer" id="pdfViewer"
            data-pdf="Some-Paper.pdf"
            data-label="Some Paper (PDF)"
            data-fallback="https://…optional mirror…">

   The script then:
     · checks the PDF is actually there (HEAD) before embedding it, so a
       folder waiting for its upload shows a written note rather than a
       404 page trapped inside a frame;
     · embeds the browser's own PDF viewer on pointer devices with room
       for it, and hands off to "open / download" on phones, where inline
       PDF frames are unreliable;
     · keeps the theme toggle, topbar and entrance animations in step with
       the rest of the site.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
    'use strict';

    var html = document.documentElement;

    /* ─── Theme ─────────────────────────────────────────────────────────── */
    function initialTheme() {
        var saved = localStorage.getItem('theme');
        if (saved === 'dark') return 'dark';
        if (saved === 'light') return 'light';
        if (!saved || saved === 'auto') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        /* 'custom' — palette.js has already painted the reader's own colours
           and cleared data-theme, so leave the light base underneath it. */
        return 'light';
    }

    function applyTheme(theme) {
        if (theme === 'dark') html.setAttribute('data-theme', 'dark');
        else html.removeAttribute('data-theme');
    }

    applyTheme(initialTheme());

    function bindToggle(el) {
        if (!el) return;
        el.addEventListener('click', function () {
            var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            localStorage.setItem('theme', next);
        });
    }

    bindToggle(document.getElementById('themeToggle'));
    bindToggle(document.getElementById('themeToggleEnd'));

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        var saved = localStorage.getItem('theme');
        if (!saved || saved === 'auto') applyTheme(e.matches ? 'dark' : 'light');
    });

    /* ─── Topbar ────────────────────────────────────────────────────────── */
    var topbar = document.getElementById('topbar');
    if (topbar) {
        var ticking = false;
        window.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                topbar.classList.toggle('scrolled', window.scrollY > 40);
                ticking = false;
            });
        }, { passive: true });
    }

    /* ─── Entrance animations ───────────────────────────────────────────── */
    var animated = document.querySelectorAll('[data-anim]');
    if (animated.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var delay = parseInt(entry.target.getAttribute('data-anim'), 10) || 0;
                setTimeout(function () { entry.target.classList.add('visible'); }, delay);
                io.unobserve(entry.target);
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
        animated.forEach(function (el) { io.observe(el); });
    }

    /* ─── Viewer ────────────────────────────────────────────────────────── */
    var viewer = document.getElementById('pdfViewer');
    if (!viewer) return;

    var url = viewer.getAttribute('data-pdf');
    var label = viewer.getAttribute('data-label') || 'Document';
    var fallback = viewer.getAttribute('data-fallback') || '';
    var stage = viewer.querySelector('.viewer-stage');
    if (!url || !stage) return;

    var ICONS = {
        open: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/></svg>',
        download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>',
        page: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>',
        phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>'
    };

    function esc(value) {
        return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function actions(extra) {
        var html = '<div class="doc-actions">' +
            '<a class="btn btn-primary" href="' + esc(url) + '" target="_blank" rel="noopener">' +
            ICONS.open + 'Open in a new window</a>' +
            '<a class="btn" href="' + esc(url) + '" download>' + ICONS.download + 'Download PDF</a>';
        if (extra) html += extra;
        return html + '</div>';
    }

    function state(icon, heading, body, extra) {
        stage.innerHTML = '<div class="viewer-state">' + icon +
            '<h2>' + heading + '</h2><p>' + body + '</p>' + (extra || '') + '</div>';
    }

    function loading() {
        stage.innerHTML = '<div class="viewer-state"><div class="spinner" role="status" ' +
            'aria-label="Loading document"></div><p>Loading ' + esc(label) + '…</p></div>';
    }

    /* Phones and small tablets render inline PDF frames poorly (iOS shows a
       single unscrollable page), so hand off to the system viewer instead. */
    function shouldEmbed() {
        var narrow = window.matchMedia('(max-width: 820px)').matches;
        var coarse = window.matchMedia('(pointer: coarse)').matches;
        var iOS = /iP(hone|od)/.test(navigator.userAgent) ||
            (/iPad/.test(navigator.userAgent)) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        return !(narrow || iOS || (coarse && window.innerWidth < 1100));
    }

    /* Full screen belongs to the inline frame; the other states have nothing
       to expand. */
    function showFullscreenButton(show) {
        var button = document.getElementById('viewerFullscreen');
        if (button) button.hidden = !show || !viewer.requestFullscreen;
    }

    function embed() {
        var frame = document.createElement('iframe');
        frame.className = 'pdf-frame';
        frame.title = label;
        frame.setAttribute('loading', 'lazy');
        frame.src = url + '#view=FitH';
        stage.innerHTML = '';
        stage.appendChild(frame);
        viewer.setAttribute('data-embedded', 'true');
        showFullscreenButton(true);
    }

    function handOff() {
        showFullscreenButton(false);
        state(
            ICONS.phone,
            'Best read in your PDF viewer',
            'Inline PDFs are unreliable on small screens, so this one opens in ' +
            'your device&rsquo;s own reader &mdash; where text selection, zoom and ' +
            'screen readers all behave properly.',
            actions()
        );
    }

    function unavailable() {
        showFullscreenButton(false);
        var extra = fallback
            ? '<div class="doc-actions"><a class="btn btn-primary" href="' + esc(fallback) +
              '" target="_blank" rel="noopener">' + ICONS.open + 'Read the current copy</a></div>'
            : '';
        state(
            ICONS.page,
            'Not uploaded yet',
            'The PDF for this page hasn&rsquo;t been added to the repository yet. ' +
            (fallback ? 'In the meantime, the current copy lives here:' : 'Please check back shortly.'),
            extra
        );
        document.querySelectorAll('[data-requires-pdf]').forEach(function (el) {
            el.setAttribute('aria-disabled', 'true');
            el.setAttribute('title', 'The PDF has not been uploaded yet');
        });
    }

    function present() {
        /* A HEAD request tells us whether the upload has happened without
           pulling the whole file down. If the check itself fails (offline,
           file://, an odd proxy) we assume the file is there and let the
           browser decide. */
        if (!window.fetch) return Promise.resolve(true);
        return fetch(url, { method: 'HEAD' })
            .then(function (res) {
                if (!res.ok) return false;
                var type = res.headers.get('content-type') || '';
                /* GitHub Pages serves its 404 page with 200 in some setups;
                   an HTML content type means the PDF is not there. */
                return type.indexOf('text/html') === -1;
            })
            .catch(function () { return true; });
    }

    showFullscreenButton(false);
    loading();
    present().then(function (ok) {
        if (!ok) unavailable();
        else if (shouldEmbed()) embed();
        else handOff();
    });

    /* ─── Fullscreen ────────────────────────────────────────────────────── */
    var fsButton = document.getElementById('viewerFullscreen');
    if (fsButton) {
        fsButton.addEventListener('click', function () {
            if (document.fullscreenElement) document.exitFullscreen();
            else if (viewer.requestFullscreen) viewer.requestFullscreen();
        });
        document.addEventListener('fullscreenchange', function () {
            var on = document.fullscreenElement === viewer;
            viewer.classList.toggle('is-fullscreen', on);
            fsButton.setAttribute('aria-pressed', on ? 'true' : 'false');
            fsButton.setAttribute('aria-label', on ? 'Exit full screen' : 'View full screen');
            /* Full screen only makes sense around an embedded frame. */
            if (on && !viewer.getAttribute('data-embedded')) embed();
        });
    }
})();
