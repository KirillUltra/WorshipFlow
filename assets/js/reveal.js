/**
 * Поява блоків при прокрутці та смужка прогресу в шапці.
 */
export function initReveal() {
  const items = document.querySelectorAll('.reveal');

  // Без підтримки спостерігача просто показуємо все одразу.
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('is-in');
      io.unobserve(entry.target);   // з'явилося один раз — далі не стежимо
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: .1 });

  items.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
    io.observe(el);
  });
}

export function initScrollLine() {
  const line = document.querySelector('[data-scroll-line]');
  if (!line) return;

  // scrollHeight читається лише при зміні розміру. Раніше він читався
  // на КОЖНУ подію прокрутки, і кожне таке читання змушувало браузер
  // перерахувати всю розкладку сторінки — саме звідси бралися ривки.
  let max = 0;
  let ticking = false;

  const measure = () => {
    max = document.documentElement.scrollHeight - window.innerHeight;
    paint();
  };

  const paint = () => {
    const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    line.style.width = `${ratio * 100}%`;
    ticking = false;
  };

  // Малюємо не частіше за кадр.
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paint);
  };

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', measure, { passive: true });

  measure();
}
