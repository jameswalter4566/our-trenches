// Our Trenches - EXACT ipodotrun_v2 3D Carousel Replica

document.addEventListener('DOMContentLoaded', () => {
    // Carousel state
    let carouselIndex = 0;
    const cards = document.querySelectorAll('.carousel-card');
    const totalCards = cards.length;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // 3D Carousel transform helper - EXACT replica from ipodotrun_v2/heaven.xyz
    // Using rotateY for 3D angles and translateX for positioning
    function getCarouselTransform(position, total) {
        // Normalize position to be relative to center
        let relPos = position;
        if (relPos > total / 2) relPos -= total;

        // Define transforms for each position
        // 3 cards visible, closer together, ±2 cards peeking from edges
        const transforms = {
            '-3': {
                transform: 'translateX(-220%) rotateY(70deg) scale(0.7)',
                opacity: 0,
                zIndex: 10,
            },
            '-2': {
                // Far left - only inner half visible (peeking from left edge)
                transform: 'translateX(-150%) rotateY(50deg) scale(0.78)',
                opacity: 0.6,
                zIndex: 20,
            },
            '-1': {
                transform: 'translateX(-75%) rotateY(40deg) scale(0.9)',
                opacity: 1,
                zIndex: 30,
            },
            '0': {
                transform: 'translateX(0%) rotateY(0deg) scale(1)',
                opacity: 1,
                zIndex: 50,
            },
            '1': {
                transform: 'translateX(75%) rotateY(-40deg) scale(0.9)',
                opacity: 1,
                zIndex: 30,
            },
            '2': {
                // Far right - only inner half visible (peeking from right edge)
                transform: 'translateX(150%) rotateY(-50deg) scale(0.78)',
                opacity: 0.6,
                zIndex: 20,
            },
            '3': {
                transform: 'translateX(220%) rotateY(-70deg) scale(0.7)',
                opacity: 0,
                zIndex: 10,
            },
        };

        // Clamp position to available transforms
        const clampedPos = Math.max(-3, Math.min(3, Math.round(relPos)));
        return transforms[clampedPos.toString()] || transforms['0'];
    }

    // Update carousel positions
    function updateCarousel() {
        cards.forEach((card, index) => {
            const position = (index - carouselIndex + totalCards) % totalCards;
            const transforms = getCarouselTransform(position, totalCards);

            card.style.transform = transforms.transform;
            card.style.opacity = transforms.opacity;
            card.style.zIndex = transforms.zIndex;
        });
    }

    // Navigation handlers
    function goToPrev() {
        carouselIndex = (carouselIndex - 1 + totalCards) % totalCards;
        updateCarousel();
    }

    function goToNext() {
        carouselIndex = (carouselIndex + 1) % totalCards;
        updateCarousel();
    }

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', goToPrev);
    if (nextBtn) nextBtn.addEventListener('click', goToNext);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToPrev();
        if (e.key === 'ArrowRight') goToNext();
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const carouselContainer = document.querySelector('.carousel-container');
    
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToNext();
                } else {
                    goToPrev();
                }
            }
        }, { passive: true });
    }

    // Click on card to select it
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const position = (index - carouselIndex + totalCards) % totalCards;
            let relPos = position;
            if (relPos > totalCards / 2) relPos -= totalCards;
            
            // Only navigate if not clicking the center card
            if (relPos !== 0) {
                if (relPos < 0) {
                    carouselIndex = (carouselIndex + relPos + totalCards) % totalCards;
                } else {
                    carouselIndex = (carouselIndex + relPos) % totalCards;
                }
                updateCarousel();
            }
        });
    });

    // Initialize carousel
    updateCarousel();

    // Navbar scroll effect
    const nav = document.querySelector('.main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(13, 13, 13, 0.98)';
        } else {
            nav.style.background = 'rgba(13, 13, 13, 0.95)';
        }
    });

    // Mode card hover effects
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.03)';
            card.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.4)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
            card.style.boxShadow = 'none';
        });
    });

    console.log('Our Trenches - 3D Carousel initialized (ipodotrun replica)');
});
