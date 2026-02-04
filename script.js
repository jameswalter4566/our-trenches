// Our Trenches - 3D Carousel

document.addEventListener('DOMContentLoaded', () => {
    // Carousel state
    let carouselIndex = 0;
    const cards = document.querySelectorAll('.carousel-card');
    const totalCards = cards.length;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Track user interaction for autoplay policy
    let userHasInteracted = false;

    // 3D Carousel transform helper
    function getCarouselTransform(position, total) {
        let relPos = position;
        if (relPos > total / 2) relPos -= total;

        const spacing = 75;
        const cardScale = 1;

        const transforms = {
            '-3': {
                transform: `translateX(-${spacing * 2.9}%) rotateY(70deg) scale(${0.7 * cardScale})`,
                opacity: 0,
                zIndex: 10,
            },
            '-2': {
                transform: `translateX(-${spacing * 2}%) rotateY(50deg) scale(${0.78 * cardScale})`,
                opacity: 0.6,
                zIndex: 20,
            },
            '-1': {
                transform: `translateX(-${spacing}%) rotateY(40deg) scale(${0.9 * cardScale})`,
                opacity: 1,
                zIndex: 30,
            },
            '0': {
                transform: `translateX(0%) rotateY(0deg) scale(${1 * cardScale})`,
                opacity: 1,
                zIndex: 50,
            },
            '1': {
                transform: `translateX(${spacing}%) rotateY(-40deg) scale(${0.9 * cardScale})`,
                opacity: 1,
                zIndex: 30,
            },
            '2': {
                transform: `translateX(${spacing * 2}%) rotateY(-50deg) scale(${0.78 * cardScale})`,
                opacity: 0.6,
                zIndex: 20,
            },
            '3': {
                transform: `translateX(${spacing * 2.9}%) rotateY(-70deg) scale(${0.7 * cardScale})`,
                opacity: 0,
                zIndex: 10,
            },
        };

        const clampedPos = Math.max(-3, Math.min(3, Math.round(relPos)));
        return transforms[clampedPos.toString()] || transforms['0'];
    }

    // Track if carousel is scrolled out of view
    let carouselInView = true;

    // Update carousel positions
    function updateCarousel() {
        cards.forEach((card, index) => {
            const position = (index - carouselIndex + totalCards) % totalCards;
            const transforms = getCarouselTransform(position, totalCards);
            card.style.transform = transforms.transform;
            card.style.opacity = transforms.opacity;
            card.style.zIndex = transforms.zIndex;

            // Video playback control
            const video = card.querySelector('.card-video');
            if (video) {
                let relPos = position;
                if (relPos > totalCards / 2) relPos -= totalCards;
                if (relPos === 0 && carouselInView) {
                    // Centered and in view - play video
                    // Start muted, unmute only after user interaction
                    if (!userHasInteracted) {
                        video.muted = true;
                    } else {
                        video.muted = false;
                    }
                    video.play().catch(() => {
                        // Autoplay blocked - keep muted and retry
                        video.muted = true;
                        video.play().catch(() => {});
                    });
                } else {
                    video.pause();
                    video.muted = true;
                }
            }
        });
    }

    // Mark user interaction on first click/touch anywhere on page
    function onUserInteraction() {
        userHasInteracted = true;
        updateCarousel();
        document.removeEventListener('click', onUserInteraction);
        document.removeEventListener('touchstart', onUserInteraction);
    }
    document.addEventListener('click', onUserInteraction);
    document.addEventListener('touchstart', onUserInteraction);

    // Navigation
    function goToPrev() {
        userHasInteracted = true;
        carouselIndex = (carouselIndex - 1 + totalCards) % totalCards;
        updateCarousel();
    }

    function goToNext() {
        userHasInteracted = true;
        carouselIndex = (carouselIndex + 1) % totalCards;
        updateCarousel();
    }

    if (prevBtn) prevBtn.addEventListener('click', goToPrev);
    if (nextBtn) nextBtn.addEventListener('click', goToNext);

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToPrev();
        if (e.key === 'ArrowRight') goToNext();
    });

    // Touch/swipe
    let touchStartX = 0;
    const carouselContainer = document.querySelector('.carousel-container');

    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselContainer.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                userHasInteracted = true;
                diff > 0 ? goToNext() : goToPrev();
            }
        }, { passive: true });
    }

    // Click on card
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            userHasInteracted = true;
            const position = (index - carouselIndex + totalCards) % totalCards;
            let relPos = position;
            if (relPos > totalCards / 2) relPos -= totalCards;

            if (relPos !== 0) {
                carouselIndex = (carouselIndex + relPos + totalCards) % totalCards;
                updateCarousel();
            }
        });
    });

    // Initialize carousel
    updateCarousel();

    // Mute/pause videos when carousel scrolls out of view
    if (carouselContainer) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                carouselInView = entry.isIntersecting;
                updateCarousel();
            });
        }, { threshold: 0.3 });
        scrollObserver.observe(carouselContainer);
    }

    // Navbar scroll
    const nav = document.querySelector('.main-nav');
    window.addEventListener('scroll', () => {
        nav.style.background = window.scrollY > 50 ? 'rgba(13, 13, 13, 0.98)' : 'rgba(13, 13, 13, 0.95)';
    });

    console.log('Our Trenches initialized!');
});
