/* ═══════════════════════════════════════════════════════
   Cinefilematic — third edition
   One page, eight questions in plain words, and a brief
   that composes itself live at the bottom — ready to send
   to Claude, ChatGPT or Gemini.
   Still built around how people actually choose films:
   where they are vs. where they want to be, and a
   tolerance that's read nightly, not as a personality.
   ═══════════════════════════════════════════════════════ */

/* ═══════════════ DATA ═══════════════ */

const DATA = {};

DATA.OCCASION = ['Winding down', 'Switching my brain off', 'A date', 'Friends are over', "Can't sleep", 'I want to feel something', 'A Sunday-night ritual', 'Avoiding something else', 'Celebrating', 'Just me and the dark'];

DATA.ENERGY = ['Drained', 'Tired', 'Fine', 'Up for it'];
const ENERGY_BRIEF = { 'Drained': 'running on empty', 'Tired': 'a bit tired', 'Fine': 'fine, steady', 'Up for it': 'energetic, up for anything' };

DATA.MOOD = ['Rough', 'Meh', 'Good', 'Great'];
const MOOD_BRIEF = { 'Rough': 'had a rough day, feeling low', 'Meh': 'flat, a bit meh', 'Good': 'in a good mood', 'Great': 'in a great mood' };

/* Mood management in plain clothes: match, repair, catharsis, escape, amplify. */
DATA.TRAJECTORY = ['Match my mood', 'Cheer me up', 'Help me let it out', 'Take my mind off things', 'Turn it up'];
const TRAJECTORY_BRIEF = {
    'Match my mood': 'stay in the key they’re in — keep them company, don’t try to fix the mood',
    'Cheer me up': 'lift them gently — warmth that earns itself, no forced cheer',
    'Help me let it out': 'take the feeling all the way to catharsis, through it rather than around it',
    'Take my mind off things': 'total escape — somewhere else entirely, the day switched off at the wall',
    'Turn it up': 'more voltage, not relief — intensify where they already are'
};

/* What people actually say to each other when choosing a film. */
DATA.VIBES = [
    { word: 'Light & fun',     gloss: 'nothing heavy, just a good time' },
    { word: 'Make me laugh',   gloss: 'properly funny' },
    { word: 'A good cry',      gloss: 'let me feel it' },
    { word: 'Intense',         gloss: 'edge of my seat' },
    { word: 'Dark & gritty',   gloss: 'grimy, morally messy' },
    { word: 'Scary',           gloss: 'get under my skin' },
    { word: 'Romantic',        gloss: 'longing, chemistry, desire' },
    { word: 'Big ideas',       gloss: 'philosophical, makes me think' },
    { word: 'Mind-bending',    gloss: 'puzzles, twists, strange logic' },
    { word: 'Beautiful',       gloss: 'gorgeous to look at' },
    { word: 'Party energy',    gloss: 'loud, alive, music, people' },
    { word: 'Cosy',            gloss: 'a warm blanket of a film' },
    { word: 'Bittersweet',     gloss: 'a small, lovely ache' },
    { word: 'Angry',           gloss: 'something with teeth' },
    { word: 'Weird',           gloss: 'surreal, dreamlike, off-kilter' },
    { word: 'Epic',            gloss: 'huge, sweeping, spectacle' },
    { word: 'Far away',        gloss: 'somewhere I’ve never been' },
    { word: 'Inspiring',       gloss: 'leaves me wanting to do things' }
];

DATA.EFFORT = ['Switch it off', 'Some thinking', 'Make me work'];
const EFFORT_BRIEF = { 'Switch it off': 'easy to fall into; no homework tonight', 'Some thinking': 'happy to think a little, nothing gruelling', 'Make me work': 'wants to be challenged; will lean in' };

DATA.ERA = ['Brand new', 'Last 10 years', '’80s to ’00s', 'Old classics', 'Any era'];
const ERA_BRIEF = { 'Brand new': 'brand new (the last couple of years)', 'Last 10 years': 'from the last ten years', '’80s to ’00s': 'from the 1980s to the 2000s', 'Old classics': 'older classics (before 1980)', 'Any era': 'any era' };

DATA.ENDINGS = ['Tie it up', 'Open is fine', 'Leave me hanging'];
const ENDINGS_BRIEF = { 'Tie it up': 'wants resolution — an ending that closes the loop', 'Open is fine': 'comfortable with open endings', 'Leave me hanging': 'actively wants ambiguity — an ending that keeps working after the credits' };

DATA.LAST_DIR = ['More like it', 'Something different', 'Either'];
const LAST_DIR_BRIEF = { 'More like it': 'wants something in the same register', 'Something different': 'wants a deliberate contrast', 'Either': 'no strong pull either way' };

/* The projective deck, dealt per session. Chosen blind, read as instinct. */
const STILLS_POOL = [
    'A kitchen at two in the morning, one light on, two people not quite arguing.',
    'A motorway at dusk, filmed from the back seat; nobody is speaking.',
    'A crowded dance floor, and one person standing perfectly still in the middle of it.',
    'Snow falling on a city that almost never gets snow.',
    'A long lunch in a garden — wine, wasps, someone about to say the wrong thing.',
    'An empty office at night; the photocopier hums; one desk lamp left on.',
    'A ferry deck in high wind, someone laughing into the noise.',
    'A hotel corridor with patterned carpet, and a door just clicking shut.',
    'A field at noon, heat shimmer, and the feeling that something is buried there.',
    'A child watching the adults through the bars of a banister.',
    'A petrol station at 4 a.m., lit like an aquarium, one car at the pump.',
    'The sea at night, heard but not seen, from an open window.'
];
const STILLS_PER_DEAL = 5;

DATA.TEXTURES = ['Celluloid grain', 'Neon on wet asphalt', 'Afternoon light through curtains', 'Fluorescent hum', 'Candlelight & shadow', 'Overcast naturalism', 'Saturated Technicolor', 'Harsh winter light'];

DATA.RUNTIME = ['Under 100 min', 'About 2 hours', 'Long is fine', 'No limit'];
const RUNTIME_BRIEF = { 'Under 100 min': 'under 100 minutes', 'About 2 hours': 'around two hours at most', 'Long is fine': 'long is fine, up to about three hours', 'No limit': 'no limit; epic is welcome' };

DATA.COMPANY = ['Just me', 'Partner', 'Friends', 'Family'];
const COMPANY_BRIEF = { 'Just me': 'alone', 'Partner': 'with a partner', 'Friends': 'with friends', 'Family': 'with family' };

DATA.DEPTH = [
    { word: 'The big ones',     gloss: 'I mostly watch the well-known films' },
    { word: 'A fair bit',       gloss: 'I seek things out' },
    { word: 'Loads',            gloss: 'the canon, festivals, repertory' },
    { word: 'Film is my life',  gloss: 'I’ve seen most of it, or work in it' }
];
const DEPTH_BRIEF = {
    'The big ones': 'casual, mostly the well-known films — stay legible, but don’t just hand them blockbusters they already know',
    'A fair bit': 'enthusiast who seeks things out — go a step past the obvious',
    'Loads': 'cinephile who knows the canon — skip the usual entry points',
    'Film is my life': 'obsessive, or works in film, and has seen most of it — reach for the far shelves'
};

DATA.LEASH = ['Surprise me', 'Balance', 'Stick to it'];
const LEASH_BRIEF = {
    'Surprise me': 'Read between the lines. Treat everything below as direction, not instructions. Weigh the overall mood above any single answer and feel free to surprise them: a great unexpected pick beats a literal one.',
    'Balance': 'Strike a balance. Honour the spirit of their answers, and let your own judgement break ties and fill the gaps.',
    'Stick to it': 'Stay close to the brief. Follow their answers fairly closely, while only recommending films you would genuinely stand behind.'
};

DATA.AVOID = ['Graphic violence', 'Sexual violence', 'Horror', 'Jump scares', 'Heavy gore', 'Bleak, no hope', 'Sentimentality', 'Big blockbusters', 'Musicals', 'Animation', 'Shaky cam'];

/* ═══════════════ THE PRINT SYSTEM ═══════════════
   Every brief is a numbered print: it draws a curator and a
   house rule at random. Same answers, different print, different
   films. LLMs fall into gravity wells; this keeps kicking them out. */

const CURATORS = [
    'You are the head programmer of a beloved repertory cinema. You think in double bills, you know exactly what a Tuesday-night audience can take, and you have never once said the word "content".',
    'You are the lifer behind the counter of the last great video shop. You remember what people rented, you notice what they bring back early, and your recommendations are famous in the neighbourhood.',
    'You are the artistic director of a small, fearless film festival. Your reach is properly global, your loyalty is to the film rather than the discourse, and you love handing someone the film nobody else would have thought of.',
    'You are a film critic who stopped publishing the day it stopped being fun, which only sharpened your taste. You are allergic to consensus picks, but you would never sacrifice the right film just to be contrary.',
    'You are an old projectionist who has watched more films through a small square window than most critics see in a lifetime. You trust light, faces, sound and rooms more than synopses.',
    'You are the filmmaker other filmmakers ask for recommendations: generous, unsnobbish, at home in half a dozen national cinemas, with a soft spot for the nearly-great.'
];

const HOUSE_RULES = [
    'At least one of the five must be from before 1975, unless they asked only for recent films.',
    'At least one of the five must run under 95 minutes.',
    'At least one of the five must come from a country this brief never mentions.',
    'At least one of the five must be directed by a woman.',
    'At least one of the five must be a comedy, however dark, even if nothing here asks for one.',
    'At least one of the five must work almost entirely in images: a film with barely a line worth quoting.',
    'At least one of the five must be a documentary, or something that lives next door to one.',
    'At least one of the five must be a first or second feature.',
    'At least one of the five must be in a language other than English, subtitles permitting.',
    'At least one of the five should be a film you suspect even a well-read film lover has never heard of.'
];

/* ═══════════════ SEEDED RANDOMNESS ═══════════════ */

function mulberry32(a) {
    return function () {
        a |= 0; a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
function randomSeed() { return Math.floor(Math.random() * 0xFFFFFFFF); }
function sample(arr, n, rng) {
    const pool = arr.slice(), out = [];
    while (out.length < n && pool.length) out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
    return out;
}
function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }
function printNo(seed) { return (seed >>> 16).toString(16).toUpperCase().padStart(4, '0'); }

/* ═══════════════ STATE ═══════════════ */

const DEFAULT_STATE = {
    deckSeed: 0,     // deals the image deck, stable per session
    printSeed: 0,    // draws the curator & house rule, re-rolled by "New print"
    occasion: '',
    energy: '', mood: '', trajectory: '',
    vibes: [], effort: '', era: [],
    proximity: 50, darkness: 50, endings: '',
    lastFilm: '', lastDir: '', bounced: '',
    still: '', textures: [],
    runtime: '', company: '', subtitles: 'ok', depth: '',
    leash: 'Surprise me', avoid: [], note: ''
};
const SAVE_KEY = 'cinefilematic.v5';

let state = clone(DEFAULT_STATE);

function clone(o) { return JSON.parse(JSON.stringify(o)); }
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {} }
function load() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (raw) {
            const saved = JSON.parse(raw);
            Object.keys(DEFAULT_STATE).forEach(k => {
                if (saved[k] !== undefined && typeof saved[k] === typeof DEFAULT_STATE[k] && Array.isArray(saved[k]) === Array.isArray(DEFAULT_STATE[k])) state[k] = saved[k];
            });
        }
    } catch (e) {}
    if (!state.deckSeed) state.deckSeed = randomSeed();
    if (!state.printSeed) state.printSeed = randomSeed();
}

/* ═══════════════ BUILD CONTROLS ═══════════════ */

const $ = id => document.getElementById(id);
const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

function buildGroup(el) {
    const items = DATA[el.dataset.build];
    if (!items) return;
    if (el.classList.contains('tiles')) {
        el.innerHTML = items.map(t =>
            `<button type="button" class="tile" data-val="${attr(t.word)}" aria-pressed="false">
                <span class="tile-word">${t.word}</span><span class="tile-gloss">${t.gloss}</span>
            </button>`).join('');
    } else if (el.classList.contains('seg')) {
        el.innerHTML = '<span class="seg-thumb" aria-hidden="true"></span>' +
            items.map(v => `<button type="button" data-val="${attr(v)}" aria-pressed="false">${v}</button>`).join('');
    } else {
        el.innerHTML = items.map(v => `<button type="button" class="chip" data-val="${attr(v)}" aria-pressed="false">${v}</button>`).join('');
    }
}

function buildStills() {
    const rng = mulberry32(state.deckSeed);
    const hand = sample(STILLS_POOL, STILLS_PER_DEAL, rng);
    // Keep a chosen still on the table even if the deal changes under it.
    if (state.still && !hand.includes(state.still)) hand[hand.length - 1] = state.still;
    $('stills').innerHTML = hand.map(s => `<button type="button" class="still" data-val="${attr(s)}" aria-pressed="false">${s}</button>`).join('');
}

/* ═══════════════ SELECT LOGIC ═══════════════ */

function wireGroups() {
    document.querySelectorAll('[data-group]').forEach(group => {
        group.addEventListener('click', e => {
            const btn = e.target.closest('[data-val]');
            if (!btn || !group.contains(btn)) return;
            toggleVal(group, btn.dataset.val);
        });
    });
}

function toggleVal(group, val) {
    const key = group.dataset.key, max = +(group.dataset.max || 0), excl = group.dataset.exclusive;
    if (group.dataset.select === 'single') {
        state[key] = state[key] === val ? '' : val;
    } else {
        let arr = state[key].slice();
        if (arr.includes(val)) arr = arr.filter(x => x !== val);
        else if (excl && val === excl) arr = [val];
        else {
            arr = arr.filter(x => x !== excl);
            if (max && arr.length >= max) arr.shift();
            arr.push(val);
        }
        state[key] = arr;
    }
    renderGroup(group);
    changed();
}

function renderGroup(group) {
    const cur = state[group.dataset.key];
    const single = group.dataset.select === 'single';
    group.querySelectorAll('[data-val]').forEach(btn => {
        const on = single ? cur === btn.dataset.val : (cur || []).includes(btn.dataset.val);
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on);
    });
    if (group.classList.contains('seg')) placeThumb(group);
}

/* The sliding thumb in a segmented control */
function placeThumb(seg) {
    const thumb = seg.querySelector('.seg-thumb');
    const on = seg.querySelector('button.active');
    if (!thumb) return;
    if (!on) { seg.classList.remove('has-value'); return; }
    seg.classList.add('has-value');
    thumb.style.transform = `translate(${on.offsetLeft}px, ${on.offsetTop}px)`;
    thumb.style.width = on.offsetWidth + 'px';
    thumb.style.height = on.offsetHeight + 'px';
}
function placeAllThumbs() { document.querySelectorAll('.seg').forEach(placeThumb); }

/* ═══════════════ SLIDERS ═══════════════ */

/* Fill from the centre outward, so an untouched slider reads as "no preference". */
function sliderFill(el) {
    const v = +el.value;
    el.style.setProperty('--a', Math.min(50, v) + '%');
    el.style.setProperty('--b', Math.max(50, v) + '%');
    el.closest('.slider').classList.toggle('set', v !== 50);
}

function wireInputs() {
    document.querySelectorAll('input[type="range"][data-path]').forEach(el => {
        el.addEventListener('input', () => {
            state[el.dataset.path] = +el.value;
            sliderFill(el);
            changed();
        });
        // Double-click / double-tap the track to clear back to "no preference"
        el.addEventListener('dblclick', () => { el.value = 50; state[el.dataset.path] = 50; sliderFill(el); changed(); });
    });
    $('subtitles').addEventListener('change', e => {
        state.subtitles = e.target.checked ? 'ok' : 'no';
        renderSubtitles();
        changed();
    });
    document.querySelectorAll('[data-text]').forEach(el => {
        el.addEventListener('input', () => { state[el.dataset.text] = el.value; changed(); });
    });
}

function renderSubtitles() {
    $('subtitles').checked = state.subtitles !== 'no';
    $('subText').textContent = state.subtitles === 'no' ? 'Rather not tonight' : 'Happy to read tonight';
}

/* Words, not numbers. 50 is "no preference" and stays out of the brief. */
function sliderPhrase(v, left, right) {
    const d = Math.abs(v - 50);
    if (d === 0) return null;
    if (d <= 8) return 'about the middle';
    const toward = v > 50 ? right : left;
    return (d <= 22 ? 'slightly toward ' : d <= 38 ? 'well toward ' : 'all the way toward ') + `“${toward}”`;
}

/* ═══════════════ RENDER FROM STATE ═══════════════ */

function renderFromState() {
    document.querySelectorAll('[data-group]').forEach(renderGroup);
    document.querySelectorAll('input[type="range"][data-path]').forEach(el => { el.value = state[el.dataset.path]; sliderFill(el); });
    document.querySelectorAll('[data-text]').forEach(el => { el.value = state[el.dataset.text] || ''; });
    renderSubtitles();
}

/* ═══════════════ PROGRESS ═══════════════ */

const ANSWERED = {
    1: s => !!s.occasion,
    2: s => !!(s.energy || s.mood || s.trajectory),
    3: s => !!(s.vibes.length || s.effort || s.era.length),
    4: s => s.proximity !== 50 || s.darkness !== 50 || !!s.endings,
    5: s => !!(s.lastFilm.trim() || s.bounced.trim() || s.lastDir),
    6: s => !!(s.still || s.textures.length),
    7: s => !!(s.runtime || s.company || s.depth || s.subtitles === 'no'),
    8: s => !!(s.avoid.length || s.note.trim() || s.leash !== DEFAULT_STATE.leash)
};

function renderProgress() {
    let n = 0;
    document.querySelectorAll('.q').forEach(sec => {
        const done = ANSWERED[sec.dataset.q](state);
        sec.classList.toggle('done', done);
        if (done) n++;
    });
    $('bar').style.width = (n / 8 * 100) + '%';
    $('dockCount').textContent = n;
    const v = state.vibes.length;
    $('vibeCount').textContent = v ? `${v} of 3` : 'up to three';
}

/* ═══════════════ THE BRIEF ═══════════════ */

const fmtDate = () => new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
function bq(t) { return t.trim().split(/\n/).map(l => '> ' + l).join('\n'); }

function buildMarkdown() {
    const s = state;
    const rng = mulberry32(s.printSeed);
    const curator = pick(CURATORS, rng);
    const houseRule = pick(HOUSE_RULES, rng);
    const no = printNo(s.printSeed);
    const L = [];
    const p = (...lines) => { L.push(...lines); L.push(''); };
    const section = (title, items) => { if (items.length) p(title, items.join('\n')); };

    p(`# Cinefilematic — a brief for tonight`);
    p(`*Print № ${no} · ${fmtDate()}*`);
    p('---');
    p(`## For the curator`);
    p(`${curator} You recommend like a trusted friend with a long memory, not an algorithm.`);
    p(`Read the whole brief first and form one impression of this person and their evening, the way a friend would across a table rather than working through a checklist. Then choose **exactly five films** for tonight, plus one clearly marked wildcard.`);
    p(
        `- **Open with a reading.** Start with one italic sentence interpreting the evening (*"Tonight reads like…"*). Not a summary of their answers but a reading of them. If you've got them wrong, this is how they'll correct you.`,
        `- **Skip the obvious ten.** Privately note the first ten titles this brief brings to mind. Every brief like this falls toward them. At most one of your five may come from that list, and only if it really is the right film.`,
        `- **Hold the contradictions.** Mixed signals describe a register, not confusion. Don't average them away. Find films that hold both ends, or split the five and say so.`,
        `- **Favour films that came from somewhere.** Particular, personal films that still land with anyone. When torn between two, pick that one.`,
        `- **Hard vs soft.** Runtime, who's watching, subtitles and the hard no's are hard limits. Everything else is weather, not law.`,
        `- **Pitch it right** for how much film they've seen. Never condescend in either direction.`,
        `- **Be decisive.** Five confident picks, spread across era, country and register.`
    );
    p(`For each film:`);
    p(
        `> **Title** — Director, Year, Country · runtime  `,
        `> Two or three sentences on why it suits *this* evening, with one concrete reason to trust it: an image, a sound, a scene. Not an adjective.  `,
        `> One line on where it came from: who made it, and out of what.`
    );
    p(`Then the **wildcard**: riskier and clearly marked, with one line on what it takes to love it.`);
    p(`**If no film fits tonight, say so.** Some evenings want a short film, an album or an early night. Say it in a line and leave one short film as a parting gift.`);
    p(`**House rule for this print:** ${houseRule}`);
    p(`Write with precision and warmth. Assume an intelligent viewer. No hype, no spoilers, no emojis.`);
    p('---');
    p(`## Tonight`);
    p(`**How to read it:** ${LEASH_BRIEF[s.leash] || LEASH_BRIEF['Balance']}`);

    if (s.occasion) p(`**The occasion:** ${s.occasion.toLowerCase()}`);

    const at = [];
    if (s.energy) at.push(`- Energy: ${ENERGY_BRIEF[s.energy]}`);
    if (s.mood) at.push(`- Mood: ${MOOD_BRIEF[s.mood]}`);
    if (s.trajectory) at.push(`- The film should: ${TRAJECTORY_BRIEF[s.trajectory]}`);
    section(`**Where they're at** *(weigh this heavily)*`, at);

    const want = [];
    want.push(`- The vibe: ${s.vibes.length ? s.vibes.map(w => { const v = DATA.VIBES.find(x => x.word === w); return v ? `${w.toLowerCase()} (${v.gloss})` : w; }).join('; ') : 'open, so surprise them'}`);
    if (s.effort) want.push(`- Effort: ${EFFORT_BRIEF[s.effort]}`);
    if (s.era.length) want.push(`- Era: ${s.era.map(x => ERA_BRIEF[x] || x).join(' or ')}`);
    section(`**What they're in the mood for** *(lean into it, don't over-fit)*`, want);

    const nerve = [];
    const prox = sliderPhrase(s.proximity, 'keep it at arm’s length', 'let it get personal');
    const dark = sliderPhrase(s.darkness, 'keep some hope in it', 'as bleak as it likes');
    if (prox) nerve.push(`- How personal: ${prox}`);
    if (dark) nerve.push(`- How dark: ${dark}`);
    if (s.endings) nerve.push(`- Endings: ${ENDINGS_BRIEF[s.endings]}`);
    section(`**How far it can go** *(tonight's limits, not a personality)*`, nerve);

    const anch = [];
    if (s.lastFilm.trim()) anch.push(`- Recently struck by: ${s.lastFilm.trim()}${s.lastDir ? `. Tonight they ${LAST_DIR_BRIEF[s.lastDir]}` : ''}`);
    else if (s.lastDir) anch.push(`- Relative to what they've watched lately, they ${LAST_DIR_BRIEF[s.lastDir]}`);
    if (s.bounced.trim()) anch.push(`- Recently bounced off: ${s.bounced.trim()} *(read this miss as carefully as the loves)*`);
    section(`**Anchors**`, anch);

    const reel = [];
    if (s.still) reel.push(`- The image that pulled at them, picked on instinct: *"${s.still}"*`);
    if (s.textures.length) reel.push(`- Textures: ${s.textures.join(', ').toLowerCase()}`);
    section(`**The pull** *(instinct, not instruction: match its temperature, not its contents)*`, reel);

    const room = [];
    if (s.runtime) room.push(`- Runtime: ${RUNTIME_BRIEF[s.runtime]}`);
    if (s.company) room.push(`- Watching: ${COMPANY_BRIEF[s.company]}`);
    room.push(`- Subtitles: ${s.subtitles === 'no' ? 'rather not tonight' : 'happy to read'}`);
    if (s.depth) room.push(`- How much film they've seen: ${DEPTH_BRIEF[s.depth]}`);
    section(`**The practical bit**`, room);

    if (s.avoid.length) p(`**Hard no's** *(honour these exactly)*`, `- ${s.avoid.join(', ')}`);

    if (s.note.trim()) p(`**In their own words** *(weigh this above everything else)*`, '', bq(s.note));

    p('---');
    L.push(`*Composed with Cinefilematic. Print № ${no}: another print of the same answers draws a different curator and house rule, and should bring back different films.*`);
    return L.join('\n');
}

/* One plain sentence back to the viewer — proof they were heard. */
function buildPortrait() {
    const s = state, bits = [];
    const how = [s.energy && s.energy.toLowerCase(), s.mood && `${s.mood.toLowerCase()} mood`].filter(Boolean);
    if (s.energy === 'Up for it') how[0] = 'up for it';
    if (how.length) bits.push(how.join(', '));
    if (s.vibes.length) bits.push('after ' + listJoin(s.vibes.map(v => v.toLowerCase())));
    if (s.occasion) bits.push(s.occasion.toLowerCase());
    if (s.company && s.company !== 'Just me') bits.push(COMPANY_BRIEF[s.company]);
    if (!bits.length) return 'Nothing answered yet. That works too: the curator gets a free hand.';
    const out = bits.join(' · ');
    return 'Tonight: ' + out + '.';
}
function listJoin(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }

/* ═══════════════ TINY MARKDOWN RENDERER ═══════════════
   Just enough for our own brief. */

function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function inlineMd(s) { return s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>'); }
function renderMd(md) {
    const out = [];
    let list = false, quote = [];
    const flushQuote = () => { if (quote.length) { out.push('<blockquote>' + quote.map(q => '<p>' + inlineMd(q) + '</p>').join('') + '</blockquote>'); quote = []; } };
    const flushList = () => { if (list) { out.push('</ul>'); list = false; } };
    for (const raw of md.split('\n')) {
        const t = escapeHtml(raw).trim();
        if (t.startsWith('&gt;')) { flushList(); quote.push(t.replace(/^&gt;\s?/, '')); continue; }
        flushQuote();
        if (t === '---') { flushList(); out.push('<hr>'); continue; }
        if (t.startsWith('# ')) { flushList(); out.push('<h3>' + inlineMd(t.slice(2)) + '</h3>'); continue; }
        if (t.startsWith('## ')) { flushList(); out.push('<h4>' + inlineMd(t.slice(3)) + '</h4>'); continue; }
        if (t.startsWith('- ')) { if (!list) { out.push('<ul>'); list = true; } out.push('<li>' + inlineMd(t.slice(2)) + '</li>'); continue; }
        flushList();
        if (t) out.push('<p>' + inlineMd(t) + '</p>');
    }
    flushList(); flushQuote();
    return out.join('\n');
}

/* ═══════════════ COMPOSE & SEND ═══════════════ */

let composed = '';

/* Claude and ChatGPT accept a pre-filled prompt in the URL; Gemini doesn't,
   so it gets the clipboard and a bare tab. Very long URLs fall back the same way. */
const LLMS = {
    claude:  { name: 'Claude',  prefill: q => 'https://claude.ai/new?q=' + encodeURIComponent(q), home: 'https://claude.ai/new' },
    chatgpt: { name: 'ChatGPT', prefill: q => 'https://chatgpt.com/?q=' + encodeURIComponent(q), home: 'https://chatgpt.com/' },
    gemini:  { name: 'Gemini',  prefill: null,                                                   home: 'https://gemini.google.com/app' }
};
const MAX_URL = 12000;

function sendHref(key) {
    const l = LLMS[key];
    if (!l.prefill) return l.home;
    const u = l.prefill(composed);
    return u.length <= MAX_URL ? u : l.home;
}

function compose() {
    composed = buildMarkdown();
    $('portrait').textContent = buildPortrait();
    $('printNo').textContent = '№ ' + printNo(state.printSeed);
    $('mdReading').innerHTML = renderMd(composed);
    document.querySelectorAll('.send').forEach(a => { a.href = sendHref(a.dataset.llm); });
}

let composeTimer;
function changed() {
    save();
    renderProgress();
    clearTimeout(composeTimer);
    composeTimer = setTimeout(compose, 120);
}

async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) {
        const ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select();
        let ok = false; try { ok = document.execCommand('copy'); } catch (err) {}
        document.body.removeChild(ta);
        return ok;
    }
}

function wireSend() {
    document.querySelectorAll('.send').forEach(a => {
        a.addEventListener('click', () => {
            clearTimeout(composeTimer); compose();   // make sure the latest answers are in
            const l = LLMS[a.dataset.llm];
            const prefilled = a.href !== l.home;
            copyText(composed);                       // the link opens by itself; the copy is the safety net
            toast(prefilled ? `Opening ${l.name}. Copied too, just in case` : `Copied. Paste it into ${l.name}`);
        });
    });
}

function download() {
    const blob = new Blob([composed], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cinefilematic-brief-' + printNo(state.printSeed).toLowerCase() + '.md';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Brief downloaded');
}

function reroll() {
    state.printSeed = randomSeed(); save();
    compose();
    toast(`Print № ${printNo(state.printSeed)}: same answers, new curator`);
}

function restart() {
    if (!confirm('Start over? This clears your answers.')) return;
    state = clone(DEFAULT_STATE);
    state.deckSeed = randomSeed();
    state.printSeed = randomSeed();
    save();
    buildStills();
    renderFromState();
    renderProgress();
    compose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

let toastTimer;
function toast(msg) {
    const t = $('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ═══════════════ SCROLL CHOREOGRAPHY ═══════════════ */

function wireScroll() {
    const topbar = $('topbar'), dock = $('dock');
    const hero = document.querySelector('.hero'), brief = $('brief');
    let heroVisible = true, briefVisible = false;
    const setDock = () => dock.classList.toggle('show', !heroVisible && !briefVisible);

    new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; setDock(); }, { threshold: 0.35 }).observe(hero);
    new IntersectionObserver(([en]) => { briefVisible = en.isIntersecting; setDock(); }, { threshold: 0.12 }).observe(brief);

    const onScroll = () => topbar.classList.toggle('scrolled', window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

    // Gentle reveal as sections arrive
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
        document.documentElement.classList.add('reveal-on');
        const io = new IntersectionObserver(entries => {
            entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
        }, { rootMargin: '0px 0px -12% 0px' });
        document.querySelectorAll('.q, .brief').forEach(el => io.observe(el));
    }
}

/* ═══════════════ THEME ═══════════════ */

(function () {
    const html = document.documentElement;
    function initial() {
        const s = localStorage.getItem('theme');
        if (s === 'dark' || s === 'light') return s;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    function apply(t) { t === 'dark' ? html.setAttribute('data-theme', 'dark') : html.removeAttribute('data-theme'); }
    const customPalette = () => !!(window.SitePalette && SitePalette.active());
    if (!customPalette()) apply(initial());
    document.addEventListener('DOMContentLoaded', () => {
        $('themeToggle').addEventListener('click', () => {
            const t = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            apply(t); localStorage.setItem('theme', t);
        });
    });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!customPalette() && !localStorage.getItem('theme')) apply(e.matches ? 'dark' : 'light');
    });
})();

/* ═══════════════ INIT ═══════════════ */

function init() {
    load();
    document.querySelectorAll('[data-build]').forEach(buildGroup);
    buildStills();
    wireGroups();
    wireInputs();
    wireSend();
    renderFromState();
    renderProgress();
    compose();

    $('copyBtn').addEventListener('click', async () => { clearTimeout(composeTimer); compose(); toast(await copyText(composed) ? 'Brief copied' : 'Couldn’t copy. Try Download instead'); });
    $('downloadBtn').addEventListener('click', () => { clearTimeout(composeTimer); compose(); download(); });
    $('rerollBtn').addEventListener('click', reroll);
    $('restartBtn').addEventListener('click', restart);

    wireScroll();
    window.addEventListener('resize', placeAllThumbs);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeAllThumbs);
    // Thumbs measure after layout settles
    requestAnimationFrame(() => requestAnimationFrame(() => {
        placeAllThumbs();
        document.documentElement.classList.add('thumbs-ready');
    }));
}
document.addEventListener('DOMContentLoaded', init);
