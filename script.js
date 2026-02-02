// Our Trenches - Debug Panel + 3D Carousel

// ===== GLOBAL VARIABLES =====
let debugCollapsed = false;
window.carouselSpacing = 75;
window.carouselCardScale = 1;

// ===== DEBUG PANEL FUNCTIONS =====
function toggleDebug() {
    debugCollapsed = !debugCollapsed;
    const content = document.getElementById('debugContent');
    const btn = document.querySelector('.debug-header button');
    if (debugCollapsed) {
        content.classList.add('collapsed');
        btn.textContent = '+';
    } else {
        content.classList.remove('collapsed');
        btn.textContent = '−';
    }
}

function updateStyles() {
    console.log('updateStyles called');
    
    // Get all values
    const bgPosY = document.getElementById('bgPosY').value;
    const bgPosX = document.getElementById('bgPosX').value;
    const bgScale = document.getElementById('bgScale').value;
    const bgHeight = document.getElementById('bgHeight').value;
    
    const textTop = document.getElementById('textTop').value;
    const textSize = document.getElementById('textSize').value;
    const textOpacity = document.getElementById('textOpacity').value;
    
    const carouselTop = document.getElementById('carouselTop').value;
    const carouselScale = document.getElementById('carouselScale').value;
    const carouselSpace = document.getElementById('carouselSpace').value;
    
    // Update value displays
    document.getElementById('bgPosYVal').textContent = bgPosY;
    document.getElementById('bgPosXVal').textContent = bgPosX;
    document.getElementById('bgScaleVal').textContent = bgScale;
    document.getElementById('bgHeightVal').textContent = bgHeight;
    
    document.getElementById('textTopVal').textContent = textTop;
    document.getElementById('textSizeVal').textContent = textSize;
    document.getElementById('textOpacityVal').textContent = textOpacity;
    
    document.getElementById('carouselTopVal').textContent = carouselTop;
    document.getElementById('carouselScaleVal').textContent = carouselScale;
    document.getElementById('carouselSpaceVal').textContent = carouselSpace;
    
    // Apply background image styles
    const bgImage = document.querySelector('.hero-bg-image');
    if (bgImage) {
        bgImage.style.objectPosition = `${bgPosX}% ${bgPosY}%`;
        bgImage.style.transform = `scale(${bgScale / 100})`;
        bgImage.style.transformOrigin = 'center center';
        console.log('BG updated:', bgPosX, bgPosY, bgScale);
    }
    
    // Apply hero section height
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.minHeight = `${bgHeight}px`;
        console.log('Hero height:', bgHeight);
    }
    
    // Apply text styles
    const heroTitle = document.querySelector('.hero-title');
    const heroTextContent = document.querySelector('.hero-text-content');
    if (heroTitle) {
        heroTitle.style.fontSize = `${textSize}px`;
        heroTitle.style.opacity = textOpacity / 100;
        console.log('Title updated:', textSize, textOpacity);
    }
    if (heroTextContent) {
        heroTextContent.style.paddingTop = `${textTop}px`;
    }
    
    // Apply carousel styles
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.style.paddingTop = `${carouselTop}px`;
        carouselContainer.style.paddingBottom = `${carouselTop}px`;
        console.log('Carousel padding:', carouselTop);
    }
    
    // Update carousel card transforms with new spacing
    window.carouselSpacing = parseInt(carouselSpace);
    window.carouselCardScale = parseInt(carouselScale) / 100;
    
    // Call carousel update if it exists
    if (window.updateCarousel) {
        window.updateCarousel();
    }
    
    // Update output
    updateDebugOutput();
}

function updateDebugOutput() {
    const output = {
        background: {
            positionY: document.getElementById('bgPosY').value + '%',
            positionX: document.getElementById('bgPosX').value + '%',
            scale: document.getElementById('bgScale').value + '%',
            height: document.getElementById('bgHeight').value + 'px'
        },
        heroText: {
            topPadding: document.getElementById('textTop').value + 'px',
            fontSize: document.getElementById('textSize').value + 'px',
            opacity: document.getElementById('textOpacity').value + '%'
        },
        carousel: {
            topPadding: document.getElementById('carouselTop').value + 'px',
            cardScale: document.getElementById('carouselScale').value + '%',
            spacing: document.getElementById('carouselSpace').value + '%'
        }
    };
    
    document.getElementById('debugOutput').textContent = JSON.stringify(output, null, 2);
}

function copyValues() {
    const output = document.getElementById('debugOutput').textContent;
    navigator.clipboard.writeText(output).then(() => {
        alert('Values copied to clipboard!');
    });
}

// ===== CAROUSEL CODE =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize debug output
    updateDebugOutput();
    
    // Carousel state
    let carouselIndex = 0;
    const cards = document.querySelectorAll('.carousel-card');
    const totalCards = cards.length;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // 3D Carousel transform helper
    function getCarouselTransform(position, total) {
        let relPos = position;
        if (relPos > total / 2) relPos -= total;

        const spacing = window.carouselSpacing || 75;
        const cardScale = window.carouselCardScale || 1;

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

    // Update carousel positions - GLOBAL
    window.updateCarousel = function() {
        cards.forEach((card, index) => {
            const position = (index - carouselIndex + totalCards) % totalCards;
            const transforms = getCarouselTransform(position, totalCards);
            card.style.transform = transforms.transform;
            card.style.opacity = transforms.opacity;
            card.style.zIndex = transforms.zIndex;
        });
    };

    // Navigation
    function goToPrev() {
        carouselIndex = (carouselIndex - 1 + totalCards) % totalCards;
        window.updateCarousel();
    }

    function goToNext() {
        carouselIndex = (carouselIndex + 1) % totalCards;
        window.updateCarousel();
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
                diff > 0 ? goToNext() : goToPrev();
            }
        }, { passive: true });
    }

    // Click on card
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const position = (index - carouselIndex + totalCards) % totalCards;
            let relPos = position;
            if (relPos > totalCards / 2) relPos -= totalCards;
            
            if (relPos !== 0) {
                carouselIndex = (carouselIndex + relPos + totalCards) % totalCards;
                window.updateCarousel();
            }
        });
    });

    // Initialize carousel
    window.updateCarousel();

    // Navbar scroll
    const nav = document.querySelector('.main-nav');
    window.addEventListener('scroll', () => {
        nav.style.background = window.scrollY > 50 ? 'rgba(13, 13, 13, 0.98)' : 'rgba(13, 13, 13, 0.95)';
    });

    console.log('Our Trenches initialized - Debug panel ready!');
});
