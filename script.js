// ===========================
// Smooth Scroll
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================
// Navbar Scroll Effect
// ===========================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
        navbar.style.padding = '12px 0';
    } else {
        navbar.style.boxShadow = 'none';
        navbar.style.padding = '20px 0';
    }
    
    lastScroll = currentScroll;
});

// ===========================
// Intersection Observer for Animations
// ===========================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 監聽所有需要動畫的元素
const animatedElements = document.querySelectorAll('.value-card, .vehicle-card, .flow-step');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// ===========================
// Vehicle Card Hover Effect Enhancement
// ===========================
const vehicleCards = document.querySelectorAll('.vehicle-card');
vehicleCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.borderColor = 'var(--color-secondary)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.borderColor = 'rgba(0,0,0,0.06)';
    });
});

// ===========================
// CTA Button Ripple Effect
// ===========================
const ctaButtons = document.querySelectorAll('.cta-button');
ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255,255,255,0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// CSS for ripple animation (dynamically added)
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===========================
// Scroll Progress Indicator (Optional Enhancement)
// ===========================
const scrollProgress = document.createElement('div');
scrollProgress.style.position = 'fixed';
scrollProgress.style.top = '0';
scrollProgress.style.left = '0';
scrollProgress.style.height = '3px';
scrollProgress.style.background = 'linear-gradient(90deg, var(--color-secondary), var(--color-accent))';
scrollProgress.style.width = '0%';
scrollProgress.style.zIndex = '9999';
scrollProgress.style.transition = 'width 0.1s ease';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// ===========================
// Console Branding
// ===========================
console.log('%c🏔️ Mountain & Sea', 'font-size: 24px; font-weight: bold; color: #2d3e3f;');
console.log('%c台灣頂級露營車體驗 | 讓旅程，回到最舒服的狀態', 'font-size: 12px; color: #5a7369;');
