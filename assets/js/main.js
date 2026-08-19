/**
 * Точка входу. Кожен модуль сам перевіряє, чи є на сторінці те,
 * з чим він працює — тому порядок викликів не має значення,
 * і сторінка без проектора не зламається.
 */
import { initTheme } from './theme.js';
import { initReveal, initScrollLine } from './reveal.js';
import { initProjector } from './projector.js';

initTheme();
initScrollLine();
initReveal();
initProjector();

// Рік у підвалі проставляється сам: інакше він застаріє
// й буде першим, що помітить уважний відвідувач.
const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());
