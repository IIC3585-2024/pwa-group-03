export function toggleMenu() {
  const menu = document.querySelector('.menu');
  menu.classList.toggle('menu--open');
}

export function appToolbarToggle() {
  const toolbar = document.querySelector('.app-toolbar');
  toolbar.classList.toggle('app-toolbar-options-open');
}

export function setOfflineState(user) {
  const offline = document.querySelector('.offline');
  offline.classList.add('offline--open');
  offline.querySelector('.offline__message').textContent = `You are offline, ${user.displayName}`;
}

export function lightDarkModal() {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
}

export function popupMsg(msg) {
    const popup = document.querySelector('.footer');
    popup.classList.add('popup--open');
    popup.querySelector('.popup__message').textContent = msg;
}