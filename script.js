document.addEventListener("DOMContentLoaded", () => {
    
    // --- AUDIO SETUP ---
    // Make sure these files exist in your folder!
    const hoverSfx = new Audio('audio/836201__matustrm__ui_hover.wav');
    const clickSfx = new Audio('audio/571818__rainialco__button-32.wav');
    const bgMusic = new Audio('audio/NO COPYRIGHT LOFI MUSIC - Chill Shop (Deltarune) - MusaNCM - Music For Creators (128k) (1).mp3');
    
    bgMusic.loop = true;
    bgMusic.volume = 0.15; // Keep it subtle
    hoverSfx.volume = 0.1;

    // --- 1. THE LOOPING TYPING ENGINE ---
    const textElement = document.getElementById("typing-text");
    const phrases = ["Hello my name Nora, but known as Transcrime.", "I am Software Developer, Cybersecurity Analyst.", "You can find me on Github", "Contact Me at crime@theft.bio"]; 
    let phraseIndex = 0, charIndex = 0, isDeleting = false, typeSpeed = 100;

    function typeLoop() {
        const currentPhrase = phrases[phraseIndex];
        textElement.textContent = isDeleting ? currentPhrase.substring(0, charIndex - 1) : currentPhrase.substring(0, charIndex + 1);
        charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
        typeSpeed = isDeleting ? 50 : (charIndex === currentPhrase.length ? 2000 : 150);

        if (!isDeleting && charIndex === currentPhrase.length) isDeleting = true;
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }
        setTimeout(typeLoop, typeSpeed);
    }
    typeLoop();

    // --- 2. THE TAB & SOUND SYSTEM ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const muteBtn = document.querySelectorAll('#unmute-btn');
    const tabPanels = document.querySelectorAll('.panel');
    const navLinks = document.querySelectorAll('.nav-links a, .btn-download');

    // Function to play sounds
    const playHover = () => { hoverSfx.currentTime = 0; hoverSfx.play().catch(()=>{}); };
    const playClick = () => { clickSfx.currentTime = 0; clickSfx.play(); };
    

    // Attach sounds to all interactive elements
    [...tabButtons, ...navLinks].forEach(el => {
        el.addEventListener('mouseenter', playHover);
        el.addEventListener('click', () => {
            playClick();
            // Start background music on first interaction
            if (bgMusic.paused) bgMusic.play();
        });
    });

   const toggleAudio = (clickedBtn) => {
        // Toggle play/pause or mute state
        if (bgMusic.paused) {
            bgMusic.play();
            bgMusic.muted = false;
        } else {
            bgMusic.muted = !bgMusic.muted;
        }

       const isActuallyPlaying = !bgMusic.paused && !bgMusic.muted;
       const label = isActuallyPlaying ? "▶ MUTE AMBIENCE" : "⏸ UNMUTE AMBIENCE";

    // 3. Update ALL mute buttons
    document.querySelectorAll('#unmute-btn').forEach(btn => {
        btn.textContent = label;
        
        if (isActuallyPlaying) {
            btn.classList.add('active'); // Light up when music is on
        } else {
            btn.classList.remove('active'); // Dim when muted/paused
        }
    });

    if (typeof refreshObserver === 'function') refreshObserver();
};


    // Attach listeners to mute buttons
    muteBtn.forEach(btn => {
        btn.addEventListener('mouseenter', playHover);
        btn.addEventListener('click', () => {
            playClick();
            toggleAudio(btn);
        });
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(target).classList.add('active');
            refreshObserver();
        });
    });

    // --- 3. THE SCROLL REVEAL ---
    let observer;
    function refreshObserver() {
        if (observer) observer.disconnect();
        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.15 });
        document.querySelectorAll('.mod-card').forEach((el) => observer.observe(el));
    }
    refreshObserver();
});
