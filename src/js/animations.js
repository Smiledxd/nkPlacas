/**
 * NK PLACAS E.I.R.L. — Script de Animaciones y Scroll Reveal (animations.js)
 * Metodología: BEM (Block Element Modifier)
 */

document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const revealElements = document.querySelectorAll(
    '.reveal, .reveal--up, .reveal--left, .reveal--right, .reveal--fade'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('reveal--is-visible'));
  }
});
