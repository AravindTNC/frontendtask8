import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './Dashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
        try {
            const profile = await authService.getUserProfile();
            setUser(profile);
        } catch (error) {
            console.error('Failed to load profile:', error);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                        <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="#5D87FF"/>
                    </svg>
                    <span>MaterialM</span>
                </div>
                <div className="nav-menu">
                    <button className="nav-item active">Dashboard</button>
                    <button className="nav-item">Profile</button>
                    <button className="nav-item">Settings</button>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </nav>

            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Welcome back, {user?.firstName}! 👋</h1>
                    <p>Here's what's happening with your account today.</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#e3f2fd' }}>
                            <span style={{ color: '#2196F3' }}>👤</span>
                        </div>
                        <div className="stat-info">
                            <h3>Profile</h3>
                            <p className="stat-value">{user?.name}</p>
                            <p className="stat-label">Full Name</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#f3e5f5' }}>
                            <span style={{ color: '#9c27b0' }}>📧</span>
                        </div>
                        <div className="stat-info">
                            <h3>Email</h3>
                            <p className="stat-value">{user?.email}</p>
                            <p className="stat-label">Contact</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#e8f5e9' }}>
                            <span style={{ color: '#4caf50' }}>✓</span>
                        </div>
                        <div className="stat-info">
                            <h3>Status</h3>
                            <p className="stat-value">
                                {user?.emailVerified ? 'Verified' : 'Not Verified'}
                            </p>
                            <p className="stat-label">Account Status</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#fff3e0' }}>
                            <span style={{ color: '#ff9800' }}>🔒</span>
                        </div>
                        <div className="stat-info">
                            <h3>Role</h3>
                            <p className="stat-value">{user?.role}</p>
                            <p className="stat-label">Access Level</p>
                        </div>
                    </div>
                </div>

                <div className="profile-section">
                    <div className="section-card">
                        <h2>Profile Information</h2>
                        <div className="profile-details">
                            <div className="detail-row">
                                <span className="detail-label">First Name:</span>
                                <span className="detail-value">{user?.firstName}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Last Name:</span>
                                <span className="detail-value">{user?.lastName}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{user?.email}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Role:</span>
                                <span className="badge user-badge">{user?.role}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Verification:</span>
                                <span className={`badge ${user?.emailVerified ? 'verified-badge' : 'unverified-badge'}`}>
                                    {user?.emailVerified ? 'Verified' : 'Not Verified'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
