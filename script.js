// ============================================
// GLOBAL VARIABLES
// ============================================

const BIRTHDAY_MESSAGE = `Happy Birthday! 🎂✨

May your special day be filled with endless joy, laughter, love, and unforgettable memories. May all your dreams come true and every new year bring you happiness, success, and beautiful moments. Keep smiling and shining just the way you always do. Wishing you a life full of blessings and wonderful adventures.

Have an amazing birthday! ❤️🎉`;

let isAudioPlaying = false;
let candlesBlown = 0;
const totalCandles = 5;

// ============================================
// SCREEN MANAGEMENT
// ============================================

/**
 * Switch between screens with smooth fade transition
 */
function switchScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

/**
 * Start the celebration from opening screen
 */
function startCelebration() {
    switchScreen('celebrationScene');
    setTimeout(() => {
        initializeParticles();
        autoPlayAudio();
    }, 500);
}

/**
 * Open surprise directly to envelope
 */
function openSurprise() {
    switchScreen('envelopeScreen');
    setTimeout(() => {
        initializeLetter();
        createFloatingParticles();
    }, 800);
}

// ============================================
// AUDIO MANAGEMENT
// ============================================

/**
 * Toggle background music on/off
 */
function toggleAudio() {
    const audio = document.getElementById('birthdayMusic');
    const btn = document.getElementById('audioToggle');
    
    if (isAudioPlaying) {
        audio.pause();
        btn.textContent = '🔇 Music';
        isAudioPlaying = false;
    } else {
        audio.play().catch(e => {
            console.log('Audio autoplay prevented:', e);
        });
        btn.textContent = '🔊 Music';
        isAudioPlaying = true;
    }
}

/**
 * Automatically play audio when entering celebration scene
 */
function autoPlayAudio() {
    const audio = document.getElementById('birthdayMusic');
    audio.currentTime = 0;
    
    // Try to play with user interaction fallback
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            // Autoplay prevented - user will need to click
            console.log('Autoplay prevented, waiting for user interaction');
        });
    }
    
    isAudioPlaying = true;
    document.getElementById('audioToggle').textContent = '🔊 Music';
}

// ============================================
// CONFETTI & FIREWORKS
// ============================================

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 15;
        this.vy = (Math.random() - 0.5) * 15 - 5;
        this.gravity = 0.3;
        this.life = 1;
        this.decay = Math.random() * 0.01 + 0.015;
        
        // Random particle type
        const types = ['confetti', 'star', 'circle'];
        this.type = types[Math.floor(Math.random() * types.length)];
        
        // Colors for different particle types
        const colors = [
            '#ff1744', '#f50057', '#d500f9', '#651fff',
            '#2979f3', '#2196f3', '#00bcd4', '#009688',
            '#4caf50', '#8bc34a', '#fdd835', '#ffb300'
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        
        if (this.type === 'confetti') {
            ctx.fillRect(this.x, this.y, 4, 4);
        } else if (this.type === 'star') {
            this.drawStar(ctx, this.x, this.y, 3, 6, 2);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let step = Math.PI / spikes;
        let x = cx;
        let y = cy;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes * 2; i++) {
            let radius = i % 2 == 0 ? outerRadius : innerRadius;
            x = cx + Math.cos(i * step - Math.PI / 2) * radius;
            y = cy + Math.sin(i * step - Math.PI / 2) * radius;
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    }
}

let particles = [];

/**
 * Initialize particle animation for celebration scene
 */
function initializeParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create continuous confetti at the start
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height - canvas.height
        ));
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw(ctx);
            
            // Remove dead particles
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }
        
        // Continue animation if particles exist
        if (particles.length > 0) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

/**
 * Launch massive fireworks when candles are blown out
 */
function launchFireworks() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Create explosion of particles
    for (let i = 0; i < 150; i++) {
        particles.push(new Particle(
            window.innerWidth / 2,
            window.innerHeight / 2
        ));
    }
    
    // Create additional explosions at random points
    for (let burst = 0; burst < 3; burst++) {
        setTimeout(() => {
            for (let i = 0; i < 80; i++) {
                particles.push(new Particle(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight
                ));
            }
        }, burst * 200);
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw(ctx);
            
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }
        
        if (particles.length > 0) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// ============================================
// CANDLE BLOWING ANIMATION
// ============================================

/**
 * Start the candle blowing animation
 */
function startBlowAnimation() {
    const btn = document.getElementById('blowBtn');
    btn.disabled = true;
    btn.textContent = '🌪️ Blowing...';
    
    // Simulate blowing animation
    blowOutCandles();
}

/**
 * Blow out all candles with animation
 */
function blowOutCandles() {
    let candleIndex = 0;
    
    function extinguishNextCandle() {
        if (candleIndex < totalCandles) {
            const flame = document.getElementById(`flame-${candleIndex}`);
            if (flame) {
                // Add smoke effect
                flame.classList.add('smoke');
                
                // Extinguish flame
                setTimeout(() => {
                    flame.classList.add('extinguish');
                    candlesBlown++;
                }, 100);
            }
            
            candleIndex++;
            setTimeout(extinguishNextCandle, 150);
        } else {
            // All candles blown out - launch celebration
            setTimeout(() => {
                launchFireworks();
                setTimeout(() => {
                    switchScreen('envelopeScreen');
                    initializeLetter();
                    createFloatingParticles();
                }, 1500);
            }, 500);
        }
    }
    
    extinguishNextCandle();
}

// ============================================
// ENVELOPE & LETTER ANIMATION
// ============================================

/**
 * Initialize the love letter with typewriter effect
 */
function initializeLetter() {
    const letterText = document.getElementById('letterText');
    if (!letterText) return;
    
    letterText.textContent = ''; // Clear any existing text
    
    // Type out message with typewriter effect
    typeMessage(BIRTHDAY_MESSAGE, letterText, () => {
        // After typing, add button to proceed
        setTimeout(() => {
            addProceedButton();
        }, 500);
    });
}

/**
 * Typewriter effect for the message
 */
function typeMessage(message, element, callback) {
    let index = 0;
    
    function type() {
        if (index < message.length) {
            const char = message[index];
            element.textContent += char;
            
            // Adjust speed based on character
            let delay = 20;
            if (char === '\n') delay = 100;
            if (char === '.' || char === '!' || char === '?') delay = 100;
            
            index++;
            setTimeout(type, delay);
        } else if (callback) {
            callback();
        }
    }
    
    type();
}

/**
 * Add a button to proceed to final celebration
 */
function addProceedButton() {
    const letterContent = document.querySelector('.letter-content');
    if (!letterContent || letterContent.querySelector('.proceed-btn')) return;
    
    const btn = document.createElement('button');
    btn.className = 'proceed-btn';
    btn.textContent = '✨ Continue ✨';
    btn.onclick = () => {
        switchScreen('finalScreen');
        initializeFinalCelebration();
    };
    
    letterContent.appendChild(btn);
}

// ============================================
// FINAL CELEBRATION
// ============================================

/**
 * Initialize final celebration with particle effects
 */
function initializeFinalCelebration() {
    const canvas = document.getElementById('finalParticles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const finalParticles = [];
    
    class FinalParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 2;
            this.speedX = (Math.random() - 0.5) * 3;
            this.speedY = (Math.random() - 0.5) * 3;
            this.opacity = Math.random() * 0.5 + 0.5;
            
            const emojis = ['✨', '💫', '⭐', '❤️', '🎉'];
            this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= 0.003;
            
            // Bounce off walls
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.font = this.size * 10 + 'px Arial';
            ctx.fillText(this.emoji, this.x, this.y);
            ctx.restore();
        }
    }
    
    // Create initial particles
    for (let i = 0; i < 30; i++) {
        finalParticles.push(new FinalParticle());
    }
    
    // Continuously add new particles
    const particleInterval = setInterval(() => {
        if (finalParticles.length < 50) {
            finalParticles.push(new FinalParticle());
        }
    }, 300);
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = finalParticles.length - 1; i >= 0; i--) {
            finalParticles[i].update();
            finalParticles[i].draw(ctx);
            
            if (finalParticles[i].opacity <= 0) {
                finalParticles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Clear interval when screen changes
    setTimeout(() => {
        if (!document.getElementById('finalScreen').classList.contains('active')) {
            clearInterval(particleInterval);
        }
    }, 100);
}

// ============================================
// FLOATING PARTICLES FOR ENVELOPE SCREEN
// ============================================

/**
 * Create floating particles around envelope
 */
function createFloatingParticles() {
    const container = document.querySelector('.floating-particles');
    if (!container) return;
    
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, #ffd700 0%, #ffed4e 100%);
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${3 + Math.random() * 3}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        
        container.appendChild(particle);
    }
}

// ============================================
// WINDOW RESIZE HANDLER
// ============================================

window.addEventListener('resize', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    const finalCanvas = document.getElementById('finalParticles');
    if (finalCanvas) {
        finalCanvas.width = window.innerWidth;
        finalCanvas.height = window.innerHeight;
    }
});

// ============================================
// INITIALIZATION
// ============================================

// Add floating particle animation to styles
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0%, 100% {
            opacity: 0.3;
            transform: translate(0, 0);
        }
        50% {
            opacity: 1;
            transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px);
        }
    }
    
    .proceed-btn {
        margin-top: 1.5rem;
        padding: 0.7rem 1.5rem;
        background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
        color: #333;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 700;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        width: 100%;
    }
    
    .proceed-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
    }
    
    .proceed-btn:active {
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

console.log('🎉 Birthday website loaded successfully!');