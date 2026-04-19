/* ============================================================
   CONSTANTS
   ============================================================ */
const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"
]

const noMessages = [
    "No",
    "Are you positive? 🤔",
    "Pookie please... 🥺",
    "If you say no, I'll be really sad...",
    "I will be very sad... 😢",
    "Please??? 💔",
    "Don't do this to me...",
    "Last chance! 😭",
    "You can't catch me anyway 😜"
]

const yesTeasePokes = [
    "Try saying no first... I bet you want to know what happens 😏",
    "Go on, hit no... just once 👀",
    "You're missing out 😈",
    "Click no, I dare you 😏"
]

const tickerReasons = [
    "Because your smile lights up the room ✨",
    "Because you make everything better 💕",
    "Because you're my favourite person 🌸",
    "Because every day with you is special 💖",
    "Because you're one in a million 🌟",
    "Because I fall for you every single day 🍂",
    "Because your laugh is my favourite sound 🎵",
    "Because home is wherever you are 🏡",
]

/* ============================================================
   STATE
   ============================================================ */
let yesTeasedCount = 0
let noClickCount = 0
let runAwayEnabled = false
let musicPlaying = true

/* ============================================================
   DOM REFS
   ============================================================ */
const catGif = document.getElementById('cat-gif')
const gifLoader = document.getElementById('gif-loader')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

/* ============================================================
   NAME FROM URL PARAM
   ============================================================ */
const params = new URLSearchParams(window.location.search)
const name = params.get('name') || 'Bindu'

document.getElementById('main-title').textContent = `Will you be my Valentine, ${name}? 💕`
document.title = `Will you be my Valentine, ${name}? 💕`
document.getElementById('subtitle').textContent = `💌 A special question, just for you, ${name}...`

/* ============================================================
   GIF LOADING STATE
   ============================================================ */
catGif.addEventListener('load', () => {
    catGif.classList.remove('loading')
    gifLoader.style.display = 'none'
})

/* ============================================================
   MUSIC AUTOPLAY
   ============================================================ */
music.muted = true
music.volume = 0.3
music.play().then(() => {
    music.muted = false
}).catch(() => {
    document.addEventListener('click', () => {
        music.muted = false
        music.play().catch(() => { })
    }, { once: true })
})

/* ============================================================
   DYNAMIC HEARTS BACKGROUND
   ============================================================ */
function spawnHearts() {
    const emojis = ['💕', '💗', '💖', '💝', '💓', '🌸', '✨', '🎀']
    const bg = document.getElementById('hearts-bg')
    for (let i = 0; i < 22; i++) {
        const span = document.createElement('span')
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)]
        const size = 0.7 + Math.random() * 1.4
        const left = Math.random() * 100
        const duration = 7 + Math.random() * 10
        const delay = Math.random() * 12
        span.style.cssText = `
            left: ${left}vw;
            font-size: ${size}rem;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `
        bg.appendChild(span)
    }
}
spawnHearts()

/* ============================================================
   TICKER
   ============================================================ */
function buildTicker(reasons) {
    const track = document.getElementById('ticker-track')
    if (!track) return
    // Duplicate for seamless loop
    const all = [...reasons, ...reasons]
    all.forEach(r => {
        const span = document.createElement('span')
        span.className = 'ticker-item'
        span.textContent = `❤️ ${r}`
        track.appendChild(span)
    })
}
buildTicker(tickerReasons)

/* ============================================================
   TOGGLE MUSIC
   ============================================================ */
function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

/* ============================================================
   TOGGLE DARK MODE
   ============================================================ */
function toggleTheme() {
    const html = document.documentElement
    const isDark = html.getAttribute('data-theme') === 'dark'
    html.setAttribute('data-theme', isDark ? 'light' : 'dark')
    document.getElementById('theme-toggle').textContent = isDark ? '🌙' : '☀️'
}

/* ============================================================
   YES BUTTON
   ============================================================ */
function handleYesClick() {
    if (!runAwayEnabled) {
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    // Pass name to yes page
    window.location.href = `yes.html?name=${encodeURIComponent(name)}`
}

/* ============================================================
   TEASE TOAST
   ============================================================ */
function showTeaseMessage(msg) {
    const toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2800)
}

/* ============================================================
   NO BUTTON
   ============================================================ */
function handleNoClick() {
    noClickCount++

    // Cycle guilt-trip messages
    noBtn.textContent = noMessages[Math.min(noClickCount, noMessages.length - 1)]

    // Grow Yes button (capped for mobile)
    const maxFontSize = 40  // px cap
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${Math.min(currentSize * 1.2, maxFontSize)}px`
    const padY = Math.min(18 + noClickCount * 5, 45)
    const padX = Math.min(45 + noClickCount * 10, 90)
    yesBtn.style.padding = `${padY}px ${padX}px`

    // Shrink No button
    if (noClickCount >= 3) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.90, 10)}px`
    }

    // Swap GIF
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // Enable runaway at click 7
    if (noClickCount >= 7 && !runAwayEnabled) {
        enableRunAway()
        runAwayEnabled = true
    }
}

/* ============================================================
   GIF SWAP
   ============================================================ */
function swapGif(src) {
    catGif.classList.add('loading')
    gifLoader.style.display = 'block'
    setTimeout(() => {
        catGif.src = src
        // onload handles removing loading class
    }, 200)
}

/* ============================================================
   NO BUTTON RUNAWAY — debounced, cached dims, mouseenter
   ============================================================ */
let _lastCorner = -1
let _runLocked = false
let _cachedBtnW = 80   // measured once; fallback 80px
let _cachedBtnH = 36   // measured once; fallback 36px

function enableRunAway() {
    // Cache button dimensions NOW (before transitions make offsetWidth unreliable)
    const rect = noBtn.getBoundingClientRect()
    _cachedBtnW = rect.width || noBtn.offsetWidth || 80
    _cachedBtnH = rect.height || noBtn.offsetHeight || 36

    // Smooth slide animation
    noBtn.style.transition = 'left 0.25s ease, top 0.25s ease'

    // Anchor at current screen position before going fixed (no layout jump)
    noBtn.style.position = 'fixed'
    noBtn.style.left = `${rect.left}px`
    noBtn.style.top = `${rect.top}px`
    noBtn.style.zIndex = '50'

    // Use mouseenter (not mouseover) — only fires when cursor enters, not on children
    noBtn.addEventListener('mouseenter', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    // Debounce: ignore if we just moved (prevents cascade when cursor is at destination)
    if (_runLocked) return
    _runLocked = true
    setTimeout(() => { _runLocked = false }, 450)   // > transition (250ms)

    const vw = window.innerWidth
    const vh = window.innerHeight
    const btnW = _cachedBtnW
    const btnH = _cachedBtnH
    const pad = 18
    const ticker = 44   // ticker bar height at bottom

    // Four fixed corners — always outside the centered card
    const corners = [
        { x: 50, y: 50 },               // top-left
        { x: vw - btnW - 5, y: 50 },                   // top-right
        { x: 50, y: vh - ticker - 60 },     // bottom-left
        { x: vw - btnW - 10, y: vh - ticker - 60 } // bottom-right (clear of controls)
    ]

    // Pick any corner except the one we're already at
    let idx
    do { idx = Math.floor(Math.random() * corners.length) }
    while (idx === _lastCorner)
    _lastCorner = idx

    noBtn.style.left = `${corners[idx].x}px`
    noBtn.style.top = `${corners[idx].y}px`
}
