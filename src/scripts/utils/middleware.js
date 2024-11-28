const checkAuth = () => {
  const token = localStorage.getItem('token');
  const url = window.location.hash.slice(1);

  if (token && (url === '/login' || url === '/register')) {
    window.location.href = '#/';
    return false;
  }

  if (!token && url !== '/login' && url !== '/register') {
    window.location.href = '#/login';
    return false;
  }

  return true;
};

export default checkAuth;