/* ============================================================
   YES PAGE SCRIPT
   ============================================================ */

let musicPlaying = false

/* ============================================================
   TICKER REASONS
   ============================================================ */
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
   ON LOAD
   ============================================================ */
window.addEventListener('load', () => {
    readNameParam()
    spawnHearts()
    buildTicker()
    startCountdown()
    setupCarousel()
    launchConfetti()

    // Autoplay music (works since user just clicked Yes)
    const music = document.getElementById('bg-music')
    music.volume = 0.3
    music.play().catch(() => {})
    musicPlaying = true
    document.getElementById('music-toggle').textContent = '🔊'
})

/* ============================================================
   NAME FROM URL PARAM
   ============================================================ */
function readNameParam() {
    const params = new URLSearchParams(window.location.search)
    const name   = params.get('name') || 'you'

    document.getElementById('yes-title').textContent    = `Knew you'd say Yes, ${name}! 🎉`
    document.getElementById('yes-message').textContent  = `You just made me the happiest person, ${name}! 💕`
    document.getElementById('letter-greeting').textContent = `Dear ${name},`
    document.title = `You said Yes! 🎉`
}

/* ============================================================
   DYNAMIC HEARTS BACKGROUND
   ============================================================ */
function spawnHearts() {
    const emojis = ['💕', '💗', '💖', '💝', '💓', '🌸', '✨', '🎉', '🎀']
    const bg = document.getElementById('hearts-bg')
    for (let i = 0; i < 24; i++) {
        const span = document.createElement('span')
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)]
        const size     = 0.7 + Math.random() * 1.6
        const duration = 6 + Math.random() * 10
        const delay    = Math.random() * 10
        span.style.cssText = `
            left: ${Math.random() * 100}vw;
            font-size: ${size}rem;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
        `
        bg.appendChild(span)
    }
}

/* ============================================================
   TICKER
   ============================================================ */
function buildTicker() {
    const track = document.getElementById('ticker-track')
    if (!track) return
    const all = [...tickerReasons, ...tickerReasons]
    all.forEach(r => {
        const span = document.createElement('span')
        span.className = 'ticker-item'
        span.textContent = `❤️ ${r}`
        track.appendChild(span)
    })
}

/* ============================================================
   COUNTDOWN TIMER
   ============================================================ */
function startCountdown() {
    const start = Date.now()
    const el    = document.getElementById('countdown-text')
    function tick() {
        const secs = Math.floor((Date.now() - start) / 1000)
        const mins = Math.floor(secs / 60)
        const hrs  = Math.floor(mins / 60)

        let label
        if (hrs > 0)       label = `${hrs}h ${mins % 60}m`
        else if (mins > 0) label = `${mins} minute${mins !== 1 ? 's' : ''}`
        else               label = `${secs} second${secs !== 1 ? 's' : ''}`

        el.textContent = `You've made me happy for ${label} 💖`
        requestAnimationFrame(tick)
    }
    tick()
}

/* ============================================================
   ENVELOPE REVEAL
   ============================================================ */
let envelopeOpened = false

function openEnvelope() {
    if (envelopeOpened) return
    envelopeOpened = true

    const envelope = document.getElementById('envelope')
    const hint     = document.getElementById('envelope-hint')
    const letter   = document.getElementById('letter-card')

    envelope.classList.add('opened')
    hint.style.display = 'none'

    setTimeout(() => {
        letter.style.display = 'block'
    }, 500)
}

/* ============================================================
   MEMORIES CAROUSEL
   ============================================================ */
let currentSlide = 0
let carouselInterval = null

function setupCarousel() {
    const track  = document.getElementById('carousel-track')
    const dotsEl = document.getElementById('carousel-dots')
    const slides = track.querySelectorAll('.memory-slide')
    const total  = slides.length

    // Build dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button')
        dot.className = `dot ${i === 0 ? 'active' : ''}`
        dot.setAttribute('aria-label', `Slide ${i + 1}`)
        dot.addEventListener('click', () => goToSlide(i))
        dotsEl.appendChild(dot)
    })

    function goToSlide(index) {
        currentSlide = index
        track.style.transform = `translateX(-${index * 100}%)`
        dotsEl.querySelectorAll('.dot').forEach((d, i) =>
            d.classList.toggle('active', i === index)
        )
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % total)
    }

    // Auto-advance every 3.5s
    carouselInterval = setInterval(nextSlide, 3500)

    // Pause on hover
    track.parentElement.addEventListener('mouseenter', () => clearInterval(carouselInterval))
    track.parentElement.addEventListener('mouseleave', () => {
        clearInterval(carouselInterval)
        carouselInterval = setInterval(nextSlide, 3500)
    })

    // Touch swipe support
    let touchStartX = 0
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX }, { passive: true })
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX
        if (Math.abs(diff) > 40) goToSlide(diff > 0
            ? (currentSlide + 1) % total
            : (currentSlide - 1 + total) % total)
    })
}

/* ============================================================
   SHARE BUTTON — Web Share API
   ============================================================ */
async function shareIt() {
    const shareData = {
        title: 'We said Yes! 💕',
        text:  'Something special just happened 💕',
        url:   window.location.href
    }

    try {
        if (navigator.share) {
            await navigator.share(shareData)
        } else {
            await navigator.clipboard.writeText(window.location.href)
            const btn = document.getElementById('share-btn')
            const original = btn.textContent
            btn.textContent = '✅ Link copied!'
            setTimeout(() => { btn.textContent = original }, 2000)
        }
    } catch (_) {}
}

/* ============================================================
   CONFETTI
   ============================================================ */
function launchConfetti() {
    const colors  = ['#ff69b4','#ff1493','#ff85a2','#ffb3c1','#ff0000','#ff6347','#fff','#ffdf00']
    const end     = Date.now() + 6000

    confetti({ particleCount: 150, spread: 100, origin: { x: 0.5, y: 0.3 }, colors })

    const interval = setInterval(() => {
        if (Date.now() > end) { clearInterval(interval); return }
        confetti({ particleCount: 40, angle: 60,  spread: 55, origin: { x: 0, y: 0.6 }, colors })
        confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors })
    }, 300)
}

/* ============================================================
   MUSIC TOGGLE
   ============================================================ */
function toggleMusic() {
    const music = document.getElementById('bg-music')
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

/* ============================================================
   DARK MODE TOGGLE
   ============================================================ */
function toggleTheme() {
    const html   = document.documentElement
    const isDark = html.getAttribute('data-theme') === 'dark'
    html.setAttribute('data-theme', isDark ? 'light' : 'dark')
    document.getElementById('theme-toggle').textContent = isDark ? '🌙' : '☀️'
}
