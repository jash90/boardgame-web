import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import ListGames from "./pages/ListGames";
import RentalsPage from "./pages/RentalsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./navigation/PrivateRoute";
import ManageUsers from './pages/ManageUsers';

function App() {
  const auth = useAuth();

  return (
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<PrivateRoute />}>
                <Route index element={<ListGames />} />
              </Route>
              <Route path="/rentals/:gameId/" element={<PrivateRoute />}>
                <Route index element={<RentalsPage />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
           <Route path="/manage-users" element={<ManageUsers />} />
              {/*<Route path="*" element={<Navigate to="/" />} />*/}
            </Routes>
          </Router>
        </AuthProvider>
  );
}

export default App;
