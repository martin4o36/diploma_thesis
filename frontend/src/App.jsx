import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Home from './home_page/Home';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function Logout() {
	localStorage.clear();
	return <Navigate to="/login" />;
}

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
					<Route path="/login" element={<Login />} />
					<Route path="/logout" element={<Logout />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
