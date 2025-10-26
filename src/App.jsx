
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import authService from './services/authService';
import axios from 'axios';

function App() {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserRole();
    }, []);

    const checkUserRole = async () => {
        const token = authService.getCurrentUser();
        if (token) {
            try {
                const response = await axios.get('http://localhost:8080/auth/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserRole(response.data.role);
            } catch (error) {
                console.error('Failed to fetch user role:', error);
                authService.logout();
            }
        }
        setLoading(false);
    };

    const PrivateRoute = ({ children, requiredRole }) => {
        const token = authService.getCurrentUser();
        
        if (!token) {
            return <Navigate to="/login" />;
        }

        if (loading) {
            return <div className="loading">Loading...</div>;
        }

        if (requiredRole && userRole !== requiredRole) {
            return <Navigate to={userRole === 'ADMIN' ? '/admin-dashboard' : '/user-dashboard'} />;
        }

        return children;
    };

    if (loading && authService.getCurrentUser()) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                <Route 
                    path="/user-dashboard" 
                    element={
                        <PrivateRoute requiredRole="USER">
                            <UserDashboard />
                        </PrivateRoute>
                    } 
                />
                
                <Route 
                    path="/admin-dashboard" 
                    element={
                        <PrivateRoute requiredRole="ADMIN">
                            <AdminDashboard />
                        </PrivateRoute>
                    } 
                />
                
                <Route 
                    path="/" 
                    element={
                        authService.getCurrentUser() 
                            ? <Navigate to={userRole === 'ADMIN' ? '/admin-dashboard' : '/user-dashboard'} />
                            : <Navigate to="/login" />
                    } 
                />
            </Routes>
        </Router>
    );
}

export default App;

