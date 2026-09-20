/**
 * NK PLACAS E.I.R.L. — Script Principal (main.js)
 * Metodología: BEM (Block Element Modifier)
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. CONFIGURACIÓN CENTRALIZADA DE CONTACTO
  // =========================================================================
  const COMPANY_CONFIG = {
    phonePrimary: '944 491 189',
    phoneSecondary: '944 491 189',
    whatsappNumber: '51944491189',
    email: 'nknkventas@gmail.com',
    address: 'Av. Nicolás de Piérola Nro. 301, Urb. El Cercado, Villa María del Triunfo, Lima - Perú',
    ruc: '20616192141',
    companyName: 'NK PLACAS E.I.R.L.'
  };

  // =========================================================================
  // 2. HEADER STICKY Y MENÚ MÓVIL (BEM: .header, .header__nav, etc.)
  // =========================================================================
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.header__toggle');
  const navMenu = document.querySelector('.header__nav');
  const navLinks = document.querySelectorAll('.header__link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('header--scrolled');
    } else {
      header?.classList.remove('header--scrolled');
    }
    updateActiveNavLink();
  }, { passive: true });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('header__nav--active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('header__nav--active')) {
          icon.classList.remove('bx-menu');
          icon.classList.add('bx-x');
        } else {
          icon.classList.remove('bx-x');
          icon.classList.add('bx-menu');
        }
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('header__nav--active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('bx-x');
          icon.classList.add('bx-menu');
        }
      });
    });
  }

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('header__link--active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('header__link--active');
          }
        });
      }
    });
  }

  // =========================================================================
  // 3. CARRUSEL HERO DINÁMICO (BEM: .hero-slider, .hero-slider__slide, etc.)
  // =========================================================================
  const slides = document.querySelectorAll('.hero-slider__slide');
  const dotsContainer = document.querySelector('.hero-slider__dots');
  const prevBtn = document.querySelector('.hero-slider__arrow--prev');
  const nextBtn = document.querySelector('.hero-slider__arrow--next');

  let currentSlide = 0;
  let slideInterval = null;
  const SLIDE_DURATION = 7000;

  if (slides.length > 0 && dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.classList.add('hero-slider__dot');
      if (idx === 0) dot.classList.add('hero-slider__dot--active');
      dot.setAttribute('aria-label', `Diapositiva ${idx + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(idx);
        resetSlideTimer();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = document.querySelectorAll('.hero-slider__dot');

  function goToSlide(index) {
    slides[currentSlide].classList.remove('hero-slider__slide--active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('hero-slider__dot--active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('hero-slider__slide--active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('hero-slider__dot--active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetSlideTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetSlideTimer();
    });
  }

  function startSlideTimer() {
    if (slides.length > 1) {
      slideInterval = setInterval(nextSlide, SLIDE_DURATION);
    }
  }

  function resetSlideTimer() {
    clearInterval(slideInterval);
    startSlideTimer();
  }

  const heroSlider = document.querySelector('.hero-slider');
  if (heroSlider) {
    heroSlider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    heroSlider.addEventListener('mouseleave', startSlideTimer);
  }

  // Retardo de 1 segundo en el arranque para sincronizar con la animación visual de entrada
  setTimeout(() => {
    startSlideTimer();
  }, 1000);

  // =========================================================================
  // 3.1 BOTÓN INTERACTIVO DE SCROLL DEL HERO (Flecha hacia abajo)
  // =========================================================================
  const heroScrollBtn = document.getElementById('heroScrollDown');
  if (heroScrollBtn) {
    heroScrollBtn.addEventListener('click', () => {
      const targetSection = document.getElementById('cortes-especiales') || document.getElementById('taller') || document.getElementById('servicios') || document.querySelector('.services');
      if (targetSection) {
        const headerEl = document.querySelector('.header');
        const headerHeight = headerEl ? headerEl.offsetHeight : 70;
        const targetPos = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });

    // Ocultar suavemente al hacer scroll hacia abajo y reaparecer al volver al hero
    window.addEventListener('scroll', () => {
      if (window.scrollY > 220) {
        heroScrollBtn.style.opacity = '0';
        heroScrollBtn.style.pointerEvents = 'none';
        heroScrollBtn.style.transform = 'translateX(-50%) translateY(10px)';
      } else {
        heroScrollBtn.style.opacity = '1';
        heroScrollBtn.style.pointerEvents = 'auto';
        heroScrollBtn.style.transform = 'translateX(-50%) translateY(0)';
      }
    }, { passive: true });
  }

  // =========================================================================
  // 4. DESPLAZAMIENTO SUAVE PARA ENLACES INTERNOS
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 75;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

