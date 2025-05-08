import './App.css';
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from './pages/Login';
import Home from './home_page/Home';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import AdminMenu from './admin_panel/AdminMenu';
import { useState, useEffect } from 'react';
import api from './api';

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function App() {
  const [hasAdminPermission, setHasAdminPermission] = useState(false);

  useEffect(() => {
    const fetchDataForMenu = async () => {
        try {
            const roles = (await api.get("/api/user/roles")).data.roles;

            if(roles.includes("Owner") || roles.includes("HR")) {
              setHasAdminPermission(true);
            }
        } catch (error) {
            console.error("Error fetching leave types:", error);
        }
    };

    fetchDataForMenu();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <ProtectedRoute> <Home /> </ProtectedRoute> }/>
          <Route path="/login" element={<Login />}/>
          <Route path="/logout" element={<Logout />}/>
          <Route path="*" element={<NotFound />}/>

          { hasAdminPermission && (
            <Route path="/admin_panel" element={ <ProtectedRoute> <AdminMenu /> </ProtectedRoute> }/>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
