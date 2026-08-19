/**
 * Перемикач теми.
 *
 * Вибір людини важливіший за системний: якщо оператор один раз натиснув
 * «світла», то в апаратній вона має лишитися світлою й наступного разу.
 * Доки вибору не було — слухаємо систему.
 */
export function initTheme() {
  const KEY = 'aed-theme';
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');

  const system = window.matchMedia('(prefers-color-scheme: light)');

  const stored = read();
  apply(stored ?? (system.matches ? 'light' : 'dark'));

  // Поки людина не обрала сама — йдемо за системою.
  system.addEventListener('change', (e) => {
    if (!read()) apply(e.matches ? 'light' : 'dark');
  });

  toggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    apply(next);
    write(next);
  });

  function apply(theme) {
    root.dataset.theme = theme;
    toggle?.setAttribute('aria-label',
      theme === 'light' ? 'Увімкнути темну тему' : 'Увімкнути світлу тему');
  }

  function read() {
    try { return localStorage.getItem(KEY); } catch { return null; }
  }

  function write(value) {
    try { localStorage.setItem(KEY, value); } catch { /* приватний режим */ }
  }
}
