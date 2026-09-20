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
  const prevBtn = document.querySelector('.hero-slider__arrow--prev');
  const nextBtn = document.querySelector('.hero-slider__arrow--next');
  const heroSlider = document.querySelector('.hero-slider');

  let currentSlide = 0;
  let slideInterval = null;
  const SLIDE_DURATION = 9000; // 9 segundos: ritmo pausado y legible en móviles y ordenadores

  function goToSlide(index) {
    if (!slides.length) return;
    slides[currentSlide].classList.remove('hero-slider__slide--active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('hero-slider__slide--active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function stopSlideTimer() {
    if (slideInterval !== null) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  function startSlideTimer() {
    stopSlideTimer(); // Garantiza que jamás se acumulen múltiples intervalos
    if (slides.length > 1) {
      slideInterval = setInterval(nextSlide, SLIDE_DURATION);
    }
  }

  function resetSlideTimer() {
    stopSlideTimer();
    startSlideTimer();
  }

  // Controles de flechas de navegación
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

  // Control táctil e interactivo
  if (heroSlider) {
    // Pausa en escritorio al posar el cursor
    heroSlider.addEventListener('mouseenter', stopSlideTimer);
    heroSlider.addEventListener('mouseleave', startSlideTimer);

    // Pausa y soporte gestual en móviles (Swipe / Deslizar)
    let touchStartX = 0;

    heroSlider.addEventListener('touchstart', (e) => {
      stopSlideTimer(); // Pausa mientras el usuario lee o toca en celular
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSlider.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;

      // Deslizar con el dedo en celular (mínimo 45px de recorrido)
      if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }

      startSlideTimer(); // Reanuda tras levantar el dedo
    }, { passive: true });
  }

  // Pausar si la pestaña pasa a segundo plano o el celular se apaga/bloquea
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopSlideTimer();
    } else {
      startSlideTimer();
    }
  });

  // Inicio seguro del carrusel
  startSlideTimer();

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

