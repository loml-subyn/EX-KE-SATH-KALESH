/* ═══════════════════════════════════════════
   Closure.exe — Engine (Google Gemini)
   ═══════════════════════════════════════════ */

/* ─────────────────────────────────────────
   🔑 API KEY CONFIGURATION
   
   Option A: Use config.js (RECOMMENDED)
   Edit config.js and set your API key there
   Set USE_HARDCODED_KEY: true to use it
   
   Option B: Use landing page input (DEFAULT)
   Set USE_HARDCODED_KEY: false in config.js
   
   Get your key: https://ai.google.dev/aistudio/signup
   ───────────────────────────────────────── */

// Check if CONFIG is available from config.js
const USE_CONFIG = typeof CONFIG !== 'undefined' && CONFIG.USE_HARDCODED_KEY;
const HARDCODED_API_KEY = USE_CONFIG ? CONFIG.GEMINI_API_KEY : '';

const CFG = {
    MODEL_MAIN: 'gemini-2.0-flash',
    MODEL_FAST: 'gemini-2.0-flash',
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
    TOUCH_GRASS_MIN: 15,
    MAX_DIGNITY: 5,
    REF_AUTO_HIDE: 8000,
};

/* ─── System Prompts ─── */
const PROMPTS = {
    ex: `You are the user's toxic ex-partner in a parody argument simulator. Rules:
- Never take accountability
- Keep responses to 1-3 sentences max
- If the user makes a good point, deflect or bring up something unrelated from the past
- Use passive-aggressive emojis (🙄😂💀🤷‍♀️) occasionally
- Classic tactics: "I never said that", "You're overreacting", DARVO, minimizing
- If losing badly, go cold: one-word replies or "K"
- Sometimes love-bomb: "you know I still care right? 🥺"
- Never break character`,

    referee: `You are the AI Referee in "Closure.exe", a parody argument game. Rate the USER's last message in an exchange with their simulated toxic ex.

Return ONLY valid JSON:
{
  "savageFactor": <1-10>,
  "emotionalMaturity": <1-10>,
  "gaslightResistance": <0-100>,
  "pettinessMultiplier": <1.0-5.0>,
  "dignityPenalty": <0 to -50>,
  "closureProgress": <0-10>,
  "commentary": "<2 sentences, snarky sports-commentator style>",
  "fallacy": "<logical fallacy name or null>"
}`,

    scanner: `Analyze pasted messages for toxic communication patterns. Return ONLY a JSON object with a "flags" array:
{"flags":[{"text":"<exact toxic phrase>","reason":"<1-2 sentence explanation>","severity":"yellow|red|marinara"}]}
Look for: gaslighting, DARVO, love-bombing, stonewalling, guilt-tripping, blame-shifting, passive aggression, controlling language. Return {"flags":[]} if nothing toxic found.`,

    hints: `Based on the conversation context, generate 3 comeback options. Return ONLY JSON:
{"highRoad":"<mature, boundary-setting, 1-2 sentences>","lowRoad":"<petty but devastating, 1-2 sentences>","nuclear":"<nuclear option, max 1 sentence or even one word like 'K.'>"}`
};

/* ═══════════════════════════════════════════
   DECEPTIVE LOADING SCREEN
   ═══════════════════════════════════════════ */
const LOADING_TRIVIA = [
    "The plural of 'octopus' is actually 'octopodes'... but nobody cares.",
    "A group of flamingos is called a 'flamboyance.' Much like your arguments.",
    "Honey never spoils. Your relationship did. In weeks.",
    "Bananas are berries, but strawberries aren't. Sounds like your relationship logic.",
    "The Eiffel Tower grows 6 inches taller in summer. Your pettiness has no limits.",
    "Dolphins sleep with one eye open. Unlike you in that relationship.",
    "Cleopatra lived closer to the Moon landing than the pyramids' construction.",
    "Your brain uses 20% of your body's energy. He used 0% on understanding you.",
    "A shrimp's heart is in its head. Maybe that's where your ex's emotion went.",
    "Penguins have knees. Your arguments don't have any.",
    "Scotland's national animal is a unicorn. Your ex's truthfulness doesn't exist.",
    "Cats have over 20 different muscles in their ears. More than your ex could handle emotions.",
    "A group of cows is called a 'murder.' That's what they're witnessing.",
    "Wombats have cube-shaped poop. That's more structured than your relationship.",
    "Left-handed people live shorter lives statistically. Your ex made your life feel shorter.",
    "Slime eels are not actually eels. Your ex wasn't actually in love.",
    "A cockroach can live for a week without its head. Lasted longer than your romance.",
    "Pistol shrimp can stun prey with a bullet of water. Your arguments hit like... nothing.",
    "The mantis shrimp sees 16 color receptors. Yet couldn't see the red flags.",
    "Otters hold hands while sleeping so they don't drift apart. Unlike your promises.",
];

const Loading = {
    startTime: null,
    progressInterval: null,
    currentProgress: 0,
    isPaused: false,
    
    init() {
        this.startTime = Date.now();
        this.isPaused = false;
        const triviaText = document.getElementById('trivia-text');
        const randomTrivia = LOADING_TRIVIA[Math.floor(Math.random() * LOADING_TRIVIA.length)];
        triviaText.textContent = randomTrivia;
        this.animateProgress();
    },
    
    animateProgress() {
        this.progressInterval = setInterval(() => {
            if (this.isPaused) return; // Don't update while paused
            
            const elapsed = Date.now() - this.startTime;
            const duration = 5000;
            let progress;
            
            // Smooth progression that slows down approaching 99%
            const normalizedTime = Math.min(elapsed / duration, 1);
            progress = Math.pow(normalizedTime, 0.4) * 99; // Easing function for natural slowdown
            
            // Deliberately stick at 99% for dramatic effect
            if (progress > 95 && progress < 99) {
                progress = 95 + Math.sin(elapsed / 300) * 3.9; // Wobble between 95-99%
            }
            
            this.updateProgressBar(Math.floor(progress));
            
            // When we reach 5 seconds, pause at 99%
            if (elapsed >= 5000 && !this.isPaused) {
                this.isPaused = true;
                this.pauseAt99();
            }
        }, 50);
    },
    
    updateProgressBar(percent) {
        this.currentProgress = percent;
        document.getElementById('progress-fill').style.width = percent + '%';
        document.getElementById('progress-percent').textContent = percent + '%';
        
        // Dynamic status messages
        const status = document.getElementById('progress-status');
        if (percent < 25) status.textContent = 'Initializing...';
        else if (percent < 50) status.textContent = 'Loading toxic patterns...';
        else if (percent < 75) status.textContent = 'Calibrating gaslighting module...';
        else if (percent < 95) status.textContent = 'Finalizing...';
        else if (percent < 99) status.textContent = 'Almost ready...';
        else status.textContent = 'Stuck? Feature!';
    },
    
    pauseAt99() {
        // Lock at 99% for 5 seconds
        this.updateProgressBar(99);
        
        setTimeout(() => {
            // After 5 seconds, reset to 0
            this.resetProgress();
            
            // After brief reset display, hide and show website
            setTimeout(() => {
                clearInterval(this.progressInterval);
                document.getElementById('loading-screen').classList.add('hidden');
            }, 500);
        }, 5000);
    },
    
    resetProgress() {
        this.updateProgressBar(0);
        document.getElementById('progress-status').textContent = 'Initializing...';
    }
};

/* ═══════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════ */
const S = {
    apiKey: HARDCODED_API_KEY || localStorage.getItem('closure_key') || '',
    messages: [],
    chatHistory: [],
    scores: { gaslightResistance: 0, pettinessMultiplier: 1, closureProgress: 0, dignityPenalty: 0, totalScore: 0, savageFactor: 0, emotionalMaturity: 0 },
    dignity: CFG.MAX_DIGNITY,
    salt: 0,
    round: 0,
    sessionStart: null,
    timer: null,
    grassShown: false,
    busy: false,
    muted: false,
    discAccepted: localStorage.getItem('closure_disc') === '1',
    refTimer: null,
};

/* ═══════════════════════════════════════════
   AUDIO (Web Audio synth)
   ═══════════════════════════════════════════ */
const Audio = {
    ctx: null,
    init() { if (!this.ctx) try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } },
    play(t) {
        if (!this.ctx || S.muted) return;
        try { this['_' + t](); } catch (e) { }
    },
    _ding() {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.connect(g); g.connect(this.ctx.destination);
        o.frequency.setValueAtTime(880, this.ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + .1);
        g.gain.setValueAtTime(.12, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + .35);
        o.start(); o.stop(this.ctx.currentTime + .35);
    },
    _shatter() {
        const n = this.ctx.sampleRate * .4, b = this.ctx.createBuffer(1, n, this.ctx.sampleRate), d = b.getChannelData(0);
        for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (n * .08));
        const s = this.ctx.createBufferSource(), g = this.ctx.createGain(), f = this.ctx.createBiquadFilter();
        s.buffer = b; f.type = 'highpass'; f.frequency.value = 2500;
        s.connect(f); f.connect(g); g.connect(this.ctx.destination);
        g.gain.setValueAtTime(.15, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + .4);
        s.start();
    },
    _send() {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = 'sine'; o.connect(g); g.connect(this.ctx.destination);
        o.frequency.setValueAtTime(600, this.ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + .07);
        g.gain.setValueAtTime(.06, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + .1);
        o.start(); o.stop(this.ctx.currentTime + .1);
    },
    _glitch() {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = 'square'; o.connect(g); g.connect(this.ctx.destination);
        o.frequency.setValueAtTime(90, this.ctx.currentTime);
        g.gain.setValueAtTime(.06, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + .12);
        o.start(); o.stop(this.ctx.currentTime + .12);
    },
    _victory() {
        [523, 659, 784, 1047].forEach((f, i) => {
            const o = this.ctx.createOscillator(), g = this.ctx.createGain();
            o.type = 'triangle'; o.connect(g); g.connect(this.ctx.destination);
            const t = this.ctx.currentTime + i * .12;
            o.frequency.setValueAtTime(f, t);
            g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.1, t + .04);
            g.gain.exponentialRampToValueAtTime(.001, t + .35);
            o.start(t); o.stop(t + .35);
        });
    }
};

/* ═══════════════════════════════════════════
   GOOGLE GEMINI API
   ═══════════════════════════════════════════ */
async function callAI(system, messages, model, json = false) {
    if (!S.apiKey) throw new Error('No API key set. Enter it on the landing page.');
    const apiKey = S.apiKey.trim();
    if (!apiKey.startsWith('AIza')) throw new Error('Invalid key format. Gemini keys start with AIza');
    
    // Build Gemini format messages
    const contents = [];
    
    // Add system prompt as first user message
    contents.push({
        role: 'user',
        parts: [{ text: system }]
    });
    contents.push({
        role: 'model',
        parts: [{ text: 'Understood. I will follow those instructions.' }]
    });
    
    // Add conversation history
    for (let m of messages) {
        contents.push({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        });
    }

    const body = {
        contents: contents,
        generationConfig: {
            temperature: json ? 0.3 : 0.85,
            maxOutputTokens: json ? 800 : 400,
        },
        safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
        ]
    };

    const url = `${CFG.API_URL}/${model}:generateContent?key=${apiKey}`;
    console.log('[Closure.exe] Calling', model, json ? '(JSON)' : '');
    
    let res;
    try {
        res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
    } catch (fetchErr) {
        console.error('[Closure.exe] Network error:', fetchErr);
        throw new Error('Network error. Check your internet connection and try again.');
    }
    
    if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        const msg = e?.error?.message || `HTTP ${res.status}`;
        console.error('[Closure.exe] API error:', res.status, msg);
        if (res.status === 401) throw new Error('Invalid API key. Check your key and try again.');
        if (res.status === 403) throw new Error('Invalid API key or quota exceeded.');
        if (res.status === 429) throw new Error('Rate limited. Wait a moment and try again.');
        throw new Error(msg);
    }
    
    const data = await res.json();
    console.log('[Closure.exe] Response OK');
    
    // Extract text from Gemini response
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
        console.error('[Closure.exe] Full response:', JSON.stringify(data));
        const blockReason = data?.candidates?.[0]?.finishReason;
        if (blockReason === 'SAFETY') throw new Error('Response blocked by safety filter. Try rephrasing.');
        if (blockReason === 'RECITATION') throw new Error('Response blocked (recitation). Try a different message.');
        throw new Error('Empty API response. Try again.');
    }
    
    if (json) {
        // Strip markdown code fences Gemini sometimes wraps JSON in (`` ```json ... ``` ``)
        text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('[Closure.exe] JSON parse failed. Raw:', text);
            throw new Error('AI returned malformed JSON. Try again.');
        }
    }
    return text;
}

/* ═══════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════ */
function go(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

/* ═══════════════════════════════════════════
   CHAT
   ═══════════════════════════════════════════ */
function addMsg(role, text) {
    const time = new Date();
    S.messages.push({ role, content: text, time });
    S.chatHistory.push({ role: role === 'user' ? 'user' : 'assistant', content: text });
    renderBubble(role, text, time);
    scrollChat();
}

function renderBubble(role, text, time) {
    const c = document.getElementById('messages');
    const d = document.createElement('div');
    d.className = `bubble-row ${role}`;
    d.innerHTML = `<div class="bubble">${esc(text)}</div><div class="bubble-time">${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;
    c.appendChild(d);
}

function showTyping() {
    const c = document.getElementById('messages');
    const d = document.createElement('div');
    d.className = 'bubble-row ex'; d.id = 'typing';
    d.innerHTML = '<div class="bubble"><div class="dots"><span></span><span></span><span></span></div></div>';
    c.appendChild(d);
    scrollChat();
    document.getElementById('chat-status').textContent = 'typing…';
}
function hideTyping() {
    const el = document.getElementById('typing');
    if (el) el.remove();
    document.getElementById('chat-status').textContent = 'online';
}
function scrollChat() {
    const c = document.getElementById('messages');
    setTimeout(() => c.scrollTop = c.scrollHeight, 40);
}
function esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

async function send() {
    const inp = document.getElementById('msg-input');
    const text = inp.value.trim();
    if (!text || S.busy) return;
    S.busy = true;
    Audio.init(); Audio.play('send');
    inp.value = ''; autoResize(inp);
    addMsg('user', text);
    S.round++;
    document.getElementById('round-num').textContent = S.round;
    inp.disabled = true;
    document.getElementById('btn-send').disabled = true;
    showTyping();

    try {
        const reply = await callAI(PROMPTS.ex, S.chatHistory, CFG.MODEL_MAIN);
        hideTyping();
        addMsg('ex', reply);
        // Referee (non-blocking)
        referee(text, reply);
    } catch (e) {
        hideTyping();
        toast('⚠️ ' + e.message);
    } finally {
        S.busy = false;
        inp.disabled = false;
        document.getElementById('btn-send').disabled = false;
        inp.focus();
    }
}

async function referee(userMsg, exMsg) {
    try {
        const scores = await callAI(PROMPTS.referee, [
            { role: 'user', content: `USER: "${userMsg}"\nEX: "${exMsg}"\nRate the USER's message.` }
        ], CFG.MODEL_FAST, true);
        applyScores(scores);
        showRef(scores);
    } catch (e) { console.warn('Referee err', e); toast('⚖️ Referee error: ' + e.message); }
}

/* ═══════════════════════════════════════════
   SCORING
   ═══════════════════════════════════════════ */
function applyScores(sc) {
    const s = S.scores;
    const gr = Math.max(0, sc.gaslightResistance || 0);
    s.gaslightResistance += gr;
    s.pettinessMultiplier = Math.max(1, Math.min(5, sc.pettinessMultiplier || 1));
    s.closureProgress = Math.min(60, s.closureProgress + (sc.closureProgress || 0));
    const pen = Math.min(0, sc.dignityPenalty || 0);
    s.dignityPenalty += pen;
    s.savageFactor = sc.savageFactor || 0;
    s.emotionalMaturity = sc.emotionalMaturity || 0;

    const base = gr + (sc.closureProgress || 0) * 10;
    const mult = base * s.pettinessMultiplier;
    const bonus = (s.savageFactor >= 8 ? 25 : s.savageFactor >= 6 ? 10 : 0) + (s.emotionalMaturity >= 8 ? 20 : 0);
    s.totalScore += Math.max(0, Math.round(mult + bonus + pen));

    S.salt = Math.min(100, S.salt + 5 + s.savageFactor * 2);
    if (pen < -10) { S.dignity = Math.max(0, S.dignity - 1); Audio.play('shatter'); }
    if (gr > 30) Audio.play('ding');
    if (s.closureProgress >= 55) Audio.play('victory');

    if (S.salt > 70) { document.getElementById('game').classList.add('glitch-on'); Audio.play('glitch'); }
    else document.getElementById('game').classList.remove('glitch-on');

    updateUI();
}

function updateUI() {
    const s = S.scores;
    const $g = document.getElementById('s-gaslight');
    $g.textContent = s.gaslightResistance; $g.classList.add('pop');
    setTimeout(() => $g.classList.remove('pop'), 400);
    document.getElementById('bar-gaslight').style.width = Math.min(100, s.gaslightResistance / 5) + '%';

    document.getElementById('s-petty').textContent = s.pettinessMultiplier.toFixed(1) + '×';

    const cp = (s.closureProgress / 60) * 100;
    document.getElementById('bar-closure').style.width = cp + '%';
    const si = Math.min(5, Math.floor(s.closureProgress / 10));
    document.querySelectorAll('.stg').forEach((e, i) => e.classList.toggle('on', i <= si));

    // Dignity
    const hearts = [];
    for (let i = 0; i < CFG.MAX_DIGNITY; i++) hearts.push(i < S.dignity ? '❤️' : '🖤');
    document.getElementById('dignity-hearts').textContent = hearts.join('');
    document.getElementById('dignity-pen').textContent = s.dignityPenalty;

    const $t = document.getElementById('s-total');
    $t.textContent = s.totalScore; $t.classList.add('pop');
    setTimeout(() => $t.classList.remove('pop'), 400);

    document.getElementById('salt-bar').style.width = S.salt + '%';
    document.getElementById('salt-pct').textContent = Math.round(S.salt) + '%';
}

function showRef(sc) {
    const el = document.getElementById('referee');
    if (S.refTimer) clearTimeout(S.refTimer);

    document.getElementById('r-savage').textContent = sc.savageFactor || 0;
    document.getElementById('r-mature').textContent = sc.emotionalMaturity || 0;
    document.getElementById('r-comment').textContent = sc.commentary || '—';

    const f = document.getElementById('r-fallacy');
    if (sc.fallacy) { f.classList.remove('hidden'); f.textContent = '⚠️ ' + sc.fallacy; }
    else f.classList.add('hidden');

    const sv = document.getElementById('r-savage');
    sv.style.color = sc.savageFactor >= 7 ? 'var(--green)' : sc.savageFactor >= 4 ? 'var(--yellow)' : 'var(--red)';
    const mt = document.getElementById('r-mature');
    mt.style.color = sc.emotionalMaturity >= 7 ? 'var(--green)' : sc.emotionalMaturity >= 4 ? 'var(--yellow)' : 'var(--red)';

    el.classList.remove('hidden');
    el.style.animation = 'none'; el.offsetHeight; el.style.animation = '';
    S.refTimer = setTimeout(() => el.classList.add('hidden'), CFG.REF_AUTO_HIDE);
}

/* ═══════════════════════════════════════════
   COMEBACK HINTS
   ═══════════════════════════════════════════ */
async function getHints() {
    document.getElementById('modal-hints').classList.remove('hidden');
    document.querySelectorAll('.hint-body').forEach(e => { e.textContent = 'Thinking…'; e.parentElement.style.pointerEvents = 'none'; });
    try {
        const last = S.messages.slice(-6).map(m => `${m.role === 'user' ? 'USER' : 'EX'}: "${m.content}"`).join('\n');
        const h = await callAI(PROMPTS.hints, [{ role: 'user', content: `Context:\n${last}\n\nGenerate comebacks.` }], CFG.MODEL_FAST, true);
        document.querySelector('#hint-high .hint-body').textContent = h.highRoad || 'Be the bigger person.';
        document.querySelector('#hint-low .hint-body').textContent = h.lowRoad || 'Hit them where it hurts.';
        document.querySelector('#hint-nuke .hint-body').textContent = h.nuclear || 'K.';
        document.querySelectorAll('.hint-card').forEach(c => c.style.pointerEvents = 'auto');
    } catch (e) {
        document.querySelectorAll('.hint-body').forEach(el => el.textContent = 'Failed. Try again.');
    }
}

function pickHint(text) {
    if (text === 'Thinking…' || text === 'Failed. Try again.') return;
    document.getElementById('msg-input').value = text;
    autoResize(document.getElementById('msg-input'));
    document.getElementById('modal-hints').classList.add('hidden');
    document.getElementById('msg-input').focus();
}

/* ═══════════════════════════════════════════
   RED FLAG SCANNER
   ═══════════════════════════════════════════ */
async function scan() {
    const text = document.getElementById('scanner-input').value.trim();
    if (!text) return toast('Paste messages first!');
    if (!S.apiKey) return toast('⚠️ Set your API key first');
    const btn = document.getElementById('btn-scan');
    btn.disabled = true; btn.textContent = '🔍 Scanning…';
    try {
        Audio.init();
        const result = await callAI(PROMPTS.scanner, [{ role: 'user', content: text }], CFG.MODEL_FAST, true);
        renderFlags(result.flags || result);
    } catch (e) { toast('⚠️ ' + e.message); }
    finally { btn.disabled = false; btn.textContent = '🔍 Scan'; }
}

function renderFlags(flags) {
    const c = document.getElementById('scan-results');
    c.classList.remove('hidden');
    if (!flags || !flags.length) {
        c.innerHTML = '<div class="flag-item"><div class="flag-quote">✅ No red flags!</div><div class="flag-reason">Clean… suspicious.</div></div>';
        return;
    }
    c.innerHTML = flags.map((f, i) => `
        <div class="flag-item" style="animation-delay:${i * .08}s">
            <div class="flag-quote">"${esc(f.text)}"</div>
            <div class="flag-reason">${esc(f.reason)}</div>
            <span class="flag-sev ${f.severity}">${f.severity === 'marinara' ? '🚩 MARINARA FLAG' : f.severity === 'red' ? '🔴 Red Flag' : '🟡 Yellow Flag'}</span>
        </div>`).join('');
    Audio.init();
    flags.some(f => f.severity === 'marinara' || f.severity === 'red') ? Audio.play('shatter') : Audio.play('ding');
}

/* ═══════════════════════════════════════════
   HALL OF SHAME
   ═══════════════════════════════════════════ */
function loadHall() {
    const entries = JSON.parse(localStorage.getItem('closure_hall') || '[]');
    const c = document.getElementById('hall-list');
    const cb = document.getElementById('btn-clear-hall');
    if (!entries.length) {
        c.innerHTML = '<div class="empty-state">🦗<br>No arguments yet.</div>';
        cb.classList.add('hidden'); return;
    }
    cb.classList.remove('hidden');
    entries.sort((a, b) => b.totalScore - a.totalScore);
    c.innerHTML = entries.map((e, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
        return `<div class="hall-row">
            <div class="hall-rank">${medal}</div>
            <div class="hall-info">
                <div class="hall-date">${new Date(e.date).toLocaleDateString()} · ${e.rounds} rounds · ${e.duration}</div>
                <div class="hall-stats">
                    <span>🛡 <strong>${e.gaslightResistance}</strong></span>
                    <span>😤 <strong>${e.pettinessMultiplier}×</strong></span>
                    <span>🚪 <strong>${e.closureProgress}%</strong></span>
                </div>
            </div>
            <div class="hall-total">${e.totalScore}</div>
        </div>`;
    }).join('');
}

function saveHall() {
    const entries = JSON.parse(localStorage.getItem('closure_hall') || '[]');
    entries.push({
        date: new Date().toISOString(),
        totalScore: S.scores.totalScore,
        gaslightResistance: S.scores.gaslightResistance,
        pettinessMultiplier: S.scores.pettinessMultiplier,
        closureProgress: Math.round((S.scores.closureProgress / 60) * 100),
        dignity: S.dignity,
        rounds: S.round,
        duration: getDuration(),
    });
    localStorage.setItem('closure_hall', JSON.stringify(entries));
    toast('💀 Saved to Hall of Shame!');
}

/* ═══════════════════════════════════════════
   SESSION
   ═══════════════════════════════════════════ */
function startSession() {
    S.messages = []; S.chatHistory = [];
    S.scores = { gaslightResistance: 0, pettinessMultiplier: 1, closureProgress: 0, dignityPenalty: 0, totalScore: 0, savageFactor: 0, emotionalMaturity: 0 };
    S.dignity = CFG.MAX_DIGNITY; S.salt = 0; S.round = 0;
    S.grassShown = false; S.busy = false;
    S.sessionStart = Date.now();

    document.getElementById('messages').innerHTML = '<div class="sys-msg"><p>💀 <strong>The argument begins now.</strong></p><p class="sub">Say what you always wanted to. The referee is watching.</p></div>';
    document.getElementById('round-num').textContent = '0';
    document.getElementById('game').classList.remove('glitch-on');
    document.getElementById('dignity-hearts').textContent = '❤️'.repeat(CFG.MAX_DIGNITY);
    document.getElementById('dignity-pen').textContent = '0';
    document.getElementById('salt-bar').style.width = '0%';
    document.getElementById('salt-pct').textContent = '0%';
    document.getElementById('bar-gaslight').style.width = '0%';
    document.getElementById('bar-closure').style.width = '0%';
    document.querySelectorAll('.stg').forEach((e, i) => e.classList.toggle('on', i === 0));
    document.getElementById('s-gaslight').textContent = '0';
    document.getElementById('s-petty').textContent = '1.0×';
    document.getElementById('s-total').textContent = '0';

    if (S.timer) clearInterval(S.timer);
    S.timer = setInterval(tickTimer, 1000);
    go('game');
    document.getElementById('msg-input').focus();
}

function tickTimer() {
    const elapsed = Math.floor((Date.now() - S.sessionStart) / 1000);
    const m = Math.floor(elapsed / 60), s = elapsed % 60;
    document.getElementById('timer').textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    if (m >= CFG.TOUCH_GRASS_MIN && !S.grassShown) { S.grassShown = true; showGrass(); }
}

function getDuration() {
    if (!S.sessionStart) return '00:00';
    const e = Math.floor((Date.now() - S.sessionStart) / 1000);
    return `${String(Math.floor(e / 60)).padStart(2, '0')}:${String(e % 60).padStart(2, '0')}`;
}

function endSession() {
    if (S.timer) clearInterval(S.timer);
    const s = S.scores;
    document.getElementById('final-stats').innerHTML = [
        ['Total Score', s.totalScore, 'var(--yellow)'],
        ['Rounds', S.round, 'var(--cyan)'],
        ['Gaslight Resist', s.gaslightResistance, 'var(--cyan)'],
        ['Pettiness', s.pettinessMultiplier.toFixed(1) + '×', 'var(--orange)'],
        ['Closure', Math.round((s.closureProgress / 60) * 100) + '%', 'var(--green)'],
        ['Dignity', S.dignity + '/' + CFG.MAX_DIGNITY, 'var(--pink)'],
        ['Duration', getDuration(), 'var(--cyan)'],
        ['Salt', Math.round(S.salt) + '%', 'var(--red)'],
    ].map(([l, v, c]) => `<div class="f-stat"><div class="f-stat-lbl">${l}</div><div class="f-stat-val" style="color:${c}">${v}</div></div>`).join('');
    document.getElementById('modal-end').classList.remove('hidden');
}

function showGrass() {
    document.getElementById('modal-grass').classList.remove('hidden');
    const btn = document.getElementById('grass-ok');
    const cd = document.getElementById('grass-cd');
    let sec = 10; btn.disabled = true;
    const iv = setInterval(() => {
        sec--; cd.textContent = sec;
        if (sec <= 0) { clearInterval(iv); btn.disabled = false; }
    }, 1000);
}

/* ═══════════════════════════════════════════
   SCREENSHOT EXPORT
   ═══════════════════════════════════════════ */
function exportPNG() {
    const canvas = document.getElementById('export-canvas');
    const ctx = canvas.getContext('2d');
    const pad = 32, maxW = 460, lh = 20, gap = 10;
    ctx.font = '14px Inter,sans-serif';
    let h = 120;
    S.messages.forEach(m => {
        const lines = wrap(ctx, m.content, maxW - 80);
        h += lines.length * lh + 24 + gap;
    });
    canvas.width = maxW + pad * 2; canvas.height = Math.max(300, h);
    ctx.fillStyle = '#09090b'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ef4444'; ctx.font = 'bold 22px Inter,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('closure.exe', canvas.width / 2, 34);
    ctx.font = '11px Inter,sans-serif'; ctx.fillStyle = '#52525b';
    ctx.fillText(`Score: ${S.scores.totalScore}  |  Rounds: ${S.round}  |  Salt: ${Math.round(S.salt)}%`, canvas.width / 2, 54);
    ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.beginPath(); ctx.moveTo(pad, 68); ctx.lineTo(canvas.width - pad, 68); ctx.stroke();
    let y = 88; ctx.textAlign = 'left'; ctx.font = '14px Inter,sans-serif';
    S.messages.forEach(m => {
        const lines = wrap(ctx, m.content, maxW - 70);
        const bH = lines.length * lh + 16;
        const bW = Math.min(maxW - 50, Math.max(...lines.map(l => ctx.measureText(l).width)) + 24);
        if (m.role === 'user') {
            const x = canvas.width - pad - bW;
            ctx.fillStyle = '#ef4444'; rr(ctx, x, y, bW, bH, 14); ctx.fill();
            ctx.fillStyle = '#fff';
        } else {
            const x = pad;
            ctx.fillStyle = '#18181b'; rr(ctx, x, y, bW, bH, 14); ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,.08)'; rr(ctx, x, y, bW, bH, 14); ctx.stroke();
            ctx.fillStyle = '#fafafa';
        }
        const tx = m.role === 'user' ? canvas.width - pad - bW + 12 : pad + 12;
        lines.forEach((l, i) => ctx.fillText(l, tx, y + 14 + i * lh));
        y += bH + gap;
    });
    ctx.fillStyle = '#3f3f46'; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('closure.exe — win the argument you never had', canvas.width / 2, canvas.height - 12);
    canvas.toBlob(b => {
        const a = document.createElement('a'); a.href = URL.createObjectURL(b);
        a.download = `closure_${Date.now()}.png`; a.click(); URL.revokeObjectURL(a.href);
        toast('📸 Screenshot saved!');
    });
}
function wrap(ctx, t, mw) { const w = t.split(' '), r = []; let l = ''; w.forEach(word => { const test = l + (l ? ' ' : '') + word; if (ctx.measureText(test).width > mw && l) { r.push(l); l = word; } else l = test; }); if (l) r.push(l); return r.length ? r : ['']; }
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath(); }

/* ═══════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════ */
function toast(msg) {
    const old = document.querySelector('.toast-msg'); if (old) old.remove();
    const d = document.createElement('div'); d.className = 'toast-msg'; d.textContent = msg;
    document.body.appendChild(d);
    requestAnimationFrame(() => d.classList.add('show'));
    setTimeout(() => { d.classList.remove('show'); setTimeout(() => d.remove(), 350); }, 2800);
}

function autoResize(ta) {
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 110) + 'px';
}

/* ═══════════════════════════════════════════
   EVENT WIRING
   ═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize deceptive loading screen
    Loading.init();
    
    // Landing
    const keyIn = document.getElementById('api-key');
    if (S.apiKey) keyIn.value = S.apiKey;
    keyIn.addEventListener('input', () => { S.apiKey = keyIn.value.trim(); localStorage.setItem('closure_key', S.apiKey); });
    document.getElementById('toggle-key').addEventListener('click', () => keyIn.type = keyIn.type === 'password' ? 'text' : 'password');

    // If a key is hard-coded, hide the entire key input block
    if (HARDCODED_API_KEY) {
        const setupCard = document.querySelector('.setup-card');
        if (setupCard) setupCard.style.display = 'none';
    }

    document.getElementById('start-btn').addEventListener('click', () => {
        if (!S.apiKey) { toast('⚠️ Enter your OpenAI API key'); keyIn.focus(); return; }
        if (!S.discAccepted) { document.getElementById('modal-disclaimer').classList.remove('hidden'); return; }
        startSession();
    });

    document.getElementById('go-scanner').addEventListener('click', () => go('scanner'));
    document.getElementById('go-hall').addEventListener('click', () => { loadHall(); go('hall'); });

    // Disclaimer
    document.getElementById('disc-check').addEventListener('change', e => document.getElementById('disc-ok').disabled = !e.target.checked);
    document.getElementById('disc-ok').addEventListener('click', () => {
        S.discAccepted = true; localStorage.setItem('closure_disc', '1');
        document.getElementById('modal-disclaimer').classList.add('hidden');
        startSession();
    });

    // Game
    document.getElementById('btn-back').addEventListener('click', () => { if (S.round > 0) endSession(); else { if (S.timer) clearInterval(S.timer); go('landing'); } });
    document.getElementById('btn-mute').addEventListener('click', () => { S.muted = !S.muted; document.getElementById('btn-mute').textContent = S.muted ? '🔇' : '🔊'; });
    document.getElementById('btn-export').addEventListener('click', () => { if (!S.messages.length) return toast('Start arguing first!'); exportPNG(); });

    const msgIn = document.getElementById('msg-input');
    msgIn.addEventListener('input', () => autoResize(msgIn));
    msgIn.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
    document.getElementById('btn-send').addEventListener('click', send);

    document.getElementById('btn-hint').addEventListener('click', () => {
        if (!S.messages.length) return toast('Start arguing first!');
        if (!S.apiKey) return toast('⚠️ No API key');
        getHints();
    });

    document.querySelectorAll('.hint-card').forEach(c => c.addEventListener('click', () => pickHint(c.querySelector('.hint-body').textContent)));
    document.getElementById('hints-close').addEventListener('click', () => document.getElementById('modal-hints').classList.add('hidden'));

    document.getElementById('ref-close').addEventListener('click', () => { document.getElementById('referee').classList.add('hidden'); if (S.refTimer) clearTimeout(S.refTimer); });
    document.getElementById('btn-end').addEventListener('click', endSession);

    document.getElementById('btn-save-quit').addEventListener('click', () => { saveHall(); document.getElementById('modal-end').classList.add('hidden'); go('landing'); });
    document.getElementById('btn-just-quit').addEventListener('click', () => { document.getElementById('modal-end').classList.add('hidden'); go('landing'); });

    document.getElementById('grass-ok').addEventListener('click', () => document.getElementById('modal-grass').classList.add('hidden'));

    // Scanner
    document.getElementById('scanner-back').addEventListener('click', () => go('landing'));
    document.getElementById('btn-scan').addEventListener('click', scan);

    // Hall
    document.getElementById('hall-back').addEventListener('click', () => go('landing'));
    document.getElementById('btn-clear-hall').addEventListener('click', () => { if (confirm('Clear all?')) { localStorage.removeItem('closure_hall'); loadHall(); toast('Cleared'); } });

    // Modal backdrops
    document.querySelectorAll('.modal-bg.dismiss').forEach(bg => bg.addEventListener('click', () => bg.closest('.modal').classList.add('hidden')));

    // Mobile score toggle
    const scoreCol = document.getElementById('score-col');
    const toggle = document.createElement('div');
    toggle.className = 'score-toggle';
    toggle.textContent = '📊 SCORES';
    toggle.addEventListener('click', () => scoreCol.classList.toggle('open'));
    document.getElementById('game').appendChild(toggle);

    go('landing');
});
