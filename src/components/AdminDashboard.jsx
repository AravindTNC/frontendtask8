import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../services/authService';
import './Dashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        verifiedUsers: 0,
        adminUsers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAdminData();
    }, []);

    const loadAdminData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const [profileRes, usersRes] = await Promise.all([
                axios.get('http://localhost:8080/auth/user/profile', config),
                axios.get('http://localhost:8080/auth/admin/users', config)
            ]);

            setAdmin(profileRes.data);
            setUsers(usersRes.data);

            // Calculate stats
            const totalUsers = usersRes.data.length;
            const verifiedUsers = usersRes.data.filter(u => u.emailVerified).length;
            const adminUsers = usersRes.data.filter(u => u.role === 'ADMIN').length;

            setStats({ totalUsers, verifiedUsers, adminUsers });
        } catch (error) {
            console.error('Failed to load admin data:', error);
            if (error.response?.status === 403) {
                alert('Access denied. Admin privileges required.');
                navigate('/user-dashboard');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await authService.logout();
        navigate('/login');
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`http://localhost:8080/auth/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('User deleted successfully');
            loadAdminData();
        } catch (error) {
            alert('Failed to delete user: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav admin-nav">
                <div className="nav-brand">
                    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                        <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="#dc2626"/>
                    </svg>
                    <span>Admin Panel</span>
                </div>
                <div className="nav-menu">
                    <button className="nav-item active">Dashboard</button>
                    <button className="nav-item">Users</button>
                    <button className="nav-item">Settings</button>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </nav>

            <div className="dashboard-content">
                <div className="dashboard-header">
                    <h1>Admin Dashboard 🛡️</h1>
                    <p>Manage users and monitor system activity.</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#dbeafe' }}>
                            <span style={{ color: '#2563eb', fontSize: '24px' }}>👥</span>
                        </div>
                        <div className="stat-info">
                            <h3>Total Users</h3>
                            <p className="stat-value">{stats.totalUsers}</p>
                            <p className="stat-label">Registered Accounts</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#dcfce7' }}>
                            <span style={{ color: '#16a34a', fontSize: '24px' }}>✓</span>
                        </div>
                        <div className="stat-info">
                            <h3>Verified</h3>
                            <p className="stat-value">{stats.verifiedUsers}</p>
                            <p className="stat-label">Email Verified</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#fef3c7' }}>
                            <span style={{ color: '#d97706', fontSize: '24px' }}>👑</span>
                        </div>
                        <div className="stat-info">
                            <h3>Admins</h3>
                            <p className="stat-value">{stats.adminUsers}</p>
                            <p className="stat-label">Admin Accounts</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: '#fce7f3' }}>
                            <span style={{ color: '#db2777', fontSize: '24px' }}>👤</span>
                        </div>
                        <div className="stat-info">
                            <h3>Regular Users</h3>
                            <p className="stat-value">{stats.totalUsers - stats.adminUsers}</p>
                            <p className="stat-label">Standard Accounts</p>
                        </div>
                    </div>
                </div>

                <div className="users-section">
                    <div className="section-header">
                        <h2>User Management</h2>
                    </div>
                    <div className="users-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`badge ${user.role === 'ADMIN' ? 'admin-badge' : 'user-badge'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.emailVerified ? 'verified-badge' : 'unverified-badge'}`}>
                                                {user.emailVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className="delete-btn"
                                                onClick={() => handleDeleteUser(user.id)}
                                                disabled={user.id === admin?.id}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
