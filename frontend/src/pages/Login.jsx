import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser } from '../utils/api';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Show success message if redirected from registration
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
        }
    }, [location]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await loginUser({
                email: formData.email,
                password: formData.password
            });
            
            // Store the token in localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('userEmail', formData.email);
            
            // Navigate to dashboard
            navigate('/dashboard');
        } catch (error) {
            setErrors({
                general: error.message || 'Login failed. Please check your credentials.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-background">
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                    <div className="shape shape-4"></div>
                </div>
            </div>
            
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="logo-container">
                            <div className="logo-icon">⏰</div>
                            <h1 className="app-title">Productivity Hub</h1>
                        </div>
                        <p className="app-subtitle">Sign in to your account</p>
                    </div>
                    
                    {successMessage && (
                        <div className="success-message">
                            {successMessage}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="login-form">
                        {errors.general && (
                            <div className="error-message">
                                {errors.general}
                            </div>
                        )}
                        
                        <div className="form-group">
                            <div className="input-container">
                                <span className="input-icon">📧</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className={`login-input ${errors.email ? 'error' : ''}`}
                                    required
                                />
                                <div className="input-line"></div>
                            </div>
                            {errors.email && <span className="field-error">{errors.email}</span>}
                        </div>
                        
                        <div className="form-group">
                            <div className="input-container">
                                <span className="input-icon">🔒</span>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className={`login-input ${errors.password ? 'error' : ''}`}
                                    required
                                />
                                <div className="input-line"></div>
                            </div>
                            {errors.password && <span className="field-error">{errors.password}</span>}
                        </div>
                        
                        <button 
                            type="submit" 
                            className={`login-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="loading-spinner">
                                    <div className="spinner"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <span className="arrow">→</span>
                                </>
                            )}
                        </button>
                    </form>
                    <div className="login-footer">
                        <p className="login-link">
                            Don't have an account? <Link to="/register">Sign up here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;