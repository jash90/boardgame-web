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
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <Provider>
      <Router>
        <Routes>
          <Route path="/" element={<ListGames />} />
          <Route path="/rentals/:gameId/" element={<RentalsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/change-password" element={<ChangePassword />} />
          {/*<Route path="*" element={<Navigate to="/" />} />*/}
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
