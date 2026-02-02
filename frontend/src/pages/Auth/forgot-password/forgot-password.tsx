import { useState } from "react";
import './forgot-password.css';
import { 
    Box, 
    Button, 
    Link, 
    TextField, 
    Typography,
    Paper,
    Alert,
    CircularProgress,
    InputAdornment,
} from "@mui/material";
import { EmailOutlined, ArrowBack, SendOutlined } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../AuthLayout';

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!email.trim()) {
            setError("Please enter your email address");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        
        try {
            // TODO: Replace with actual forgot password API call
            // const response = await forgotPassword(email);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setSuccess(true);
        } catch (error: any) {
            setError(error.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout type="forgot-password" title="Reset Password" subtitle="We'll help you get back in">
            <Paper elevation={0} className="auth-form-paper">
                <Box className="auth-form-header">
                    <Box className="auth-icon-wrapper">
                        <SendOutlined className="auth-icon" />
                    </Box>
                    <Typography variant="h4" className="auth-form-title" gutterBottom>
                        Reset Password
                    </Typography>
                    <Typography variant="body2" className="auth-form-subtitle">
                        {success 
                            ? "Check your email for password reset instructions"
                            : "Enter your email address and we'll send you a link to reset your password"
                        }
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {success ? (
                    <Box className="success-container">
                        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                            Password reset link has been sent to your email address.
                        </Alert>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => navigate('/login')}
                            className="auth-button"
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Back to Login
                        </Button>
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleSubmit} className="auth-form">
                        <TextField
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            className="auth-input"
                            placeholder="Enter your email"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlined className="input-icon" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: '#667eea',
                                    },
                                },
                            }}
                        />

                        <Button 
                            type="submit" 
                            variant="contained" 
                            fullWidth 
                            className="auth-button"
                            disabled={loading}
                            sx={{
                                mt: 2,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <>
                                    Send Reset Link
                                </>
                            )}
                        </Button>

                        <Box className="auth-footer">
                            <Link 
                                href="/login" 
                                className="auth-link"
                                sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    gap: 1,
                                }}
                            >
                                <ArrowBack fontSize="small" />
                                Back to Login
                            </Link>
                        </Box>
                    </Box>
                )}
            </Paper>
        </AuthLayout>
    );
}

export default ForgotPassword;
