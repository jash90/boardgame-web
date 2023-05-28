import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListGames from './pages/ListGames';
import RentalsPage from './pages/RentalsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ManageUsers from './pages/ManageUsers';
import { Provider, useAtom } from 'jotai';
import { currentUserAtom } from './jotai/models';
import { useEffect } from 'react';
import axios from './api/axios';
import PrivateRoute from './navigation/PrivateRoute';

function App() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const fetchUserData = async (token) => {
        try {
          const response = await axios.get('user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCurrentUser(response.data);
        } catch (error) {
          console.error('Failed to load user data:', error);
        }
      };
      fetchUserData(token);
    }
  }, []);


  return (
    <Provider>
      <Router>
        <Routes>
          <Route path='/' element={<PrivateRoute />}>
            <Route index element={<ListGames />} />
          </Route>
          <Route path='/rentals/:gameId/' element={<PrivateRoute />}>
            <Route index element={<RentalsPage />} />
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/manage-users' element={<ManageUsers />} />
          {/*<Route path="*" element={<Navigate to="/" />} />*/}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
