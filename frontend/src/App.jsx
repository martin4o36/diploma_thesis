import './App.css'
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from './pages/Login'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route 
            path='/'
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
