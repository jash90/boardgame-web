import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListGames from './pages/ListGames';
import RentalsPage from './pages/RentalsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './navigation/PrivateRoute';
import ManageUsers from './pages/ManageUsers';
import { useAtom } from 'jotai';
import { currentUserAtom } from './jotai/models';
import { useEffect } from 'react';
import axios from './api/axios';

function App() {
  const [, setCurrentUser] = useAtom(currentUserAtom);

  useEffect(() => {
    // Fetch the user data immediately when the component mounts
    fetchUserData().then(data => setCurrentUser(data));
  }, []);

  const fetchUserData = async () => {
    const response = await axios.get('user');
    return response.data;
  };

  return (
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
  );
}

export default App;
