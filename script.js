document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initCopyButtons();
    initPlayerAnimation();
    initSurveyTracking();
    initParticles();
    initSmoothScroll();
    initScrollAnimations();
    initSurveyFormButton();
    initLoaderAnimation();
});

function initLoaderAnimation() {
    const preloader = document.querySelector('.preloader');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const logoImage = document.querySelector('.logo-image');
    
    if (!preloader) return;
    
    // Проверяем загрузку изображения
    if (logoImage) {
        // Если изображение уже загружено
        if (logoImage.complete) {
            startLoaderAnimation();
        } else {
            // Ждем загрузки изображения
            logoImage.onload = function() {
                console.log('Логотип загружен успешно');
                startLoaderAnimation();
            };
            
            // Если произошла ошибка загрузки
            logoImage.onerror = function() {
                console.log('Ошибка загрузки логотипа, используем fallback');
                // Используем fallback из inline стилей
                logoImage.style.background = 'linear-gradient(45deg, #8a2be2, #ff1493)';
                logoImage.style.display = 'flex';
                logoImage.style.alignItems = 'center';
                logoImage.style.justifyContent = 'center';
                logoImage.style.color = 'white';
                logoImage.style.fontWeight = 'bold';
                logoImage.innerHTML = 'itiredmp3';
                
                startLoaderAnimation();
            };
        }
    } else {
        startLoaderAnimation();
    }
    
    function startLoaderAnimation() {
        if (!progressFill || !progressText) {
            // Если нет элементов прогресса, просто скрываем лоадер через 1.5 секунды
            setTimeout(() => {
                hidePreloader();
            }, 1500);
            return;
        }
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            if (progressFill) progressFill.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${Math.floor(progress)}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                
                // Ждем еще немного, чтобы показать 100%
                setTimeout(() => {
                    hidePreloader();
                }, 500);
            }
        }, 100);
    }
    
    function hidePreloader() {
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }
    
    // Фолбэк: если лоадер все еще виден через 4 секунды, скрываем его принудительно
    setTimeout(() => {
        if (preloader && preloader.style.display !== 'none') {
            hidePreloader();
        }
    }, 4000);
}

window.addEventListener('load', function() {
    // Дополнительная проверка после полной загрузки страницы
    const preloader = document.querySelector('.preloader');
    if (preloader && preloader.style.display !== 'none') {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 500);
    }
});

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-clipboard-target');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const code = targetElement.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    const originalIcon = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i>';
                    this.style.color = '#00ff9d';
                    
                    setTimeout(() => {
                        this.innerHTML = originalIcon;
                        this.style.color = '';
                    }, 2000);
                });
            }
        });
    });
}

function initPlayerAnimation() {
    const vinyl = document.querySelector('.vinyl');
    const playBtn = document.querySelector('.play-btn');
    const waveBars = document.querySelectorAll('.wave-bar');
    
    if (playBtn) {
        let isPlaying = false;
        
        playBtn.addEventListener('click', function() {
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                vinyl.style.animationPlayState = 'running';
                this.innerHTML = '<i class="fas fa-pause"></i>';
                
                waveBars.forEach(bar => {
                    bar.style.animationPlayState = 'running';
                });
            } else {
                vinyl.style.animationPlayState = 'paused';
                this.innerHTML = '<i class="fas fa-play"></i>';
                
                waveBars.forEach(bar => {
                    bar.style.animationPlayState = 'paused';
                });
            }
        });
    }
}

function initSurveyTracking() {
    const surveyBtn = document.getElementById('surveyBtn');
    
    function trackSurveyClick() {
        const today = new Date().toISOString().split('T')[0];
        let stats = JSON.parse(localStorage.getItem('surveyStats')) || { 
            total: 0, 
            today: 0, 
            lastDate: today,
            history: {}
        };
        
        if (stats.lastDate !== today) {
            stats.today = 0;
            stats.lastDate = today;
        }
        
        stats.total++;
        stats.today++;
        
        if (!stats.history[today]) {
            stats.history[today] = 0;
        }
        stats.history[today]++;
        
        localStorage.setItem('surveyStats', JSON.stringify(stats));
        
        const totalClicksElement = document.getElementById('totalClicks');
        const todayClicksElement = document.getElementById('todayClicks');
        
        if (totalClicksElement) {
            animateCounter(totalClicksElement, parseInt(totalClicksElement.textContent) || 0, stats.total, 1000);
        }
        
        if (todayClicksElement) {
            animateCounter(todayClicksElement, parseInt(todayClicksElement.textContent) || 0, stats.today, 1000);
        }
        
        // Плавный скролл к опросу
        const surveySection = document.getElementById('survey');
        if (surveySection) {
            const headerHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = surveySection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    function updateStatsDisplay() {
        const stats = JSON.parse(localStorage.getItem('surveyStats')) || { total: 0, today: 0 };
        const today = new Date().toISOString().split('T')[0];
        
        if (stats.lastDate !== today) {
            stats.today = 0;
        }
        
        const totalClicksElement = document.getElementById('totalClicks');
        const todayClicksElement = document.getElementById('todayClicks');
        
        if (totalClicksElement) {
            totalClicksElement.textContent = stats.total;
        }
        
        if (todayClicksElement) {
            todayClicksElement.textContent = stats.today;
        }
    }
    
    if (surveyBtn) {
        surveyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            trackSurveyClick();
        });
    }
    
    updateStatsDisplay();
}

function initSurveyFormButton() {
    const surveyFormBtn = document.getElementById('surveyFormBtn');
    
    if (surveyFormBtn) {
        surveyFormBtn.addEventListener('click', function() {
            // Открываем форму Яндекс в новой вкладке
            window.open('https://forms.yandex.ru/cloud/697f0e5b02848f6337a51700', '_blank');
            
            // Обновляем статистику переходов
            const today = new Date().toISOString().split('T')[0];
            let stats = JSON.parse(localStorage.getItem('surveyStats')) || { 
                total: 0, 
                today: 0, 
                lastDate: today,
                history: {}
            };
            
            if (stats.lastDate !== today) {
                stats.today = 0;
                stats.lastDate = today;
            }
            
            stats.total++;
            stats.today++;
            
            if (!stats.history[today]) {
                stats.history[today] = 0;
            }
            stats.history[today]++;
            
            localStorage.setItem('surveyStats', JSON.stringify(stats));
            
            // Обновляем отображение статистики
            const totalClicksElement = document.getElementById('totalClicks');
            const todayClicksElement = document.getElementById('todayClicks');
            
            if (totalClicksElement) {
                animateCounter(totalClicksElement, parseInt(totalClicksElement.textContent) || 0, stats.total, 1000);
            }
            
            if (todayClicksElement) {
                animateCounter(todayClicksElement, parseInt(todayClicksElement.textContent) || 0, stats.today, 1000);
            }
        });
    }
}

function animateCounter(element, start, end, duration = 3000) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function initParticles() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach(particle => {
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        const randomDelay = Math.random() * 20;
        
        particle.style.left = `${randomX}%`;
        particle.style.top = `${randomY}%`;
        particle.style.animationDelay = `${randomDelay}s`;
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card, .tech-category, .setup-step, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

// Автоматическое обновление статистики каждые 30 секунд
setInterval(() => {
    const stats = JSON.parse(localStorage.getItem('surveyStats')) || { total: 0, today: 0 };
    const totalClicksElement = document.getElementById('totalClicks');
    const todayClicksElement = document.getElementById('todayClicks');
    
    if (totalClicksElement) {
        totalClicksElement.textContent = stats.total;
    }
    
    if (todayClicksElement) {
        todayClicksElement.textContent = stats.today;
    }
}, 30000);