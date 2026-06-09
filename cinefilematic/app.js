/* ═══════════════════════════════════════════════════════
   Cinefilematic — second edition
   Two tracks (an evening / a film club season), a seeded
   "print" system so no two briefs read alike, and a brief
   composed around how people actually choose films:
   state vs. desired state, mood repair vs. mood match,
   hedonic vs. eudaimonic appetite, tolerance read nightly.
   ═══════════════════════════════════════════════════════ */

/* ═══════════════ DATA · SHARED ═══════════════ */

const OCCASION = ['Winding down', 'Switching my brain off', 'A date', 'Friends are over', "Can't sleep", 'I want to feel something', 'A Sunday-night ritual', 'Avoiding something else', 'Celebrating something', 'Just me and the dark'];

/* Where the film should take them, relative to where they arrive.
   Mood-management in plain clothes: match, process, repair, displace, amplify. */
const TRAJECTORIES = [
    { word: 'Sit with me in it',  brief: 'stay in the key they arrived in — companionship, not rescue; a film that understands the mood rather than fixing it' },
    { word: 'Carry it through',   brief: 'take the feeling seriously and carry it all the way to catharsis — through the feeling, not around it' },
    { word: 'Lift me, gently',    brief: 'shift the register upward without whiplash — warmth that earns itself, no forced cheer' },
    { word: 'Flip the switch',    brief: 'full transport — somewhere else entirely, total absorption, the day switched off at the wall' },
    { word: 'Sharpen it',         brief: 'intensify the state they arrived in — they want more voltage, not relief' }
];

const MOODS = [
    { word: 'Comfort',    gloss: 'warm, like a hand on the shoulder' },
    { word: 'Catharsis',  gloss: 'let me feel it; let me cry' },
    { word: 'Awe',        gloss: 'show me something beautiful' },
    { word: 'Dread',      gloss: 'unsettle me; get under the skin' },
    { word: 'Adrenaline', gloss: 'propulsive, no brakes' },
    { word: 'Melancholy', gloss: 'bittersweet, a small ache' },
    { word: 'Wit',        gloss: 'sharp, funny, awake' },
    { word: 'Longing',    gloss: 'romance, desire, distance' },
    { word: 'Wonder',     gloss: 'playful, strange, dreamlike' },
    { word: 'Rigour',     gloss: 'make me work for it' },
    { word: 'Teeth',      gloss: 'anger, edge, provocation' },
    { word: 'Elsewhere',  gloss: 'take me far from here' }
];

const ENDINGS = ['Closed — resolve it for me', 'Open is welcome', 'Leave me mid-air'];
const ENDINGS_BRIEF = {
    'Closed — resolve it for me': 'wants resolution tonight — an ending that closes the loop',
    'Open is welcome': 'comfortable with open endings and unresolved chords',
    'Leave me mid-air': 'actively wants ambiguity — an ending that keeps working after the credits'
};

const LAST_DIR = ['Give me its cousin', 'Give me a contrast', 'No strong feeling — surprise me'];

/* The projective deck — dealt per print. Chosen blind, read as instinct. */
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
const STILLS_PER_PRINT = 6;

const TEXTURES = ['Celluloid grain', 'Neon on wet asphalt', 'Afternoon light through curtains', 'Fluorescent hum', 'Candlelight & shadow', 'Overcast naturalism', 'Saturated Technicolor', 'Harsh winter light'];

const RUNTIME = ['Under 100 min', 'Around two hours', 'Up to three hours', 'Epic is welcome (3 hr+)', 'Runtime is no object'];
const COMPANY = ['Alone', 'With a partner', 'With friends', 'With family'];
const SERVICES = ['Criterion Channel', 'MUBI', 'Netflix', 'Max', 'Prime Video', 'Disney+', 'Apple TV+', 'Kanopy', 'Hulu', 'A cinema near me', "I'll find it somehow"];

const DEPTH = [
    { title: 'Casual',        gloss: 'a few good films a year',                          val: 'Casual — a few good films a year' },
    { title: 'Enthusiast',    gloss: 'I seek things out',                                val: 'Enthusiast — seeks things out' },
    { title: 'Cinephile',     gloss: 'canons, repertory, festivals',                     val: 'Cinephile — canons, repertory, festivals' },
    { title: 'Obsessive',     gloss: "I've seen the obvious ones, and most of the rest", val: 'Obsessive — has seen the obvious ones and most of the rest' },
    { title: 'In the trade',  gloss: 'I make, programme, or write about film',           val: 'In the trade — makes, programmes, or writes about film' }
];

/* Calibration pool, stratified by how far off the beaten path each tier sits.
   Each print deals six from each tier, so the hand always spans the range. */
const SEEN_POOL = {
    near: [
        { title: 'Pulp Fiction',              meta: 'Tarantino · 1994' },
        { title: 'Parasite',                  meta: 'Bong Joon-ho · 2019' },
        { title: '2001: A Space Odyssey',     meta: 'Kubrick · 1968' },
        { title: 'Spirited Away',             meta: 'Miyazaki · 2001' },
        { title: 'Goodfellas',                meta: 'Scorsese · 1990' },
        { title: 'Alien',                     meta: 'Ridley Scott · 1979' },
        { title: 'There Will Be Blood',       meta: 'P.T. Anderson · 2007' },
        { title: 'The Shining',               meta: 'Kubrick · 1980' },
        { title: 'Seven Samurai',             meta: 'Kurosawa · 1954' },
        { title: 'Portrait of a Lady on Fire',meta: 'Sciamma · 2019' },
        { title: 'No Country for Old Men',    meta: 'Coen brothers · 2007' },
        { title: 'Oldboy',                    meta: 'Park Chan-wook · 2003' }
    ],
    mid: [
        { title: 'In the Mood for Love',      meta: 'Wong Kar-wai · 2000' },
        { title: 'Persona',                   meta: 'Bergman · 1966' },
        { title: 'Mulholland Drive',          meta: 'Lynch · 2001' },
        { title: 'Stalker',                   meta: 'Tarkovsky · 1979' },
        { title: 'Tokyo Story',               meta: 'Ozu · 1953' },
        { title: 'Come and See',              meta: 'Klimov · 1985' },
        { title: 'Close-Up',                  meta: 'Kiarostami · 1990' },
        { title: 'The Battle of Algiers',     meta: 'Pontecorvo · 1966' },
        { title: 'Cléo from 5 to 7',          meta: 'Varda · 1962' },
        { title: '8½',                        meta: 'Fellini · 1963' },
        { title: 'Chungking Express',         meta: 'Wong Kar-wai · 1994' },
        { title: 'Memories of Murder',        meta: 'Bong Joon-ho · 2003' }
    ],
    far: [
        { title: 'Yi Yi',                     meta: 'Edward Yang · 2000' },
        { title: 'Beau Travail',              meta: 'Claire Denis · 1999' },
        { title: 'Jeanne Dielman',            meta: 'Akerman · 1975' },
        { title: 'Sátántangó',                meta: 'Béla Tarr · 1994' },
        { title: 'The Color of Pomegranates', meta: 'Parajanov · 1969' },
        { title: 'Tropical Malady',           meta: 'Apichatpong · 2004' },
        { title: 'A Brighter Summer Day',     meta: 'Edward Yang · 1991' },
        { title: 'Killer of Sheep',           meta: 'Charles Burnett · 1978' },
        { title: 'Daughters of the Dust',     meta: 'Julie Dash · 1991' },
        { title: 'Touki Bouki',               meta: 'Mambéty · 1973' },
        { title: 'Sans Soleil',               meta: 'Chris Marker · 1983' },
        { title: 'Wanda',                     meta: 'Barbara Loden · 1970' }
    ]
};
const SEEN_PER_TIER = 6;

const CINEMAS = ['French New Wave', 'Italian neorealism', 'New Hollywood', 'Classic Hollywood', 'Japanese golden age', 'Hong Kong', 'South Korean', 'Iranian', 'Taiwanese New Wave', 'Romanian New Wave', 'New German', 'Soviet & Russian', 'Scandinavian', 'Latin American', 'British', 'Indian / Parallel', 'African', 'Silent era', 'Contemporary arthouse', 'Animation'];

const DIALS = [
    { key: 'familiar', left: 'Familiar',        right: 'Uncharted',          lp: 'the familiar',    rp: 'the uncharted',      label: 'Familiar ↔ Uncharted' },
    { key: 'meaning',  left: 'Pure pleasure',   right: 'Meaning & weight',   lp: 'pure pleasure',   rp: 'meaning & weight',   label: 'Pure pleasure ↔ Meaning & weight' },
    { key: 'plot',     left: 'Plot-driven',     right: 'Mood & atmosphere',  lp: 'plot',            rp: 'mood & atmosphere',  label: 'Plot-driven ↔ Mood & atmosphere' },
    { key: 'era',      left: 'Of our moment',   right: 'From the vault',     lp: 'our moment',      rp: 'the vault',          label: 'Of our moment ↔ From the vault' },
    { key: 'style',    left: 'Grounded & real', right: 'Stylised & formal',  lp: 'grounded & real', rp: 'stylised & formal',  label: 'Grounded ↔ Stylised' }
];

const AVOID = ['Graphic violence', 'Sexual violence', 'Horror', 'Bleak / no hope', 'Sentimentality', 'Hollywood blockbusters', 'Over three hours', 'Musicals', 'Animation', 'Shaky cam', 'Heavy gore', 'Jump scares'];

const LEASH = ['Read between the lines', 'A balance', 'Stick to my answers'];
const LEASH_BRIEF = {
    'Read between the lines': '**Read between the lines.** Treat everything below as atmosphere and direction, not instructions. Lean on your own taste, weigh the overall mood above any single answer, and feel free to surprise them — a great unexpected pick beats a literal one.',
    'A balance': '**Strike a balance.** Honour the spirit of their answers, but let your own judgement break ties and fill the gaps. Overall mood first, the particulars second.',
    'Stick to my answers': '**Stay close to the brief.** Follow their stated leanings fairly closely — while still recommending only films you would genuinely stand behind.'
};

/* ═══════════════ DATA · THE PRINT SYSTEM ═══════════════
   Every brief is a numbered print: it draws a curator and a
   house rule at random. Same answers, different print, different
   films — which is the point. LLMs fall into gravity wells;
   the print system keeps kicking them out. */

const CURATORS = [
    'You are the head programmer of a beloved repertory cinema — you think in double bills, you know exactly what a Tuesday-night audience can take, and you have never once said the word "content". You recommend like a trusted friend with a long memory, not an algorithm.',
    'You are the lifer behind the counter of the last great video shop. You remember what people rented, you notice what they bring back early, and your hand-sells are famous within four postcodes. You recommend like a trusted friend, not an algorithm.',
    'You are the artistic director of a small, fearless film festival. Your reach is properly global, your loyalty is to the film rather than the discourse, and you take real pleasure in handing someone the exact film nobody else would have thought to.',
    'You are a film critic who stopped publishing the day it stopped being fun — which only sharpened your taste. You are allergic to consensus picks and to the ten films every list reaches for, but you would never sacrifice the right film just to be contrary.',
    'You are an old projectionist who has watched more films through a small square window than most critics see in a lifetime. You trust light, faces, sound and rooms more than you trust synopses, and you recommend accordingly.',
    'You are the filmmaker other filmmakers ask for recommendations — generous, unsnobbish, with a working knowledge of six national cinemas and a soft spot for the nearly-great. You recommend like a trusted friend, not an algorithm.'
];

const HOUSE_RULES = [
    'At least one of the five must be from before 1975.',
    'At least one of the five must run under 95 minutes.',
    'At least one of the five must come from a national cinema this brief never mentions.',
    'At least one of the five must be directed by a woman.',
    'At least one of the five must be a comedy — however dark — even if nothing in the brief asks for one.',
    'At least one of the five must work almost entirely in images — a film with barely a line worth quoting.',
    'At least one of the five must be a documentary, or something that lives next door to one.',
    'At least one of the five must be a first or second feature.',
    'At least one of the five must be in a language other than English.',
    'At least one of the five should be a film you suspect even a well-read cinephile has never heard of.'
];

const CLUB_CURATORS = [
    'You are the artistic director of a small festival, moonlighting as this club\'s programmer — global reach, an eye for the film that turns a room of strangers into a room of friends, and no patience for seasons that are merely lists.',
    'You are a veteran cinematheque programmer. You believe a season is an argument made over several weeks, that running order is half the art, and that the film after the interval matters more than the opening night.',
    'You are the president of a legendary university film society, decades in. You have watched a hundred rooms fall in love with cinema and you know precisely which film does it — and which well-meaning masterpiece empties the room by week three.'
];

const CLUB_HOUSE_RULES = [
    'One night of the season must be a film you suspect nobody on the committee has seen.',
    'One night must run under 90 minutes — for the tired week.',
    'The season must touch at least three continents.',
    'At least one night must be directed by a woman, and not the one everyone programmes.',
    'One night must be pure pleasure — no homework, no vegetables, just a great time at the movies.',
    'At least one night must be older than everyone in the room.'
];

/* Club chips */
const CLUB_SIZE = ['A handful (under 10)', 'A room (10–30)', 'A crowd (30–80)', 'A cinema (80+)'];
const CLUB_RANGE = ['Mostly newcomers', 'Properly mixed', 'Mostly seasoned', 'Wildly uneven'];
const CLUB_AGE = ['Brand new', 'A season or two old', 'Years in', 'An institution'];
const CLUB_COUNT = ['4 films', '6 films', '8 films', '10 films', '12 films'];
const CLUB_CADENCE = ['Weekly', 'Fortnightly', 'Monthly'];
const CLUB_FORMAT = ['Projected — disc or file', 'A TV and a sofa', 'A real cinema, sometimes real prints', 'Online / remote together'];
const CLUB_TALK = ['We talk after, properly', 'A few minutes of chat', 'We mostly just watch'];
const CLUB_MISSION = ['Make newcomers fall for cinema', 'Stretch the regulars', 'Start arguments', 'Build warmth & community', 'Map a blind spot we share', 'Show what only cinema can do', 'Ride one theme into the ground'];
const CLUB_LIMITS = ['Nothing over 2½ hours', 'Must be easy to source / stream', 'Mixed ages — certification matters', 'Subtitle-shy audience, use them sparingly', 'Nothing too graphic for a public room', 'Tiny budget — cheap licences only'];
const CLUB_THREAD = ['A single director', 'A national cinema', 'A decade', 'A formal idea (long takes, ensembles…)', 'A secret thread — let them discover it', 'Pairs & double bills', 'No theme — just great nights'];
const CLUB_LEASH = ['Read between the lines', 'A balance', 'Stick to my answers'];

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
    const pool = arr.slice();
    const out = [];
    while (out.length < n && pool.length) out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
    return out;
}
function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }
function printNo(seed) { return (seed >>> 16).toString(16).toUpperCase().padStart(4, '0'); }

/* ═══════════════ STATE ═══════════════ */

const DEFAULT_STATE = {
    mode: 'evening',
    deckSeed: 0,     // deals the projective deck & the calibration hand — stable per session
    printSeed: 0,    // draws the curator & house rule — re-rolled by "strike another print"
    evening: {
        occasion: '',
        affectV: null, affectA: null, trajectory: '',
        moods: [], energy: 50,
        proximity: 50, darkness: 50, endings: '',
        lastFilm: '', lastDir: '', bounced: '',
        still: '', textures: [],
        runtime: '', company: '', subtitles: 'ok', services: [],
        depth: '', seen: [],
        loved: '', cinemas: [],
        dials: { familiar: 50, meaning: 50, plot: 50, era: 50, style: 50 },
        leash: 'Read between the lines', avoid: [], note: ''
    },
    club: {
        name: '', size: '', range: '', age: '',
        count: '', cadence: '', format: '', talk: '',
        mission: [], pitch: 50,
        shown: '', flopped: '',
        canon: 50, dark: 50, limits: [],
        thread: [], threadNote: '',
        leash: 'Read between the lines', note: ''
    }
};

let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
const SAVE_KEY = 'cinefilematic.v4';

function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {} }
function load() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (raw) {
            const saved = JSON.parse(raw);
            state = JSON.parse(JSON.stringify(DEFAULT_STATE));
            state.mode = saved.mode || 'evening';
            state.deckSeed = saved.deckSeed || 0;
            state.printSeed = saved.printSeed || 0;
            Object.assign(state.evening, saved.evening || {});
            state.evening.dials = Object.assign({}, DEFAULT_STATE.evening.dials, (saved.evening || {}).dials || {});
            Object.assign(state.club, saved.club || {});
        }
    } catch (e) {}
    if (!state.deckSeed) state.deckSeed = randomSeed();
    if (!state.printSeed) state.printSeed = randomSeed();
}

/* Path helpers — keys like "evening.moods" */
function getPath(path) { return path.split('.').reduce((o, k) => (o == null ? o : o[k]), state); }
function setPath(path, val) {
    const keys = path.split('.');
    const last = keys.pop();
    const obj = keys.reduce((o, k) => o[k], state);
    obj[last] = val;
}

/* ═══════════════ BUILD CONTROLS ═══════════════ */

const $ = id => document.getElementById(id);
function esc(s) { return String(s).replace(/"/g, '&quot;'); }

function buildChips(id, arr) {
    $(id).innerHTML = arr.map(v => `<button class="chip" data-val="${esc(v)}" aria-pressed="false">${v}</button>`).join('');
}
function buildMoods() {
    $('moods').innerHTML = MOODS.map(m =>
        `<button class="mood-card" data-val="${esc(m.word)}" aria-pressed="false">
            <span class="mood-word">${m.word}</span><span class="mood-gloss">${m.gloss}</span>
        </button>`).join('');
}
function buildTrajectories() {
    $('trajectory').innerHTML = TRAJECTORIES.map(t =>
        `<button class="chip" data-val="${esc(t.word)}" aria-pressed="false">${t.word}</button>`).join('');
}
function buildDepth() {
    $('depth').innerHTML = DEPTH.map(d =>
        `<button class="option" data-val="${esc(d.val)}" aria-pressed="false">
            <span class="option-title">${d.title}</span><span class="option-gloss">${d.gloss}</span>
        </button>`).join('');
}
function buildStills() {
    const rng = mulberry32(state.deckSeed);
    const hand = sample(STILLS_POOL, STILLS_PER_PRINT, rng);
    // Keep a chosen still on the table even if the deal changes under it.
    if (state.evening.still && !hand.includes(state.evening.still)) hand[hand.length - 1] = state.evening.still;
    $('stills').innerHTML = hand.map(s => `<button class="still" data-val="${esc(s)}" aria-pressed="false">${s}</button>`).join('');
}
function buildSeen() {
    const rng = mulberry32(state.deckSeed ^ 0x5EED);
    const hand = [
        ...sample(SEEN_POOL.near, SEEN_PER_TIER, rng),
        ...sample(SEEN_POOL.mid, SEEN_PER_TIER, rng),
        ...sample(SEEN_POOL.far, SEEN_PER_TIER, rng)
    ];
    $('seen').innerHTML = hand.map(f => {
        const val = `${f.title} (${f.meta.replace(' · ', ', ')})`;
        return `<button class="seen-item" data-val="${esc(val)}" aria-pressed="false">
            <span class="seen-box"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>
            <span class="seen-text"><span class="seen-title">${f.title}</span><span class="seen-meta">${f.meta}</span></span>
        </button>`;
    }).join('');
}
function buildDials() {
    $('dials').innerHTML = DIALS.map(d =>
        `<div class="dial">
            <div class="dial-ends"><span class="l">${d.left}</span><span class="r">${d.right}</span></div>
            <input type="range" data-path="evening.dials.${d.key}" min="0" max="100" value="50" aria-label="${d.label}">
            <div class="dial-phrase" id="phrase-${d.key}"></div>
        </div>`).join('');
}
function buildFigures() {
    document.querySelectorAll('.screen.step').forEach(s => {
        const fig = document.createElement('span');
        fig.className = 'step-fig'; fig.setAttribute('aria-hidden', 'true');
        fig.textContent = s.getAttribute('data-fig') || '';
        s.insertBefore(fig, s.firstChild);
    });
}

/* ═══════════════ SELECT LOGIC ═══════════════ */

function wireGroups() {
    document.querySelectorAll('[data-group]').forEach(group => {
        group.addEventListener('click', e => {
            const btn = e.target.closest('[data-val]');
            if (!btn) return;
            toggleVal(group, btn.dataset.val);
        });
    });
}
function toggleVal(group, val) {
    const key = group.dataset.key, mode = group.dataset.select, max = +(group.dataset.max || 0);
    if (mode === 'single') {
        setPath(key, getPath(key) === val ? '' : val);
    } else {
        let arr = Array.isArray(getPath(key)) ? getPath(key).slice() : [];
        if (arr.includes(val)) arr = arr.filter(x => x !== val);
        else { if (max && arr.length >= max) arr.shift(); arr.push(val); }
        setPath(key, arr);
    }
    renderGroup(group); save();
}
function renderGroup(group) {
    const key = group.dataset.key, mode = group.dataset.select;
    const cur = getPath(key);
    group.querySelectorAll('[data-val]').forEach(btn => {
        const on = mode === 'single' ? cur === btn.dataset.val : (cur || []).includes(btn.dataset.val);
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on);
    });
}

/* ═══════════════ THE AFFECT PAD ═══════════════
   Two axes people can actually feel: charge (drained ↔ wired)
   and weather (heavy ↔ light). Tap to place; arrows to nudge. */

const CHARGE_WORDS = ['running on empty', 'low', 'steady', 'restless', 'wired'];
const WEATHER_WORDS = ['heavy skies', 'overcast', 'even-keeled', 'light', 'bright'];

function band5(v) { return v < 20 ? 0 : v < 40 ? 1 : v < 60 ? 2 : v < 80 ? 3 : 4; }
function affectPhrase(a, v) {
    if (a == null || v == null) return null;
    return `${CHARGE_WORDS[band5(a)]}, ${WEATHER_WORDS[band5(v)]}`;
}

function renderPad() {
    const dot = $('padDot'), phrase = $('padPhrase');
    const { affectV: v, affectA: a } = state.evening;
    if (v == null || a == null) {
        dot.classList.remove('placed');
        phrase.textContent = '';
        return;
    }
    dot.classList.add('placed');
    dot.style.left = v + '%';
    dot.style.top = (100 - a) + '%';
    phrase.textContent = 'Arriving ' + affectPhrase(a, v);
}

function wirePad() {
    const pad = $('pad');
    function place(clientX, clientY) {
        const r = pad.getBoundingClientRect();
        const v = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
        const a = Math.min(100, Math.max(0, 100 - ((clientY - r.top) / r.height) * 100));
        state.evening.affectV = Math.round(v);
        state.evening.affectA = Math.round(a);
        renderPad(); save();
    }
    let dragging = false;
    pad.addEventListener('pointerdown', e => { dragging = true; pad.setPointerCapture(e.pointerId); place(e.clientX, e.clientY); });
    pad.addEventListener('pointermove', e => { if (dragging) place(e.clientX, e.clientY); });
    pad.addEventListener('pointerup', () => { dragging = false; });
    pad.addEventListener('keydown', e => {
        const step = e.shiftKey ? 10 : 4;
        let { affectV: v, affectA: a } = state.evening;
        if (v == null) { v = 50; a = 50; }
        if (e.key === 'ArrowLeft') v -= step;
        else if (e.key === 'ArrowRight') v += step;
        else if (e.key === 'ArrowUp') a += step;
        else if (e.key === 'ArrowDown') a -= step;
        else return;
        e.preventDefault();
        state.evening.affectV = Math.min(100, Math.max(0, v));
        state.evening.affectA = Math.min(100, Math.max(0, a));
        renderPad(); save();
    });
    $('padClear').addEventListener('click', () => {
        state.evening.affectV = null; state.evening.affectA = null;
        renderPad(); save();
    });
}

/* ═══════════════ DIAL PHRASING (words, not numbers) ═══════════════ */

function dialPhrase(v, left, right) {
    const d = Math.abs(v - 50);
    if (d <= 6) return 'balanced';
    const toward = v > 55 ? right : left;
    const intensity = d <= 18 ? 'leans toward' : d <= 34 ? 'toward' : 'strongly toward';
    return `${intensity} ${toward}`;
}

const PHRASED_DIALS = [
    { id: 'phrase-energy',    path: 'evening.energy',    l: 'being held (easy to fall into)',     r: 'being challenged (they will lean in)' },
    { id: 'phrase-proximity', path: 'evening.proximity', l: 'a safe distance',                    r: 'cutting close to the bone' },
    { id: 'phrase-darkness',  path: 'evening.darkness',  l: 'keeping a floor underfoot',          r: 'no floor at all' },
    { id: 'phrase-clubPitch', path: 'club.pitch',        l: 'keeping the room full',              r: 'trusting the room' },
    { id: 'phrase-clubCanon', path: 'club.canon',        l: 'the loved & the legible',            r: 'the far shelves' },
    { id: 'phrase-clubDark',  path: 'club.dark',         l: 'going home warm',                    r: 'going home shaken' }
];

function updateDialPhrases() {
    PHRASED_DIALS.forEach(p => { const el = $(p.id); if (el) el.textContent = dialPhrase(getPath(p.path), p.l, p.r); });
    DIALS.forEach(d => { const el = $('phrase-' + d.key); if (el) el.textContent = dialPhrase(state.evening.dials[d.key], d.lp, d.rp); });
}

/* ═══════════════ TEXT INPUT WIRING ═══════════════ */

const TEXT_FIELDS = [
    ['lastFilm', 'evening.lastFilm'], ['bounced', 'evening.bounced'],
    ['loved', 'evening.loved'], ['note', 'evening.note'],
    ['clubName', 'club.name'], ['clubShown', 'club.shown'], ['clubFlopped', 'club.flopped'],
    ['clubThreadNote', 'club.threadNote'], ['clubNote', 'club.note']
];

function wireInputs() {
    document.querySelectorAll('input[type="range"][data-path]').forEach(el => {
        el.addEventListener('input', e => { setPath(el.dataset.path, +e.target.value); updateDialPhrases(); save(); });
    });
    $('subtitles').addEventListener('change', e => {
        state.evening.subtitles = e.target.checked ? 'ok' : 'no';
        $('subText').textContent = e.target.checked ? 'Happy to read tonight' : 'Prefer none tonight';
        save();
    });
    TEXT_FIELDS.forEach(([id, path]) => {
        $(id).addEventListener('input', e => { setPath(path, e.target.value); save(); });
    });
}

/* ═══════════════ RENDER FROM STATE ═══════════════ */

function renderFromState() {
    document.querySelectorAll('[data-group]').forEach(renderGroup);
    document.querySelectorAll('input[type="range"][data-path]').forEach(el => { el.value = getPath(el.dataset.path); });
    $('subtitles').checked = state.evening.subtitles !== 'no';
    $('subText').textContent = state.evening.subtitles === 'no' ? 'Prefer none tonight' : 'Happy to read tonight';
    TEXT_FIELDS.forEach(([id, path]) => { $(id).value = getPath(path) || ''; });
    renderPad();
    updateDialPhrases();
}

/* ═══════════════ NAVIGATION · TWO TRACKS ═══════════════ */

const FLOWS = {
    evening: ['scr-cover', 'scr-e1', 'scr-e2', 'scr-e3', 'scr-e4', 'scr-e5', 'scr-e6', 'scr-e7', 'scr-e8', 'scr-e9', 'scr-e10', 'scr-out'],
    club:    ['scr-cover', 'scr-c1', 'scr-c2', 'scr-c3', 'scr-c4', 'scr-c5', 'scr-c6', 'scr-c7', 'scr-out']
};

let screenIdx = 0;

function flow() { return FLOWS[state.mode] || FLOWS.evening; }
function lastStepIdx() { return flow().length - 2; }

function showScreen(idx) {
    const f = flow();
    screenIdx = Math.min(Math.max(idx, 0), f.length - 1);
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(f[screenIdx]).classList.add('active');

    const onStep = screenIdx >= 1 && screenIdx <= lastStepIdx();
    $('nav').classList.toggle('show', onStep);
    $('navNext').innerHTML = screenIdx === lastStepIdx()
        ? 'Compose the brief <svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>'
        : 'Continue <svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>';

    const steps = lastStepIdx();
    const pct = screenIdx === 0 ? 0 : screenIdx > steps ? 100 : (screenIdx / steps) * 100;
    $('bar').style.width = pct + '%';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function next() {
    if (screenIdx === lastStepIdx()) { compose(); showScreen(screenIdx + 1); }
    else showScreen(screenIdx + 1);
}
function back() { if (screenIdx >= 1) showScreen(screenIdx - 1); }
function startMode(mode) {
    state.mode = mode; save();
    showScreen(1);
}

/* ═══════════════ THE BRIEF · AN EVENING ═══════════════ */

function bq(t) { return t.trim().split(/\n/).map(l => '> ' + l).join('\n'); }

function buildEveningMarkdown() {
    const e = state.evening;
    const rng = mulberry32(state.printSeed);
    const curator = pick(CURATORS, rng);
    const houseRule = pick(HOUSE_RULES, rng);
    const no = printNo(state.printSeed);
    const L = [];
    const p = s => L.push(s);

    p(`# Cinefilematic — a brief for tonight`); p('');
    p(`*Print № ${no} · struck ${new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}*`); p('');
    p(`*Paste this whole file into the LLM of your choice — Claude, ChatGPT, Gemini, whichever. It carries its own instructions; just send it, and ask for five.*`); p('');
    p('---'); p('');
    p(`## For the curator`); p('');
    p(curator); p('');
    p(`Read the whole brief before choosing anything, and form a single impression of the person and the evening — the way a friend would across a table, not a checklist. Then choose **exactly five films** for tonight, plus one clearly-marked wildcard.`); p('');
    p(`**Open with a reading, not a list.** Begin your reply with one italic sentence — your interpretation of the evening (*“Tonight reads like…”*). Not a summary of their answers; a reading of them. If you've got them wrong, that sentence is what lets them correct you, and it is worth more than a sixth film.`); p('');
    p(`**Set aside the obvious ten.** Before choosing, privately note the ten titles that surfaced first as you read this. Those are everyone's ten — the gravity well that every brief like this falls into. At most one of your five may come from that list, and only if it truly is the film for this evening rather than the most available answer.`); p('');
    p(`**Hold the contradictions.** Where the brief pulls in two directions, that is deliberate — a person who asks for comfort and dread in the same breath isn't confused, they're describing a register. Don't average the tension away. Choose films that hold both ends, or split the slate and say so.`); p('');
    p(`**Favour the collectively personal.** The films worth handing to a stranger were made from someone's particular life, yet abstracted just enough to land in anyone's chest — neither diary nor greeting card. When you are torn between two films, choose the one that came from somewhere, and say where.`); p('');
    p(`**Choose for the after.** A film's worth isn't confined to its runtime — it is the walk to bed afterwards, who they fall asleep thinking of, whether they dream more. Pain and sadness count fully as entertainment here when they are the enjoyable kind. Pick for the whole night, not the two hours.`); p('');
    p(`**Hard and soft.** Only a few things here are hard: runtime, who's watching, subtitles, the avoid list, and never recommending anything marked as already seen. Everything else — moods, dials, leanings — is weather, not law.`); p('');
    p(`**Calibrate the reach** to their depth and what they've already seen. For a seasoned viewer, skip the obvious entry points and reach for the lesser-seen; for a lighter one, stay legible. Never condescend in either direction.`); p('');
    p(`**Be decisive.** They have already scrolled the library for forty minutes. Five confident films, not forty hedged ones — spread across era, country and register.`); p('');
    p(`For each of the five:`); p('');
    p(`> **Title** — Director, Year, Country · runtime  `);
    p(`> Two or three sentences: what it is, and why it suits *this* evening — with one concrete, sensory reason to trust it: an image, a sound, a scene. Not an adjective.  `);
    p(`> One line of provenance — where the film came from: who made it, out of what, against what. The story that colours its un-smoothed edges, or smooths its chaotic ones.  `);
    p(`> *Where to find it*, if you can.`); p('');
    p(`Then the **wildcard** — stranger, riskier, clearly marked, with one sentence on what it would take to love it.`); p('');
    p(`**And if no film fits, say so.** Some evenings read like a night for one short film, a single scene revisited, an album, or simply an early sleep. If this is one of them, say it in a line — and leave one short film as a parting gift. That honesty is part of the job.`); p('');
    p(`**House rule for this print:** ${houseRule}`); p('');
    p(`Write with precision and restraint. Assume an intelligent viewer. No hype, no spoilers, no emojis, no exclamation marks.`); p('');
    p('---'); p('');
    p(`## The brief`); p('');
    p(`**How to read it —** ${LEASH_BRIEF[e.leash] || LEASH_BRIEF['A balance']}`); p('');

    if (e.occasion) { p(`**The occasion:** ${e.occasion}`); p(''); }

    const arr = [];
    const ap = affectPhrase(e.affectA, e.affectV);
    if (ap) arr.push(`- Arriving: ${ap}`);
    const traj = TRAJECTORIES.find(t => t.word === e.trajectory);
    if (traj) arr.push(`- What the film should do with that: ${traj.brief}`);
    if (arr.length) {
        p(`**The state of them** *(where they are, and where the film should take them — weigh this heavily)*`);
        p(arr.join('\n')); p('');
    }

    p(`**The feeling they're after** *(the key to play in — lean into it, don't over-fit)*`);
    const feel = [];
    feel.push(`- Wants to be left with: ${e.moods.length ? e.moods.join(' · ') : 'open — surprise them'}`);
    feel.push(`- How much it should ask of them: ${dialPhrase(e.energy, 'being held (easy to fall into)', 'being challenged (they will lean in)')}`);
    p(feel.join('\n')); p('');

    p(`**The nerve, tonight** *(tolerance is a nightly setting, not a personality — read it as tonight's, only)*`);
    const nerve = [];
    nerve.push(`- Emotional distance: ${dialPhrase(e.proximity, 'a safe distance', 'the bone — it may cut close')}`);
    nerve.push(`- Darkness: ${dialPhrase(e.darkness, 'a floor kept underfoot', 'no floor at all')}`);
    if (e.endings) nerve.push(`- Endings: ${ENDINGS_BRIEF[e.endings] || e.endings}`);
    p(nerve.join('\n')); p('');

    const anch = [];
    if (e.lastFilm.trim()) {
        const am = { 'Give me its cousin': ' — leaning toward something in its register', 'Give me a contrast': ' — leaning toward a deliberate contrast', 'No strong feeling — surprise me': ' — no strong pull, open to surprise' };
        anch.push(`- Recently struck by: ${e.lastFilm.trim()}${e.lastDir ? (am[e.lastDir] || '') : ''}`);
    }
    if (e.bounced.trim()) anch.push(`- Recently bounced off: ${e.bounced.trim()} *(read this miss as carefully as the loves — it marks a boundary)*`);
    if (anch.length) { p(`**Anchors**`); p(anch.join('\n')); p(''); }

    const reel = [];
    if (e.still) reel.push(`- The image that pulled at them, chosen blind from a dealt deck: *“${e.still}”*`);
    if (e.textures.length) reel.push(`- Textures: ${e.textures.join(' · ')}`);
    if (reel.length) {
        p(`**The pull** *(instinct, not instruction — match its temperature, not its literal contents)*`);
        p(reel.join('\n')); p('');
    }

    p(`**Tonight's leanings** *(soft dials, not targets)*`);
    p(DIALS.map(d => `- ${d.label}: ${dialPhrase(e.dials[d.key], d.lp, d.rp)}`).join('\n')); p('');

    p(`**The room**`);
    const ev = [];
    if (e.runtime) ev.push(`- Runtime — ${e.runtime}`);
    if (e.company) ev.push(`- Watching — ${e.company}`);
    ev.push(`- Subtitles — ${e.subtitles === 'no' ? 'prefers none tonight' : 'happy to read'}`);
    if (e.services.length) ev.push(`- Can watch on — ${e.services.join(', ')}`);
    p(ev.join('\n')); p('');

    p(`**Range & taste**`);
    const rt = [];
    rt.push(`- Depth — ${e.depth || 'unspecified'}`);
    if (e.seen.length) rt.push(`- From a dealt calibration hand, has seen *(do not recommend these)* — ${e.seen.join('; ')}`);
    if (e.cinemas.length) rt.push(`- Drawn to — ${e.cinemas.join(', ')}`);
    p(rt.join('\n')); p('');
    if (e.loved.trim()) { p(`Films & directors they love:`); p(''); p(bq(e.loved)); p(''); }

    if (e.avoid.length || e.seen.length) {
        p(`**Hard limits** *(honour these exactly)*`);
        const hl = [];
        if (e.avoid.length) hl.push(`- Avoid — ${e.avoid.join('; ')}`);
        if (e.seen.length) hl.push(`- Recommend nothing from the “already seen” list above.`);
        p(hl.join('\n')); p('');
    }

    if (e.note.trim()) { p(`**A note from the viewer** *(weigh this above everything else on the page)*`); p(''); p(bq(e.note)); p(''); }

    p('---'); p('');
    p(`*Composed with Cinefilematic — answered by hand, on their machine. Print № ${no}: a different print of the same answers would draw a different curator and house rule, and should return different films.*`);
    return L.join('\n');
}

/* ═══════════════ THE BRIEF · A SEASON ═══════════════ */

function buildClubMarkdown() {
    const c = state.club;
    const rng = mulberry32(state.printSeed);
    const curator = pick(CLUB_CURATORS, rng);
    const houseRule = pick(CLUB_HOUSE_RULES, rng);
    const no = printNo(state.printSeed);
    const count = c.count || '6 films';
    const name = c.name.trim() || 'the club';
    const L = [];
    const p = s => L.push(s);

    p(`# Cinefilematic — a season brief`); p('');
    p(`*Print № ${no} · struck ${new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}*`); p('');
    p(`*Paste this whole file into the LLM of your choice. It carries its own instructions; just send it, and ask for the season.*`); p('');
    p('---'); p('');
    p(`## For the programmer`); p('');
    p(curator); p('');
    p(`You are programming a **season of ${count}** for **${name}**${c.cadence ? ` — ${c.cadence.toLowerCase()}` : ''}${c.format ? `, ${c.format.toLowerCase()}` : ''}. Read the whole brief first and form an impression of the room: who comes, what they can take, what they secretly want. A season is an argument made over several weeks — make this one mean something.`); p('');
    p(`**What to return:**`); p('');
    p(`- **A season title** and a one-line pitch that would look right on a poster.`);
    p(`- **The films, in screening order.** The order is half the art: an opening night that earns the room's trust, the boldest swing somewhere in the middle when trust is banked, a closer that sends them out talking. Say, briefly, why the sequence runs the way it does.`);
    p(`- For each film:`);
    p(`  > **Title** — Director, Year, Country · runtime  `);
    p(`  > A programme note of three or four sentences — what it is, why this room, why this slot — carrying one line of provenance: where the film came from, who made it, out of what, against what. A room falls harder for a film when it knows. Written to be read aloud before the lights go down. No spoilers.  `);
    p(`  > **Three discussion questions** that start arguments, not summaries — questions a smart first-timer can enter and a lifer can't easily exit.  `);
    p(`  > **An understudy** — one alternate in the same spirit, in case the film proves hard to source.`);
    p(`- Close with a single line on what the season adds up to — the thing you'd say to the room after the last credits.`); p('');
    p(`**Set aside the obvious.** Before choosing, privately list the ten films every film club season reaches for — the consensus crowd-pleasers and the syllabus warhorses. At most one of them may survive into this season, and only on merit.`); p('');
    p(`**Favour the collectively personal.** A room of strangers becomes a room of friends over films made from someone's particular life yet abstracted enough to land in every chest in the row — neither diary nor greeting card. When torn between two films, choose the one that came from somewhere, and let the note say where.`); p('');
    p(`**Respect the room's hard limits exactly** — they are listed below. Everything else is appetite, not law.`); p('');
    p(`**Spread the season** across era, country and register. At least one night nobody in the room will have seen coming, and at least one that sends them home simply glad they came.`); p('');
    p(`**House rule for this print:** ${houseRule}`); p('');
    p(`Write with precision and warmth. Assume an intelligent room. No hype, no spoilers, no emojis, no exclamation marks.`); p('');
    p('---'); p('');
    p(`## The club`); p('');
    p(`**How to read it —** ${LEASH_BRIEF[c.leash] || LEASH_BRIEF['A balance']}`); p('');

    p(`**The room**`);
    const room = [];
    if (c.name.trim()) room.push(`- The club — ${c.name.trim()}`);
    if (c.size) room.push(`- Turnout — ${c.size}`);
    if (c.range) room.push(`- Experience in the room — ${c.range}`);
    if (c.age) room.push(`- The club is — ${c.age.toLowerCase()}`);
    if (c.talk) room.push(`- After the credits — ${c.talk.toLowerCase()}`);
    p(room.length ? room.join('\n') : '- Unspecified — assume a mixed, curious room.'); p('');

    p(`**The season's shape**`);
    const shape = [];
    shape.push(`- Length — ${count}`);
    if (c.cadence) shape.push(`- Cadence — ${c.cadence.toLowerCase()}`);
    if (c.format) shape.push(`- Screen — ${c.format.toLowerCase()}`);
    p(shape.join('\n')); p('');

    p(`**The mission** *(what the season is for)*`);
    const mis = [];
    mis.push(`- Goals — ${c.mission.length ? c.mission.join('; ') : 'open — propose the season they need'}`);
    mis.push(`- Pitch — ${dialPhrase(c.pitch, 'crowd-pleasing, keep the room full', 'demanding, trust the room')}`);
    p(mis.join('\n')); p('');

    p(`**Appetite**`);
    const app = [];
    app.push(`- Distance from the canon — ${dialPhrase(c.canon, 'the loved & the legible', 'the far shelves')}`);
    app.push(`- How dark a night may go — ${dialPhrase(c.dark, 'send them home warm', 'send them home shaken')}`);
    p(app.join('\n')); p('');

    if (c.shown.trim()) { p(`**Recent screenings that landed:**`); p(''); p(bq(c.shown)); p(''); }
    if (c.flopped.trim()) { p(`**What flopped** *(read this as carefully as the hits — it marks the room's real edges)*:`); p(''); p(bq(c.flopped)); p(''); }

    const th = [];
    if (c.thread.length && !c.thread.includes('No theme — just great nights')) th.push(`- Drawn to — ${c.thread.join('; ')}`);
    if (c.thread.includes('No theme — just great nights')) th.push(`- No theme wanted — just great nights, sequenced well`);
    if (c.threadNote.trim()) th.push(`- In their own words *(this outranks the chips)* — ${c.threadNote.trim()}`);
    if (th.length) { p(`**The thread**`); p(th.join('\n')); p(''); }

    if (c.limits.length) { p(`**Hard limits** *(honour these exactly)*`); p(c.limits.map(l => `- ${l}`).join('\n')); p(''); }

    if (c.note.trim()) { p(`**A note from the committee** *(weigh this above everything else on the page)*`); p(''); p(bq(c.note)); p(''); }

    p('---'); p('');
    p(`*Composed with Cinefilematic — answered by hand, on their machine. Print № ${no}: the same answers on a different print would draw a different programmer and house rule, and should return a different season.*`);
    return L.join('\n');
}

/* ═══════════════ THE PORTRAIT ═══════════════ */

function buildPortrait() {
    if (state.mode === 'club') {
        const c = state.club;
        const bits = [];
        bits.push(`A ${(c.count || '6 films').replace(' films', '-film')} season for ${c.name.trim() || 'the club'}`);
        if (c.range) bits.push(c.range.toLowerCase());
        if (c.mission.length) bits.push(c.mission[0].toLowerCase());
        return bits.join(' · ') + '.';
    }
    const e = state.evening;
    const bits = [];
    const ap = affectPhrase(e.affectA, e.affectV);
    if (ap) bits.push(`arriving ${ap}`);
    if (e.moods.length) bits.push(`after ${e.moods.map(m => m.toLowerCase()).join(' and ')}`);
    if (e.occasion) bits.push(e.occasion.toLowerCase());
    if (e.company) bits.push(e.company.toLowerCase());
    if (!bits.length) return 'An open brief — the curator gets a free hand tonight.';
    return 'Tonight: ' + bits.join(' · ') + '.';
}

/* ═══════════════ TINY MARKDOWN RENDERER ═══════════════
   Just enough for our own briefs — not a general renderer. */

function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function inlineMd(s) {
    return s
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
function renderMd(md) {
    const lines = md.split('\n');
    const out = [];
    let list = false, quote = [];
    const flushQuote = () => {
        if (quote.length) { out.push('<blockquote>' + quote.map(q => '<p>' + inlineMd(q) + '</p>').join('') + '</blockquote>'); quote = []; }
    };
    const flushList = () => { if (list) { out.push('</ul>'); list = false; } };
    for (const raw of lines) {
        const line = escapeHtml(raw);
        const t = line.trim();
        if (t.startsWith('&gt;')) { flushList(); quote.push(t.replace(/^&gt;\s?/, '')); continue; }
        flushQuote();
        if (t === '---') { flushList(); out.push('<hr>'); continue; }
        if (t.startsWith('# ')) { flushList(); out.push('<h1>' + inlineMd(t.slice(2)) + '</h1>'); continue; }
        if (t.startsWith('## ')) { flushList(); out.push('<h2>' + inlineMd(t.slice(3)) + '</h2>'); continue; }
        if (t.startsWith('- ')) { if (!list) { out.push('<ul>'); list = true; } out.push('<li>' + inlineMd(t.slice(2)) + '</li>'); continue; }
        flushList();
        if (t === '') continue;
        out.push('<p>' + inlineMd(t) + '</p>');
    }
    flushList(); flushQuote();
    return out.join('\n');
}

/* ═══════════════ COMPOSE & OUTPUT ═══════════════ */

let composed = '';

function compose() {
    composed = state.mode === 'club' ? buildClubMarkdown() : buildEveningMarkdown();
    $('outTitle').textContent = state.mode === 'club' ? 'Your season brief is ready.' : 'Your brief is ready.';
    $('printNo').textContent = '№ ' + printNo(state.printSeed);
    $('printDate').textContent = 'struck ' + new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
    $('portrait').textContent = buildPortrait();
    $('mdPreview').textContent = composed;
    $('mdReading').innerHTML = renderMd(composed);
}

function reroll() {
    state.printSeed = randomSeed(); save();
    compose();
    toast('New print struck — same answers, different house rules');
}

function download() {
    const blob = new Blob([composed], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (state.mode === 'club' ? 'cinefilematic-season-' : 'cinefilematic-brief-') + printNo(state.printSeed).toLowerCase() + '.md';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast('Brief downloaded');
}
async function copy() {
    try { await navigator.clipboard.writeText(composed); }
    catch (e) {
        const ta = document.createElement('textarea');
        ta.value = composed; ta.style.position = 'fixed'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    }
    toast('Copied to clipboard');
}
let toastTimer;
function toast(msg) {
    const t = $('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}
function setTab(which) {
    const reading = which === 'reading';
    $('tabReading').classList.toggle('active', reading);
    $('tabSource').classList.toggle('active', !reading);
    $('mdReading').style.display = reading ? '' : 'none';
    $('mdSource').style.display = reading ? 'none' : '';
}

/* ═══════════════ THEME ═══════════════ */

(function () {
    const html = document.documentElement;
    function initial() {
        const s = localStorage.getItem('theme');
        if (s === 'dark') return 'dark';
        if (s === 'light') return 'light';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    function apply(t) { t === 'dark' ? html.setAttribute('data-theme', 'dark') : html.removeAttribute('data-theme'); }
    apply(initial());
    document.addEventListener('DOMContentLoaded', () => {
        $('themeToggle').addEventListener('click', () => {
            const dark = html.getAttribute('data-theme') === 'dark';
            const t = dark ? 'light' : 'dark';
            apply(t); localStorage.setItem('theme', t);
        });
    });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) apply(e.matches ? 'dark' : 'light');
    });
})();

/* ═══════════════ INIT ═══════════════ */

function init() {
    load();

    // Static groups
    buildChips('occasion', OCCASION);
    buildTrajectories();
    buildMoods();
    buildChips('endings', ENDINGS);
    buildChips('lastDir', LAST_DIR);
    buildChips('textures', TEXTURES);
    buildChips('runtime', RUNTIME);
    buildChips('company', COMPANY);
    buildChips('services', SERVICES);
    buildDepth();
    buildChips('cinemas', CINEMAS);
    buildDials();
    buildChips('avoid', AVOID);
    buildChips('leash', LEASH);

    // Club groups
    buildChips('clubSize', CLUB_SIZE);
    buildChips('clubRange', CLUB_RANGE);
    buildChips('clubAge', CLUB_AGE);
    buildChips('clubCount', CLUB_COUNT);
    buildChips('clubCadence', CLUB_CADENCE);
    buildChips('clubFormat', CLUB_FORMAT);
    buildChips('clubTalk', CLUB_TALK);
    buildChips('clubMission', CLUB_MISSION);
    buildChips('clubLimits', CLUB_LIMITS);
    buildChips('clubThread', CLUB_THREAD);
    buildChips('clubLeash', CLUB_LEASH);

    // Seeded hands — dealt per session
    buildStills();
    buildSeen();

    buildFigures();
    wireGroups();
    wireInputs();
    wirePad();
    renderFromState();

    $('modeEvening').addEventListener('click', () => startMode('evening'));
    $('modeClub').addEventListener('click', () => startMode('club'));
    $('navNext').addEventListener('click', next);
    $('navBack').addEventListener('click', back);
    $('downloadBtn').addEventListener('click', download);
    $('copyBtn').addEventListener('click', copy);
    $('rerollBtn').addEventListener('click', reroll);
    $('tabReading').addEventListener('click', () => setTab('reading'));
    $('tabSource').addEventListener('click', () => setTab('source'));
    $('editLink').addEventListener('click', () => showScreen(lastStepIdx()));
    $('restartLink').addEventListener('click', () => {
        if (confirm('Start over? This clears your answers and deals a fresh deck.')) {
            const mode = state.mode;
            state = JSON.parse(JSON.stringify(DEFAULT_STATE));
            state.mode = mode;
            state.deckSeed = randomSeed();
            state.printSeed = randomSeed();
            save();
            buildStills(); buildSeen();
            renderFromState();
            showScreen(0);
        }
    });

    document.addEventListener('keydown', e => {
        const typing = /^(TEXTAREA|INPUT)$/.test(document.activeElement.tagName) || document.activeElement.id === 'pad';
        if (e.key === 'Enter' && !typing && screenIdx >= 1 && screenIdx <= lastStepIdx()) { e.preventDefault(); next(); }
    });

    showScreen(0);
}
document.addEventListener('DOMContentLoaded', init);
