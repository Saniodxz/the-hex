/* ========================================
   THE HEX — Valentine's Day Experience
   State Machine & Interactions
   ======================================== */

// === State ===
let state = 0;        // 0=loading, 1=stage1, 2=stage2, 3=stage3
let noClickCount = 0;
let staticAnimId = null;
let particleTimer = null;
let heartTimer = null;
let sparkleTimer = null;

// === DOM References ===
const $ = (id) => document.getElementById(id);

const body           = document.body;
const loadingScreen  = $('loading-screen');
const broadcastText  = $('broadcast-text');
const staticCanvas   = $('static-canvas');
const glitchOverlay  = $('glitch-overlay');
const magicBurst     = $('magic-burst');
const content        = $('content');
const titleEl        = $('title');
const subtitleEl     = $('subtitle');
const yesBtn         = $('yes-btn');
const noBtn          = $('no-btn');
const buttonContainer = $('button-container');
const finalScreen    = $('final-screen');
const confirmedBtn   = $('confirmed-btn');
const particlesEl    = $('particles');
const heartsEl       = $('hearts-container');
const sparklesEl     = $('sparkles');
const crackSvg       = $('crack-svg');

// === Initialize ===
init();

function init() {
    setupStaticNoise();
    typewriter('Broadcasting live from Westview\u2026', broadcastText, 55, function() {
        setTimeout(function() {
            loadingScreen.classList.add('fade-out');
            setTimeout(function() {
                loadingScreen.style.display = 'none';
                enterStage1();
            }, 1200);
        }, 1500);
    });

    yesBtn.addEventListener('click', handleYes);
    noBtn.addEventListener('click', handleNo);
    confirmedBtn.addEventListener('click', handleConfirmed);
}

// === Typewriter Effect ===
function typewriter(text, element, speed, callback) {
    var i = 0;
    element.textContent = '';
    function tick() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(tick, speed);
        } else if (callback) {
            callback();
        }
    }
    tick();
}

// === TV Static Noise (Canvas) ===
function setupStaticNoise() {
    var ctx = staticCanvas.getContext('2d');
    var w = 128;
    var h = 128;
    staticCanvas.width = w;
    staticCanvas.height = h;

    function render() {
        var imageData = ctx.createImageData(w, h);
        var d = imageData.data;
        for (var i = 0; i < d.length; i += 4) {
            var v = (Math.random() * 255) | 0;
            d[i] = v;
            d[i + 1] = v;
            d[i + 2] = v;
            d[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
        staticAnimId = requestAnimationFrame(render);
    }
    render();
}

function stopStatic() {
    if (staticAnimId) {
        cancelAnimationFrame(staticAnimId);
        staticAnimId = null;
    }
}

// === Stage Transitions ===
function enterStage1() {
    state = 1;
    body.className = 'stage-1';

    titleEl.textContent = 'Hag\u2026';
    subtitleEl.textContent = 'Will you be my Valentine?';
    yesBtn.textContent = 'YES \u2764\uFE0F';
    yesBtn.style.display = '';
    noBtn.textContent = 'No.';
    noBtn.style.display = '';
    noBtn.className = 'btn btn-no';
    noBtn.style.position = '';
    noBtn.style.left = '';
    noBtn.style.top = '';
    noBtn.style.transform = '';
    content.style.opacity = '1';
    noClickCount = 0;
}

function enterStage2() {
    state = 2;
    body.className = 'stage-2';
    stopStatic();

    titleEl.textContent = 'Hag\u2026';
    subtitleEl.textContent = 'Are you absolutely certain, Hag?';
    yesBtn.textContent = 'Yes, obviously.';
    noBtn.textContent = "I\u2019m reconsidering\u2026";
    noBtn.className = 'btn btn-no';
    noBtn.style.position = '';
    noBtn.style.left = '';
    noBtn.style.top = '';
    noBtn.style.transform = '';
    noBtn.style.display = '';
    content.style.opacity = '1';
    noClickCount = 0;

    generateCracks();
}

function enterStage3() {
    state = 3;
    body.className = 'stage-3';

    titleEl.textContent = 'Hag\u2026';
    subtitleEl.textContent = 'So you choose this reality\u2026 with me?';
    yesBtn.textContent = 'YES \u2764\uFE0F';
    noBtn.style.display = 'none';
    content.style.opacity = '1';

    startParticles();
}

// === YES Handler ===
function handleYes() {
    switch (state) {
        case 1:
            triggerGlitch();
            setTimeout(enterStage2, 500);
            break;
        case 2:
            triggerRedPulse();
            setTimeout(enterStage3, 800);
            break;
        case 3:
            yesBtn.disabled = true;
            triggerFinalSequence();
            break;
    }
}

// === NO Handler ===
function handleNo() {
    // Stage 2: "I'm reconsidering..."
    if (state === 2) {
        triggerGlitch();
        triggerFlicker();
        // Brief glitch, stays on Stage 2
        return;
    }

    // Stage 1: Escalating resistance
    noClickCount++;

    switch (noClickCount) {
        case 1:
            teleportNoBtn();
            noBtn.classList.add('teleporting');
            triggerGlitch();
            subtitleEl.textContent = "That wasn\u2019t in the script.";
            break;
        case 2:
            teleportNoBtn();
            noBtn.classList.add('shrinking');
            triggerFlicker();
            subtitleEl.textContent = "We don\u2019t do that here.";
            break;
        case 3:
            teleportNoBtn();
            triggerGlitch();
            subtitleEl.textContent = "Reality can be\u2026 adjusted.";
            break;
        default:
            noBtn.classList.add('fade-away');
            subtitleEl.textContent = 'Will you be my Valentine?';
            setTimeout(function() {
                noBtn.style.display = 'none';
            }, 1300);
            break;
    }
}

function teleportNoBtn() {
    var pad = 20;
    var btnW = 180;
    var btnH = 50;
    var maxX = window.innerWidth - btnW - pad;
    var maxY = window.innerHeight - btnH - pad;
    var x = pad + Math.random() * maxX;
    var y = pad + Math.random() * maxY;
    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
    noBtn.style.zIndex = '25';
}

// === Glitch & Flicker Effects ===
function triggerGlitch() {
    glitchOverlay.className = '';
    void glitchOverlay.offsetWidth; // force reflow
    glitchOverlay.classList.add('active');
    setTimeout(function() { glitchOverlay.className = ''; }, 400);
}

function triggerFlicker() {
    body.classList.add('flickering');
    setTimeout(function() { body.classList.remove('flickering'); }, 600);
}

function triggerRedPulse() {
    glitchOverlay.className = '';
    void glitchOverlay.offsetWidth;
    glitchOverlay.classList.add('red-flash');
    setTimeout(function() { glitchOverlay.className = ''; }, 900);
}

// === Crack Overlay (SVG) ===
function generateCracks() {
    crackSvg.innerHTML = '';
    var cx = window.innerWidth / 2;
    var cy = window.innerHeight / 2;
    var numRays = 14;

    for (var i = 0; i < numRays; i++) {
        var angle = (Math.PI * 2 / numRays) * i + (Math.random() - 0.5) * 0.4;
        var len = 150 + Math.random() * Math.min(cx, cy);
        var endX = cx + Math.cos(angle) * len;
        var endY = cy + Math.sin(angle) * len;

        // Jagged main crack using polyline
        var points = cx + ',' + cy;
        var segments = 4 + Math.floor(Math.random() * 4);
        for (var s = 1; s <= segments; s++) {
            var t = s / segments;
            var px = cx + (endX - cx) * t + (Math.random() - 0.5) * 20;
            var py = cy + (endY - cy) * t + (Math.random() - 0.5) * 20;
            points += ' ' + px + ',' + py;
        }

        var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', points);
        polyline.setAttribute('stroke', '#8B0000');
        polyline.setAttribute('stroke-width', '1.5');
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('opacity', '0.5');
        crackSvg.appendChild(polyline);

        // Branch cracks
        var branches = 1 + Math.floor(Math.random() * 3);
        for (var b = 0; b < branches; b++) {
            var bt = 0.25 + Math.random() * 0.6;
            var bx = cx + (endX - cx) * bt;
            var by = cy + (endY - cy) * bt;
            var bAngle = angle + (Math.random() - 0.5) * 1.5;
            var bLen = 20 + Math.random() * 70;
            var bEndX = bx + Math.cos(bAngle) * bLen;
            var bEndY = by + Math.sin(bAngle) * bLen;

            var branch = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            branch.setAttribute('x1', bx);
            branch.setAttribute('y1', by);
            branch.setAttribute('x2', bEndX);
            branch.setAttribute('y2', bEndY);
            branch.setAttribute('stroke', '#B11226');
            branch.setAttribute('stroke-width', '1');
            branch.setAttribute('opacity', '0.35');
            crackSvg.appendChild(branch);
        }
    }
}

// === Floating Particles (Stage 3) ===
function startParticles() {
    if (particleTimer) return;
    particleTimer = setInterval(createParticle, 250);
}

function stopParticles() {
    if (particleTimer) {
        clearInterval(particleTimer);
        particleTimer = null;
    }
}

function createParticle() {
    var el = document.createElement('div');
    el.className = 'particle';
    var dur = 4 + Math.random() * 5;
    var size = 2 + Math.random() * 5;
    el.style.setProperty('--duration', dur + 's');
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.left = Math.random() * 100 + '%';
    el.style.bottom = '0';
    particlesEl.appendChild(el);
    setTimeout(function() { el.remove(); }, (dur + 1) * 1000);
}

// === Floating Hearts ===
function startHearts() {
    var emojis = ['\u2764\uFE0F', '\uD83D\uDC95', '\uD83D\uDC96', '\uD83D\uDC97', '\uD83D\uDC98', '\u2665\uFE0F'];

    function spawn() {
        var el = document.createElement('div');
        el.className = 'floating-heart';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        var size = 1.2 + Math.random() * 1.4;
        var dur = 5 + Math.random() * 5;
        el.style.setProperty('--size', size + 'rem');
        el.style.setProperty('--duration', dur + 's');
        el.style.left = Math.random() * 100 + '%';
        heartsEl.appendChild(el);
        setTimeout(function() { el.remove(); }, dur * 1000);
    }

    // Initial burst
    for (var i = 0; i < 8; i++) {
        setTimeout(spawn, i * 150);
    }

    heartTimer = setInterval(spawn, 600);
}

function stopHearts() {
    if (heartTimer) {
        clearInterval(heartTimer);
        heartTimer = null;
    }
}

// === Sparkles ===
function startSparkles() {
    function spawn() {
        var el = document.createElement('div');
        el.className = 'sparkle';
        var size = 2 + Math.random() * 5;
        var dur = 1.5 + Math.random() * 2;
        el.style.setProperty('--size', size + 'px');
        el.style.setProperty('--duration', dur + 's');
        el.style.left = Math.random() * 100 + '%';
        el.style.top = Math.random() * 100 + '%';
        sparklesEl.appendChild(el);
        setTimeout(function() { el.remove(); }, dur * 1000);
    }

    sparkleTimer = setInterval(spawn, 300);
}

function stopSparkles() {
    if (sparkleTimer) {
        clearInterval(sparkleTimer);
        sparkleTimer = null;
    }
}

// === Final Sequence ===
function triggerFinalSequence() {
    // 1. Red flash
    triggerRedPulse();

    // 2. Magic burst
    setTimeout(function() {
        magicBurst.classList.add('active');
        setTimeout(function() {
            magicBurst.classList.remove('active');
        }, 1300);
    }, 300);

    // 3. Hide content, transition stage
    setTimeout(function() {
        content.style.opacity = '0';
        stopParticles();

        setTimeout(function() {
            body.className = 'stage-final';
            content.style.display = 'none';

            // 4. Confetti explosion
            launchConfetti();

            // 5. Show final screen
            finalScreen.classList.add('visible');

            // 6. Start hearts & sparkles
            startHearts();
            startSparkles();

            // 7. Reveal final lines with stagger
            var lines = document.querySelectorAll('.final-line');
            for (var i = 0; i < lines.length; i++) {
                (function(idx) {
                    setTimeout(function() {
                        lines[idx].classList.add('visible');
                    }, 600 + idx * 900);
                })(i);
            }

            // 8. Reveal signature block
            var sigBlock = document.querySelector('.signature-block');
            setTimeout(function() {
                sigBlock.classList.add('visible');
            }, 600 + lines.length * 900 + 600);

        }, 800);
    }, 600);
}

// === Confetti ===
function launchConfetti() {
    if (typeof confetti === 'undefined') return;

    var colors = ['#FF2C55', '#B11226', '#8B0000', '#ff6b8a', '#ff1744', '#fff'];

    // Big center burst
    confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: colors,
        disableForReducedMotion: true
    });

    // Left cannon
    setTimeout(function() {
        confetti({
            particleCount: 60,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.65 },
            colors: colors
        });
    }, 400);

    // Right cannon
    setTimeout(function() {
        confetti({
            particleCount: 60,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.65 },
            colors: colors
        });
    }, 400);

    // Sustained rain
    var end = Date.now() + 4000;
    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60 + Math.random() * 60,
            spread: 50,
            origin: { x: Math.random(), y: Math.random() * 0.25 },
            colors: colors,
            gravity: 0.7,
            scalar: 0.9
        });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

// === Confirmed Button ===
function handleConfirmed() {
    confirmedBtn.textContent = '\u2713 Confirmed.';
    confirmedBtn.classList.add('clicked');
    confirmedBtn.disabled = true;

    // Extra confetti burst
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 180,
            spread: 100,
            origin: { y: 0.7 },
            colors: ['#FF2C55', '#B11226', '#ff6b8a', '#ffffff', '#ff1744']
        });
    }
}
