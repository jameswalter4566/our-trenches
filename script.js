// Our Trenches - Interactive Features

document.addEventListener('DOMContentLoaded', () => {
    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Carousel dots
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            dots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });
    });

    // Pause button toggle
    const pauseBtn = document.querySelector('.carousel-pause');
    let isPaused = false;
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            pauseBtn.innerHTML = isPaused 
                ? '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>'
                : '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        });
    }

    // Auto carousel (if not paused)
    let currentSlide = 1;
    setInterval(() => {
        if (!isPaused) {
            currentSlide = (currentSlide + 1) % dots.length;
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === currentSlide);
            });
        }
    }, 5000);

    // Navbar scroll effect
    const nav = document.querySelector('.main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(13, 13, 13, 0.98)';
            nav.style.backdropFilter = 'blur(10px)';
        } else {
            nav.style.background = 'var(--bg-primary)';
            nav.style.backdropFilter = 'none';
        }
    });

    // Update player counts randomly
    const playerCounts = document.querySelectorAll('.card-players span');
    setInterval(() => {
        playerCounts.forEach(count => {
            const current = parseFloat(count.textContent);
            const change = (Math.random() - 0.5) * 2;
            const newCount = Math.max(10, current + change).toFixed(1);
            count.textContent = newCount + 'K';
        });
    }, 3000);

    // Card hover effects
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.03)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });

    console.log('Our Trenches loaded!');
});
