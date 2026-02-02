import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { LockOutlined, PersonAddOutlined, LockResetOutlined } from '@mui/icons-material';
import './AuthLayout.css';

interface AuthLayoutProps {
    children: ReactNode;
    type: 'login' | 'signup' | 'forgot-password';
    title: string;
    subtitle: string;
}

function AuthLayout({ children, type, title, subtitle }: AuthLayoutProps) {
    useEffect(() => {
        // Add class to body to override root constraints
        document.body.classList.add('auth-page-active');
        const rootElement = document.getElementById('root');
        if (rootElement) {
            rootElement.style.maxWidth = '100%';
            rootElement.style.margin = '0';
            rootElement.style.padding = '0';
            rootElement.style.width = '100vw';
        }

        // Hide scroll for login page
        if (type === 'login') {
            document.body.style.overflow = 'hidden';
            if (rootElement) {
                rootElement.style.overflow = 'hidden';
            }
        } else if (type === 'signup') {
            // For signup, hide body scroll but allow right panel scroll
            document.body.style.overflow = 'hidden';
            if (rootElement) {
                rootElement.style.overflow = 'hidden';
            }
        }

        return () => {
            // Cleanup on unmount
            document.body.classList.remove('auth-page-active');
            document.body.style.overflow = '';
            const root = document.getElementById('root');
            if (root) {
                root.style.maxWidth = '';
                root.style.margin = '';
                root.style.padding = '';
                root.style.width = '';
                root.style.overflow = '';
            }
        };
    }, [type]);

    const getIcon = () => {
        switch (type) {
            case 'login':
                return <LockOutlined sx={{ fontSize: 80 }} />;
            case 'signup':
                return <PersonAddOutlined sx={{ fontSize: 80 }} />;
            case 'forgot-password':
                return <LockResetOutlined sx={{ fontSize: 80 }} />;
            default:
                return <LockOutlined sx={{ fontSize: 80 }} />;
        }
    };

    const getSlogan = () => {
        switch (type) {
            case 'login':
                return 'Welcome back! We\'re excited to have you here.';
            case 'signup':
                return 'Join thousands of users who trust our platform.';
            case 'forgot-password':
                return 'Don\'t worry, we\'ll help you get back in.';
            default:
                return '';
        }
    };

    return (
        <Box className={`auth-layout-container auth-layout-${type}`}>
            {/* Left Side - Branding Section */}
            <Box className="auth-left-panel">
                <Box className="auth-branding-content">
                    <Box className="auth-logo-wrapper">
                        {getIcon()}
                    </Box>
                    <Typography variant="h3" className="auth-branding-title">
                        {title}
                    </Typography>
                    <Typography variant="h6" className="auth-branding-subtitle">
                        {subtitle || getSlogan()}
                    </Typography>
                    <Box className="auth-features">
                        <Box className="auth-feature-item">
                            <Box className="auth-feature-icon">✓</Box>
                            <Typography variant="body1">Secure & Reliable</Typography>
                        </Box>
                        <Box className="auth-feature-item">
                            <Box className="auth-feature-icon">✓</Box>
                            <Typography variant="body1">Easy to Use</Typography>
                        </Box>
                        <Box className="auth-feature-item">
                            <Box className="auth-feature-icon">✓</Box>
                            <Typography variant="body1">24/7 Support</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box className="auth-decorative-shapes">
                    <Box className="shape shape-1"></Box>
                    <Box className="shape shape-2"></Box>
                    <Box className="shape shape-3"></Box>
                </Box>
            </Box>

            {/* Right Side - Form Section */}
            <Box className="auth-right-panel">
                <Box className="auth-form-wrapper">
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

export default AuthLayout;

