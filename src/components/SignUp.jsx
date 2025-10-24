import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import './Auth.css';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'USER'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await authService.register(formData);
            setSuccess(response.message);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = () => {
        authService.loginWithGoogle();
    };

    const handleGithubSignup = () => {
        authService.loginWithGithub();
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="welcome-section">
                    <h1>Welcome to<br/>MaterialM</h1>
                    <p>MaterialM helps developers to build organized and well coded dashboards full of beautiful and rich modules.</p>
                    <button className="learn-more-btn">Learn More</button>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-box">
                    <div className="logo">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <path d="M20 0L40 20L20 40L0 20L20 0Z" fill="#5D87FF"/>
                        </svg>
                    </div>
                    
                    <h2>Sign Up</h2>
                    <p className="subtitle">This sign-up is made with NextAuth</p>

                    <div className="oauth-buttons">
                        <button className="oauth-btn google-btn" onClick={handleGoogleSignup}>
                            <img src="https://www.google.com/favicon.ico" alt="Google" />
                            With Google
                        </button>
                        <button className="oauth-btn github-btn" onClick={handleGithubSignup}>
                            <img src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" />
                            With Github
                        </button>
                    </div>

                    <div className="divider">
                        <span>or sign up with</span>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                required
                                style={{ marginTop: '10px' }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </form>

                    <p className="switch-auth">
                        Already have an Account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;