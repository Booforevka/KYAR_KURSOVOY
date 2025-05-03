document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех модулей
    initMobileMenu();
    initScrollAnimations();
    initRevealOnScroll();
  });
  
  /*
   * Инициализация мобильного меню
   * Управляет открытием/закрытием бургер-меню на мобильных устройствах
   */
  function initMobileMenu() {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!burger || !navLinks) return;
    
    burger.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      
      // Блокировка прокрутки страницы при открытом меню
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
  
  /*
   * Инициализация анимаций при прокрутке
   * Активирует анимации элементов с атрибутом data-aos
   */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    if (animatedElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    });
    
    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }
  
  /*
   * Инициализация появления элементов при прокрутке
   * Показывает элементы с классом .reveal при прокрутке до них
   */
  function initRevealOnScroll() {
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length === 0) return;
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }
  
  /*
   * Добавляем класс при прокрутке от верха страницы
   * Меняет стиль хедера при прокрутке
   */
  window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    
    if (!header) return;
    
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });