// --- AUDIO ---
const bgAudio = document.getElementById("bgAudio");
const muteIcon = document.getElementById("muteIcon");
const volumeSlider = document.getElementById("volumeSlider");
const vinylProgress = document.getElementById("vinylProgress");

function forcePlayAudio() {
    if (!bgAudio) return;
    bgAudio.muted = false;
    bgAudio.volume = 1;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            if (muteIcon) muteIcon.className = "fa-solid fa-volume-high";
            if (volumeSlider) {
                volumeSlider.value = 1;
                volumeSlider.style.setProperty('--val', '100%');
            }
        }).catch(() => {
            if (muteIcon) muteIcon.className = "fa-solid fa-volume-xmark";
        });
    }
}
forcePlayAudio();
['click', 'touchstart', 'keydown', 'mousemove', 'scroll', 'wheel'].forEach(evt => {
    window.addEventListener(evt, () => { if (bgAudio && bgAudio.paused) forcePlayAudio(); });
});

if (volumeSlider) {
    volumeSlider.style.setProperty('--val', (volumeSlider.value * 100) + '%');
    volumeSlider.addEventListener("input", (e) => {
        const val = e.target.value;
        if (bgAudio) bgAudio.volume = val;
        volumeSlider.style.setProperty('--val', (val * 100) + '%');
        if (val == 0) {
            if (bgAudio) bgAudio.muted = true;
            if (muteIcon) muteIcon.className = "fa-solid fa-volume-xmark";
        } else {
            if (bgAudio) bgAudio.muted = false;
            if (bgAudio) bgAudio.play().catch(()=>{});
            if (muteIcon) muteIcon.className = "fa-solid fa-volume-high";
        }
    });
}

function toggleMute() {
    if (!bgAudio) return;
    if (bgAudio.muted || bgAudio.volume === 0) {
        bgAudio.muted = false; bgAudio.volume = 1;
        if (volumeSlider) { volumeSlider.value = 1; volumeSlider.style.setProperty('--val', '100%'); }
        if (muteIcon) muteIcon.className = "fa-solid fa-volume-high";
        bgAudio.play().catch(()=>{});
    } else {
        bgAudio.muted = true;
        if (volumeSlider) { volumeSlider.value = 0; volumeSlider.style.setProperty('--val', '0%'); }
        if (muteIcon) muteIcon.className = "fa-solid fa-volume-xmark";
    }
}
const muteBtn = document.getElementById("muteBtn");
if (muteBtn) muteBtn.addEventListener("click", toggleMute);

if (bgAudio && vinylProgress) {
    bgAudio.addEventListener('timeupdate', () => {
        if (bgAudio.duration) {
            const percent = (bgAudio.currentTime / bgAudio.duration) * 100;
            vinylProgress.style.setProperty('--progress', percent + "%");
        }
    });
}

// --- NOW PLAYING WIDGET (Klik na mobile) ---
const nowPlayingWidget = document.getElementById("nowPlayingWidget");
if (nowPlayingWidget) {
    nowPlayingWidget.addEventListener('click', (e) => {
        // Na mobile (bez hovera) rozwijamy po kliknięciu
        if (window.innerWidth <= 768) {
            nowPlayingWidget.classList.toggle('active');
            e.stopPropagation(); // Zapobiega natychmiastowemu zamknięciu
        }
    });
}
// Zamykanie po kliknięciu obok
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && nowPlayingWidget && nowPlayingWidget.classList.contains('active') && !nowPlayingWidget.contains(e.target)) {
        nowPlayingWidget.classList.remove('active');
    }
});

// --- TYPEWRITER ---
const words = ["Szyszkens", "Ryszkens", "Chuj cię to", "𝓘𝓯 𝓘 𝔀𝓪𝓼 𝓽𝓱𝓮 𝓶𝓸𝓸𝓷 𝔀𝓸𝓾𝓵𝓭 𝔂𝓸𝓾 𝓼𝓽𝓲𝓵𝓵 𝓵𝓸𝓸𝓴 𝓯𝓸𝓻 𝓽𝓱𝓮 𝓼𝓽𝓪𝓻𝓼?"];
let wordIndex = 0, charIndex = 0, isDeleting = false;
const typewriterElement = document.getElementById("typewriter");
function typeEffect() {
    if (!typewriterElement) return;
    const currentWord = words[wordIndex];
    if (isDeleting) { typewriterElement.textContent = currentWord.substring(0, charIndex - 1); charIndex--; }
    else { typewriterElement.textContent = currentWord.substring(0, charIndex + 1); charIndex++; }
    let typeSpeed = isDeleting ? 40 : 80;
    if (!isDeleting && charIndex === currentWord.length) { typeSpeed = 2000; isDeleting = true; }
    else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; typeSpeed = 400; }
    setTimeout(typeEffect, typeSpeed);
}
typeEffect();



// --- LANYARD ---
const DISCORD_ID = "1014641968938225756";
async function fetchDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await response.json(); if (!json.success) return;
        const statusDot = document.getElementById("discordStatusDot");
        if (statusDot) statusDot.className = `status-dot ${json.data.discord_status}`;
    } catch (e) {}
}
fetchDiscordStatus(); setInterval(fetchDiscordStatus, 10000);

// --- EFEKTY TYLKO NA KOMPUTER (3D Tilt, Spotlight, Magnetyczne) ---
const contentCard = document.querySelector('.content');
const spotlight = document.getElementById("cursorSpotlight");

if (window.innerWidth > 768) {
    // 3D Tilt
    if (contentCard) {
        document.addEventListener('mousemove', (e) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
            const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
            contentCard.style.transform = `rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
            const rect = contentCard.getBoundingClientRect();
            contentCard.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
            contentCard.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
        });
        document.addEventListener('mouseleave', () => { contentCard.style.transform = `rotateX(0deg) rotateY(0deg)`; });
    }

    // Spotlight
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2, spotX = mouseX, spotY = mouseY;
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    function updateSpotlight() {
        spotX += (mouseX - spotX) * 0.15; spotY += (mouseY - spotY) * 0.15;
        if (spotlight) spotlight.style.transform = `translate(${spotX}px, ${spotY}px) translate(-50%, -50%)`;
        requestAnimationFrame(updateSpotlight);
    }
    if (spotlight) updateSpotlight();

    // Magnetyczne przyciski
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
}

// --- CZĄSTECZKI (Działają wszędzie, ale mniej na mobile) ---
const canvas = document.getElementById('particles'); const ctx = canvas.getContext('2d');
let particles = []; let pMouse = { x: -1000, y: -1000 };
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas(); window.addEventListener('resize', resizeCanvas);
class Particle {
    constructor() { this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height; this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3; this.size = Math.random() * 1.5 + 0.5; this.baseOpacity = Math.random() * 0.5 + 0.15; this.opacity = this.baseOpacity; }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0) this.x = canvas.width; if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height; if (this.y > canvas.height) this.y = 0;
        const dx = this.x - pMouse.x; const dy = this.y - pMouse.y; const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) { this.opacity = this.baseOpacity + (1 - dist / 150) * 0.6; } else { this.opacity += (this.baseOpacity - this.opacity) * 0.05; }
    }
    draw() { ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
}
if (canvas) {
    const particleCount = window.innerWidth <= 768 ? 30 : 90;
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    document.addEventListener('mousemove', (e) => { pMouse.x = e.clientX; pMouse.y = e.clientY; });
    (function animateParticles() { ctx.clearRect(0, 0, canvas.width, canvas.height); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animateParticles); })();
}

// --- RIPPLE ---
document.addEventListener('click', (e) => {
    const ripple = document.createElement('div'); ripple.className = 'click-ripple';
    ripple.style.left = e.clientX + 'px'; ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple); setTimeout(() => ripple.remove(), 950);
});

// --- EASTER EGG ---
let audioCtx = null; let avatarClickCount = 0, lastAvatarClick = 0;
const avatarWrapper = document.querySelector('.avatar-wrapper');
function playGlitchAudioEffect() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const bufferSize = audioCtx.sampleRate * 0.35; const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate); const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = audioCtx.createBufferSource(); noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
        const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.08, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        noise.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination); noise.start();
    } catch (e) {}
}
if (avatarWrapper) {
    avatarWrapper.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastAvatarClick < 400) avatarClickCount++; else avatarClickCount = 1;
        lastAvatarClick = now;
        if (avatarClickCount >= 5) {
            avatarClickCount = 0; avatarWrapper.classList.add('glitch-active'); playGlitchAudioEffect();
            setTimeout(() => avatarWrapper.classList.remove('glitch-active'), 1800);
        }
    });
}
