// Our Trenches - Item Shop Interactive Features

document.addEventListener('DOMContentLoaded', () => {
    // Section Navigation Dots
    const sections = document.querySelectorAll('.shop-section');
    const navDots = document.querySelectorAll('.nav-dot');
    
    // Update active dot based on scroll position
    const updateActiveDot = () => {
        const scrollPos = window.scrollY + window.innerHeight / 2;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                navDots.forEach(dot => dot.classList.remove('active'));
                if (navDots[index]) {
                    navDots[index].classList.add('active');
                }
            }
        });
    };
    
    window.addEventListener('scroll', updateActiveDot);
    
    // Click on nav dots to scroll to section
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (sections[index]) {
                sections[index].scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Parallax background effect on scroll
    let ticking = false;
    
    const updateBackground = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const distanceFromCenter = sectionCenter - windowHeight / 2;
            const parallaxOffset = distanceFromCenter * 0.1;
            
            section.style.backgroundPositionY = `${parallaxOffset}px`;
        });
        
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateBackground);
            ticking = true;
        }
    });

    // Carousel functionality
    const carouselTracks = document.querySelectorAll('.carousel-track');
    
    document.querySelectorAll('.carousel-arrow.left').forEach((btn, i) => {
        btn.addEventListener('click', () => {
            if (carouselTracks[i]) {
                carouselTracks[i].scrollBy({ left: -340, behavior: 'smooth' });
            }
        });
    });
    
    document.querySelectorAll('.carousel-arrow.right').forEach((btn, i) => {
        btn.addEventListener('click', () => {
            if (carouselTracks[i]) {
                carouselTracks[i].scrollBy({ left: 340, behavior: 'smooth' });
            }
        });
    });

    // Card hover effects
    document.querySelectorAll('.item-card, .bundle-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Navbar scroll effect
    const nav = document.querySelector('.main-nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(13, 13, 13, 0.98)';
        } else {
            nav.style.background = 'rgba(13, 13, 13, 0.9)';
        }
        
        lastScroll = currentScroll;
    });

    // Add to cart button animation
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.style.transform = 'scale(1.2)';
            this.style.background = 'rgba(0, 212, 170, 0.5)';
            
            setTimeout(() => {
                this.style.transform = '';
                this.style.background = '';
            }, 200);
        });
    });

    // Smooth scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Animate cards on scroll
    document.querySelectorAll('.item-card, .bundle-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.5s ease ${(index % 6) * 0.1}s`;
        observer.observe(card);
    });

    // Animate section titles
    document.querySelectorAll('.section-title, .shop-header').forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateX(-30px)';
        title.style.transition = 'all 0.6s ease';
        observer.observe(title);
    });

    console.log('Our Trenches Item Shop loaded!');
});
