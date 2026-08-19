/**
 * Проектор у героїблоці.
 *
 * Це не декоративна анімація: вона показує головну ідею продукту —
 * приспів зберігається ОДИН раз, а в послідовності повторюється.
 * Тому кнопки підписані справжніми кодами блоків, а не «1 2 3 4».
 */

const BLOCKS = {
  V1: 'Іду вперед вузьким шляхом\nУ небо за моїм Христом.\nМолюся: "Боже, поможи\nДійти до славної мети".',
  C1: 'Ісусе мій, веди мене\nЗ пітьми у світло неземне,\nЩоб я Тебе ще більш збагнув,\nТвоїх висот щоб досягнув.',
  V2: 'Втомляє часто це життя,\nДе сумнів, жах і марнота,\nТа я підношусь у мольбі,\nІ силу Ти даєш мені.'
};

const ORDER = ['V1', 'C1', 'V2', 'C1'];
const DWELL = 4200;   // скільки слайд тримається
const FADE = 200;     // затемнення при зміні, як у залі

export function initProjector() {
  const root = document.querySelector('[data-projector]');
  if (!root) return;

  const screen = root.querySelector('.projector__screen');
  const text = root.querySelector('.projector__text');
  const seq = root.querySelector('.projector__seq');

  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let at = 0;
  let timer = null;

  ORDER.forEach((code, index) => {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'seq-btn';
    button.textContent = code;
    button.setAttribute('aria-label', `Показати блок ${code}`);

    button.addEventListener('click', () => {
      stop();          // людина взяла керування — автопоказ більше не втручається
      show(index);
    });

    seq.appendChild(button);
  });

  const hint = document.createElement('span');
  hint.className = 'projector__hint';
  hint.style.margin = '0 0 0 6px';
  hint.textContent = 'порядок показу';
  seq.appendChild(hint);

  show(0);

  if (!calm) {
    start();

    // Поки читають — не гортаємо.
    root.addEventListener('pointerenter', stop);
    root.addEventListener('pointerleave', start);

    // Вкладка у фоні: рахувати слайди нікому.
    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : start();
    });

    // Герой прокрутили — таймер більше не потрібен.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        entry.isIntersecting ? start() : stop();
      }, { threshold: .2 }).observe(root);
    }
  }

  function show(index) {
    at = index;

    screen.classList.add('is-changing');

    setTimeout(() => {
      text.textContent = BLOCKS[ORDER[index]];
      screen.classList.remove('is-changing');
    }, calm ? 0 : FADE);

    seq.querySelectorAll('.seq-btn').forEach((button, i) => {
      button.setAttribute('aria-current', i === index ? 'true' : 'false');
    });
  }

  function start() {
    if (timer || calm) return;
    timer = setInterval(() => show((at + 1) % ORDER.length), DWELL);
  }

  function stop() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }
}
