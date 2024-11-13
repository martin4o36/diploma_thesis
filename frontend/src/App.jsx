import './App.css'
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from './pages/Login'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import ContactsAndOrganization from './pages/menu_navigate/ContactsAndOrg'
import Vacations from './pages/menu_navigate/Vacations'
import AdminPanel from './pages/menu_navigate/AdminPanel'
import HomeOffice from './pages/menu_navigate/HomeOffice'
import MyRequests from './pages/menu_navigate/MyRequests'
import Profile from './pages/menu_navigate/Profile'

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <ProtectedRoute> <Home /> </ProtectedRoute> }/>
          <Route path="/login" element={<Login />}/>
          <Route path="/logout" element={<Logout />}/>
          <Route path="*" element={<NotFound />}/>

          <Route path="/contacts" element={ <ProtectedRoute> <ContactsAndOrganization /> </ProtectedRoute> }/>
          <Route path="/vacation" element={ <ProtectedRoute> <Vacations /> </ProtectedRoute> }/>
          <Route path="/home_office" element={ <ProtectedRoute> <HomeOffice /> </ProtectedRoute> }/>
          <Route path="/my_requests" element={ <ProtectedRoute> <MyRequests /> </ProtectedRoute> }/>
          <Route path="/admin_panel" element={ <ProtectedRoute> <AdminPanel /> </ProtectedRoute> }/>
          <Route path="/profile" element={ <ProtectedRoute> <Profile /> </ProtectedRoute> }/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
