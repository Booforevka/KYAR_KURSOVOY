document.addEventListener('DOMContentLoaded', function() {

    initScrollAnimations();
    

    initMobileMenu();
});

function initScrollAnimations() {
    // Элементы для анимации при прокрутке
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    // Создаем наблюдатель пересечений
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, {
        threshold: 0.1, // Срабатывает когда 10% элемента видно
        rootMargin: '0px 0px -10% 0px' // Отрицательный отступ снизу
    });
    
    // Наблюдаем за всеми элементами с атрибутом data-aos
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Инициализация мобильного меню (бургера)
 */
function initMobileMenu() {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    // Обработчик клика по бургеру
    burger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Блокировка скролла при открытом меню
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}