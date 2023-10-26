import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import ListGames from './pages/ListGames';
import RentalsPage from './pages/RentalsPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ManageUsers from './pages/ManageUsers';
import { Provider } from 'jotai';
import AuthRoute from './navigation/AuthRoute';
import ChangePassword from './pages/ChangePassword';
import NoAuthRoute from './navigation/NoAuthRoute';

function App() {
  return (
    <Provider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthRoute  />}>
            <Route index element={<ListGames />} />
          </Route>
          <Route path="/rentals/:gameId/" element={<AuthRoute />}>
            <Route index element={<RentalsPage />} />
          </Route>
          <Route path="/login" element={<NoAuthRoute />} >
            <Route index element={<Login />} />
          </Route>
          <Route path="/register" element={<NoAuthRoute />} >
            <Route index element={<Register />} />
          </Route>
          <Route path="/manage-users" element={<AuthRoute />}>
            <Route index element={<ManageUsers />} />
          </Route>
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
