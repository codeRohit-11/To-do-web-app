import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import BoardDetails from './components/BoardDetails';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthForm />} />
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/board/:id" element={
          <PrivateRoute>
            <BoardDetails />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
