export function toggleMenuHandler() {
  const menu = document.querySelector('[data-menu]');
  document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-menu-open]');
    if (!target) {
      return;
    }
    menu.classList.add('active');
  });
  document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-menu-close]');
    if (!target) {
      return;
    }
    menu.classList.remove('active');
  });
}