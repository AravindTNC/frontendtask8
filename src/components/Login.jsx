import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [rememberDevice, setRememberDevice] = useState(false);
    const [error, setError] = useState('');
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
        setLoading(true);

        try {
            const response = await authService.login(formData);
            
            if (response.requires2FA) {
                // Handle 2FA (you can add this later)
                alert('2FA required. Feature coming soon!');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        authService.loginWithGoogle();
    };

    const handleGithubLogin = () => {
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
                    
                    <h2>Sign In</h2>
                    <p className="subtitle">This login is made with NextAuth</p>

                    <div className="oauth-buttons">
                        <button className="oauth-btn google-btn" onClick={handleGoogleLogin}>
                            <img src="https://www.google.com/favicon.ico" alt="Google" />
                            With Google
                        </button>
                        <button className="oauth-btn github-btn" onClick={handleGithubLogin}>
                            <img src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" />
                            With Github
                        </button>
                    </div>

                    <div className="divider">
                        <span>or sign in with</span>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="demo1234@gmail.com"
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

                        <div className="remember-device">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberDevice}
                                onChange={(e) => setRememberDevice(e.target.checked)}
                            />
                            <label htmlFor="remember">Remeber this Device</label>
                        </div>

                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
             <div className="forgot-password-link">
           <Link to="/forgot-password">Forgot Password?</Link>
            </div>
                    </form>

                    <p className="switch-auth">
                        New to MaterialM? <Link to="/signup">Create an account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
