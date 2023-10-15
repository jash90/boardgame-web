import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'x-refresh-token': `${localStorage.getItem('refreshToken')}`
  }
});

// Add an _retry property to config to ensure we don't keep retrying infinitely
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      try {
        const res = await instance.post(
          '/refresh',
          {},
          {
            headers: {
              'x-refresh-token': `Bearer ${refreshToken}`
            }
          }
        );

        // Check that the refresh was successful
        if (res.status === 200) {
          // save new tokens to localStorage
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('refreshToken', res.data.refreshToken);

          // Set the Authorization on the originalRequest and on the axios instance
          originalRequest.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
          instance.defaults.headers.common['Authorization'] =
            'Bearer ' + localStorage.getItem('token');

          return instance(originalRequest);
        } else {
          // If refreshing the token failed, then reject the promise
          return Promise.reject(error);
        }
      } catch (err) {
        console.log(err);
        // If there's an error while refreshing the token, then reject the promise
        return Promise.reject(err);
      }
    }

    // If error was not 401 or there's a problem refreshing the token, reject the promise
    return Promise.reject(error);
  }
);

export default instance;
