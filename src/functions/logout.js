const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');

  window.location = '/login';
};

export default logout;
