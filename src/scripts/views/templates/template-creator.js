const initLogout = () => {
  document.querySelector('#logout').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = '#/login';
  });
};

export { initLogout };