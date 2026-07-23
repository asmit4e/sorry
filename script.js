// =========================================
// MAIN JAVASCRIPT CONTROLLER
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Smooth Page Load Transition
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // 2. Custom Cursor Logic
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // 3. Audio & Web Audio API (Sound Effects)
    const bgMusic = document.getElementById('bg-music');
    const playBtn = document.getElementById('play-btn');
    const volSlider = document.getElementById('volume-slider');

    function playClickSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {} // Silently fail if blocked
    }

    if (bgMusic) {
        // Sync across pages using sessionStorage
        const savedTime = sessionStorage.getItem('musicTime');
        const isPlaying = sessionStorage.getItem('musicPlaying');

        if (savedTime) bgMusic.currentTime = parseFloat(savedTime);
        if (isPlaying === 'true') {
            bgMusic.play().catch(() => console.log("Autoplay blocked by browser."));
            if(playBtn) playBtn.innerHTML = "⏸";
        }

        bgMusic.addEventListener('timeupdate', () => {
            sessionStorage.setItem('musicTime', bgMusic.currentTime);
        });

        if (playBtn) {
            playBtn.addEventListener('click', () => {
                if (bgMusic.paused) {
                    bgMusic.play();
                    playBtn.innerHTML = "⏸";
                    sessionStorage.setItem('musicPlaying', 'true');
                } else {
                    bgMusic.pause();
                    playBtn.innerHTML = "▶";
                    sessionStorage.setItem('musicPlaying', 'false');
                }
            });
        }

        if (volSlider) {
            volSlider.addEventListener('input', (e) => {
                bgMusic.volume = e.target.value;
            });
        }
    }

    // 4. Page Transition Logic
    document.querySelectorAll('.btn-transition').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            playClickSound();
            const target = this.getAttribute('href');
            
            // Special case for Landing page play button
            if(this.id === 'start-btn' && bgMusic) {
                bgMusic.play().catch(e=>console.log(e));
                sessionStorage.setItem('musicPlaying', 'true');
            }

            document.body.classList.remove('loaded');
            setTimeout(() => {
                window.location.href = target;
            }, 600);
        });
    });

    // 5. Floating Hearts Generator
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        heart.style.fontSize = (Math.random() * 15 + 10) + 'px';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 6000);
    }, 800);

    // =========================================
    // PAGE SPECIFIC LOGIC
    // =========================================
    
    // Page: Letter
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        const text = typewriterEl.getAttribute('data-text');
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                typewriterEl.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 40); // typing speed
            }
        }
        setTimeout(typeWriter, 1000);
    }

    // Page: Memories (Slider)
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        document.getElementById('next-btn').addEventListener('click', () => {
            playClickSound();
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        });
        document.getElementById('prev-btn').addEventListener('click', () => {
            playClickSound();
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
        });
    }

    // Page: Reasons
    const reasons = document.querySelectorAll('.reason-text');
    if (reasons.length > 0) {
        let rIndex = 0;
        setInterval(() => {
            reasons[rIndex].classList.remove('active');
            rIndex = (rIndex + 1) % reasons.length;
            reasons[rIndex].classList.add('active');
        }, 3000);
    }

    // Page: Promises
    const promiseItems = document.querySelectorAll('.promise-item');
    if (promiseItems.length > 0) {
        promiseItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('show');
                playClickSound(); // tiny pop for each checkmark
            }, 800 * (index + 1));
        });
    }

    // Page: Forgive (Final)
    const btnYes = document.getElementById('btn-yes');
    const btnWait = document.getElementById('btn-wait');
    const finalMsg = document.getElementById('final-message');

    if (btnYes && btnWait) {
        btnYes.addEventListener('click', () => {
            playClickSound();
            document.querySelector('.button-group').style.display = 'none';
            finalMsg.innerHTML = "<h2>Thank you for giving us another chance.</h2><h1 class='hero-heart' style='margin-top:20px; animation: glowText 2s infinite'>I Love You ❤️</h1>";
            finalMsg.classList.add('fade-in-element');
            
            // Confetti explosion
            for (let i = 0; i < 150; i++) {
                let conf = document.createElement('div');
                conf.classList.add('confetti');
                conf.style.left = Math.random() * 100 + 'vw';
                conf.style.backgroundColor = ['#ffb6c1', '#e6e6fa', '#b76e79', '#ffffff'][Math.floor(Math.random() * 4)];
                conf.style.animationDuration = (Math.random() * 2 + 2) + 's';
                document.body.appendChild(conf);
            }
        });

        btnWait.addEventListener('click', () => {
            playClickSound();
            document.querySelector('.button-group').style.display = 'none';
            finalMsg.innerHTML = "<p style='font-size: 1.2rem; font-style: italic;'>I understand. I'll wait patiently because you're worth waiting for. 🤍</p>";
            finalMsg.classList.add('fade-in-element');
        });
    }
});