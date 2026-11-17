import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadReport from './pages/UploadReport';
import AddVitals from './pages/AddVitals';
import ViewReport from './pages/ViewReport';
import TimelineView from './pages/TimelineView';
import { getCurrentUser } from './features/auth/authThunk';

function AuthBootstrap() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user && localStorage.getItem('healthMateID')) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, user]);

  return null;
}

function AuthRoute({ children, guestOnly = false }) {
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = Boolean(token || localStorage.getItem('token'));

  if (guestOnly && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!guestOnly && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AuthBootstrap />
        <Layout>
          <Routes>
            <Route path="/" element={<AuthRoute guestOnly><Login /></AuthRoute>} />
            <Route path="/dashboard" element={<AuthRoute><Dashboard /></AuthRoute>} />
            <Route path="/upload" element={<AuthRoute><UploadReport /></AuthRoute>} />
            <Route path="/vitals" element={<AuthRoute><AddVitals /></AuthRoute>} />
            <Route path="/report/:id" element={<AuthRoute><ViewReport /></AuthRoute>} />
            <Route path="/timeline" element={<AuthRoute><TimelineView /></AuthRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}