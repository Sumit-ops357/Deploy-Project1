import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await registerUser({
                email: formData.email,
                password: formData.password
            });
            
            // Registration successful, redirect to login
            navigate('/login', { 
                state: { message: 'Registration successful! Please log in.' }
            });
        } catch (error) {
            setErrors({
                general: error.message || 'Registration failed. Please try again.'
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
                        <p className="app-subtitle">Create your account to get started</p>
                    </div>
                    
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
                                    placeholder="Create a password"
                                    className={`login-input ${errors.password ? 'error' : ''}`}
                                    required
                                />
                                <div className="input-line"></div>
                            </div>
                            {errors.password && <span className="field-error">{errors.password}</span>}
                        </div>
                        
                        <div className="form-group">
                            <div className="input-container">
                                <span className="input-icon">🔒</span>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    className={`login-input ${errors.confirmPassword ? 'error' : ''}`}
                                    required
                                />
                                <div className="input-line"></div>
                            </div>
                            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                        </div>
                        
                        <button 
                            type="submit" 
                            className={`login-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="loading-spinner">
                                    <div className="spinner"></div>
                                    <span>Creating account...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <span className="arrow">→</span>
                                </>
                            )}
                        </button>
                    </form>
                    
                    <div className="login-footer">
                        <p className="login-link">
                            Already have an account? <Link to="/login">Sign in here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;