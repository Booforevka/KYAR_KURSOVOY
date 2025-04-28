

document.addEventListener('DOMContentLoaded', function() {
    
    initMobileMenu();

    initCatalogViewSwitcher();
});

// Функция для инициализации мобильного меню
function initMobileMenu() {
    const burgerButton = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    if (burgerButton && navLinks) {
        burgerButton.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            burgerButton.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 767) {
                    navLinks.classList.remove('active');
                    burgerButton.classList.remove('active');
                }
            });
        });
    }
}

// Функция для переключения вида каталога (карточки/список)
function initCatalogViewSwitcher() {
    const viewButtons = document.querySelectorAll('.catalog-view-switcher button');
    const catalogGrid = document.getElementById('cars-container');
    
    if (viewButtons.length && catalogGrid) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Удаляем активный класс у всех кнопок
                viewButtons.forEach(btn => btn.classList.remove('active'));
                
                // Добавляем активный класс текущей кнопке
                this.classList.add('active');
                
                // Изменяем вид каталога в зависимости от нажатой кнопки
                if (this.textContent === 'Список') {
                    catalogGrid.classList.remove('catalog-grid');
                    catalogGrid.classList.add('catalog-list');
                } else {
                    catalogGrid.classList.remove('catalog-list');
                    catalogGrid.classList.add('catalog-grid');
                }
            });
        });
    }
}

// Обработка скролла
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Подсветка активного пункта меню
function highlightActiveMenuItem() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Вызов функции подсветки меню после загрузки DOM
document.addEventListener('DOMContentLoaded', highlightActiveMenuItem);