// Our Trenches - Interactive Features

document.addEventListener('DOMContentLoaded', () => {
    // Hero Carousel
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const pauseBtn = document.querySelector('.hero-pause');
    let currentSlide = 0;
    let isPlaying = true;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            dots[i].classList.remove('active');
        });
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function startCarousel() {
        slideInterval = setInterval(nextSlide, 5000);
        isPlaying = true;
        pauseBtn.textContent = '⏸';
    }

    function stopCarousel() {
        clearInterval(slideInterval);
        isPlaying = false;
        pauseBtn.textContent = '▶';
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopCarousel();
            showSlide(index);
            startCarousel();
        });
    });

    // Pause/Play button
    pauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            stopCarousel();
        } else {
            startCarousel();
        }
    });

    // Start carousel
    startCarousel();

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.98)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animate elements on scroll
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

    // Observe mode cards
    document.querySelectorAll('.mode-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe news cards
    document.querySelectorAll('.news-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.15}s`;
        observer.observe(card);
    });

    // Observe stats
    document.querySelectorAll('.stat-item').forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(20px)';
        stat.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(stat);
    });

    // Animate stat numbers when visible
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateStats();
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);

    function animateStats() {
        statNumbers.forEach(stat => {
            const text = stat.textContent;
            const hasPlus = text.includes('+');
            const hasM = text.includes('M');
            const hasSlash = text.includes('/');
            
            if (hasSlash) {
                // 24/7 - no animation needed
                return;
            }

            let num = parseFloat(text.replace(/[^0-9.]/g, ''));
            let suffix = '';
            
            if (hasM) suffix = 'M';
            if (hasPlus) suffix += '+';
            if (text.includes('$')) {
                stat.textContent = '$0' + suffix;
            } else {
                stat.textContent = '0' + suffix;
            }

            let current = 0;
            const increment = num / 50;
            const duration = 1500;
            const stepTime = duration / 50;

            const counter = setInterval(() => {
                current += increment;
                if (current >= num) {
                    current = num;
                    clearInterval(counter);
                }
                
                let display = Math.floor(current);
                if (num < 100) {
                    display = current.toFixed(1);
                }
                
                if (text.includes('$')) {
                    stat.textContent = '$' + display + suffix;
                } else {
                    stat.textContent = display + suffix;
                }
            }, stepTime);
        });
    }

    // Button hover effects
    document.querySelectorAll('.btn-play, .btn-download, .btn-download-large').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-3px) scale(1.02)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Mode card hover effects with tilt
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // Mobile menu toggle (for future enhancement)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }

    // Player count animation - random fluctuation
    function updatePlayerCounts() {
        document.querySelectorAll('.player-count').forEach(count => {
            const text = count.textContent;
            const match = text.match(/([0-9.]+)K/);
            if (match) {
                const base = parseFloat(match[1]);
                const variation = (Math.random() - 0.5) * 2; // +/- 1K
                const newCount = (base + variation).toFixed(1);
                count.textContent = `🎮 ${newCount}K playing`;
            }
        });
    }

    // Update player counts every 5 seconds
    setInterval(updatePlayerCounts, 5000);

    console.log('⚔️ Our Trenches loaded successfully!');
});
