// Our Trenches - Carousel & Interactive Features

document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const nav = document.querySelector('.main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(13, 13, 13, 0.98)';
        } else {
            nav.style.background = 'rgba(13, 13, 13, 0.95)';
        }
    });

    // Card hover effects
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

    // Hero carousel card hover - pause animation handled by CSS
    document.querySelectorAll('.hero-carousel-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Update player counts randomly for live feel
    const updateCounts = () => {
        document.querySelectorAll('.card-stats span:first-child, .card-players span').forEach(count => {
            const text = count.textContent;
            const match = text.match(/([0-9.]+)K?\s*playing?/i);
            if (match) {
                const num = parseFloat(match[1]);
                const change = (Math.random() - 0.5) * 3;
                const newNum = Math.max(10, num + change).toFixed(1);
                count.textContent = text.includes('playing') ? `${newNum}K playing` : `${newNum}K`;
            }
        });
    };
    
    setInterval(updateCounts, 4000);

    // Pulse animation for live badges
    document.querySelectorAll('.card-badge.live').forEach(badge => {
        setInterval(() => {
            badge.style.opacity = badge.style.opacity === '0.7' ? '1' : '0.7';
        }, 1000);
    });

    console.log('Our Trenches loaded with ipodotrun-style carousel!');
});
