import { useState } from "react";
import {
    Box,
    Link,
    Button,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    Paper,
    Alert,
    CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined, EmailOutlined } from "@mui/icons-material";
import { login } from '../service.tsx';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../AuthLayout';
import './login.css';
import { toast } from "react-toastify";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            const response = await login({ email, password });
            if (response && response.data && response.data.status === 200) {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate('/home');
                }, 1000);
                setLoading(false);
            } else {
                setError(response.data.message || "Invalid credentials. Please try again.");
                toast.error(response.data.message || "Invalid credentials. Please try again.");
                setLoading(false);
            }
        } catch (error: any) {
            setError(error.response?.data?.message || "Invalid credentials. Please try again.");
            setLoading(false);
        }
    };

    return (
        <AuthLayout type="login" title="Welcome Back" subtitle="Sign in to continue to your account">
            <Paper elevation={0} className="auth-form-paper">
                <Box className="auth-form-header">
                    <Typography variant="h4" className="auth-form-title" gutterBottom>
                        Sign In
                    </Typography>
                    <Typography variant="body2" className="auth-form-subtitle">
                        Enter your credentials to access your account
                    </Typography>
                </Box>

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

                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        className="auth-input"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlined className="input-icon" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="password-toggle"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
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

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error.split('\n').map((err: string, index: number) => (
                                <Box key={index} component="div" sx={{ mb: index < error.split('\n').length - 1 ? 0.5 : 0 }}>
                                    • {err}
                                </Box>
                            ))}
                        </Alert>
                    )}

                    <Box className="auth-actions">
                        <Link 
                            href="/forgot-password" 
                            underline="hover" 
                            className="auth-link"
                        >
                            Forgot Password?
                        </Link>
                    </Box>

                    <Button 
                        type="submit" 
                        variant="contained" 
                        fullWidth 
                        className="auth-button"
                        disabled={loading}
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                    </Button>

                    <Box className="auth-footer">
                        <Typography variant="body2" className="auth-footer-text">
                            Don't have an account?{' '}
                            <Link href="/signup" className="auth-link auth-link-bold">
                                Sign Up
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </AuthLayout>
    );
}

export default Login;
