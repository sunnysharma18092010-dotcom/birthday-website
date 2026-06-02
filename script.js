// Start celebration
function startCelebration() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const celebrationScreen = document.getElementById('celebrationScreen');
    
    welcomeScreen.classList.add('hidden');
    celebrationScreen.classList.remove('hidden');
    
    // Create balloons
    createBalloons();
    
    // Create lights
    createLights();
}

// Create floating balloons
function createBalloons() {
    const container = document.querySelector('.balloons-container');
    const balloonColors = ['balloon-red', 'balloon-yellow', 'balloon-blue', 'balloon-pink'];
    
    for (let i = 0; i < 15; i++) {
        const balloon = document.createElement('div');
        balloon.className = `balloon ${balloonColors[Math.floor(Math.random() * balloonColors.length)]}`;
        
        const randomLeft = Math.random() * 100;
        const randomDelay = Math.random() * 2;
        const randomDuration = 4 + Math.random() * 3;
        
        balloon.style.left = randomLeft + '%';
        balloon.style.animation = `float ${randomDuration}s linear ${randomDelay}s infinite`;
        
        container.appendChild(balloon);
    }
}

// Create blinking lights
function createLights() {
    const container = document.querySelector('.lights-container');
    const lightColors = ['#ff1744', '#FFD700', '#00ff00', '#00f2fe', '#f093fb', '#ff6b00'];
    
    for (let i = 0; i < 6; i++) {
        const light = document.createElement('div');
        light.className = `light light-${i + 1}`;
        container.appendChild(light);
    }
}

// Extinguish candles
function extinguishCandles() {
    const candles = document.querySelectorAll('.candle');
    
    // Create blow wind effect
    createWindEffect();
    
    // Extinguish each candle with delay
    candles.forEach((candle, index) => {
        setTimeout(() => {
            candle.classList.add('blown');
            createSmokeEffect();
        }, index * 200);
    });
    
    // Show celebration message and confetti
    setTimeout(() => {
        createConfetti();
        playSound();
    }, 1000);
}

// Wind effect animation
function createWindEffect() {
    const cake = document.querySelector('.cake-container');
    cake.style.animation = 'cakeBounce 0.3s ease-in-out';
    
    setTimeout(() => {
        cake.style.animation = 'cakeBounce 2s ease-in-out infinite';
    }, 300);
}

// Smoke effect
function createSmokeEffect() {
    const cakeContainer = document.querySelector('.cake-container');
    
    for (let i = 0; i < 3; i++) {
        const smoke = document.createElement('div');
        smoke.style.position = 'absolute';
        smoke.style.width = '20px';
        smoke.style.height = '20px';
        smoke.style.background = 'radial-gradient(circle, rgba(200,200,200,0.8), rgba(200,200,200,0))';
        smoke.style.borderRadius = '50%';
        smoke.style.top = '50px';
        smoke.style.left = (50 + (i - 1) * 30) + 'px';
        smoke.style.animation = `float 1.5s ease-out forwards`;
        smoke.style.pointerEvents = 'none';
        
        cakeContainer.appendChild(smoke);
        
        setTimeout(() => smoke.remove(), 1500);
    }
}

// Create confetti
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const confettiColors = ['#FFD700', '#ff1744', '#00f2fe', '#f093fb', '#00ff00', '#FFA500'];
    
    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const startX = window.innerWidth / 2;
        const startY = window.innerHeight / 2;
        
        const randomX = (Math.random() - 0.5) * 600;
        const randomY = Math.random() * -400;
        
        const randomColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        
        confetti.style.left = startX + 'px';
        confetti.style.top = startY + 'px';
        confetti.style.background = randomColor;
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.boxShadow = `0 0 10px ${randomColor}`;
        
        container.appendChild(confetti);
        
        // Animate confetti
        let x = startX;
        let y = startY;
        let vx = (Math.random() - 0.5) * 8;
        let vy = (Math.random() - 0.5) * 8 - 4;
        let rotation = 0;
        let rotationSpeed = (Math.random() - 0.5) * 10;
        
        const animate = () => {
            x += vx;
            y += vy;
            vy += 0.1; // gravity
            rotation += rotationSpeed;
            
            confetti.style.left = x + 'px';
            confetti.style.top = y + 'px';
            confetti.style.transform = `rotate(${rotation}deg)`;
            confetti.style.opacity = Math.max(0, 1 - (y - startY) / 300);
            
            if (y < window.innerHeight + 100) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };
        
        animate();
    }
}

// Play celebration sound
function playSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        
        // Beep sequence
        const frequencies = [523.25, 659.25, 783.99]; // C, E, G notes
        
        frequencies.forEach((freq, index) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.frequency.value = freq;
            osc.type = 'sine';
            
            const startTime = now + (index * 0.2);
            const endTime = startTime + 0.15;
            
            gain.setValueAtTime(0.3, startTime);
            gain.exponentialRampToValueAtTime(0.01, endTime);
            
            osc.start(startTime);
            osc.stop(endTime);
        });
    } catch (e) {
        console.log('Audio not available');
    }
}

// Mobile detection for better interaction
document.addEventListener('DOMContentLoaded', () => {
    const blowArea = document.querySelector('.blow-area');
    
    // Add touch support for mobile
    if (blowArea) {
        blowArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            extinguishCandles();
        });
    }
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            if (!document.getElementById('welcomeScreen').classList.contains('hidden')) {
                startCelebration();
            } else if (!document.getElementById('celebrationScreen').classList.contains('hidden')) {
                extinguishCandles();
            }
        }
    });
});