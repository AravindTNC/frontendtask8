import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Welcome to Dashboard!</h1>
            <p>You are successfully logged in.</p>
            <button 
                onClick={handleLogout}
                style={{
                    marginTop: '20px',
                    padding: '12px 24px',
                    background: '#5D87FF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;