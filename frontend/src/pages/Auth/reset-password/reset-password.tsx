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
import { 
    Visibility, 
    VisibilityOff, 
    LockOutlined,
    LockResetOutlined,
    ArrowBack,
} from "@mui/icons-material";
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthLayout from '../AuthLayout';
import './reset-password.css';
import { toast } from "react-toastify";
import { resetPassword } from '../service.tsx';

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');

    const [oldPassword, setOldPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if(!oldPassword.trim()) {
            setError("Please enter your old password");
            setLoading(false);
            return;
        }

        if (!password.trim()) {
            setError("Please enter a new password");
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            setLoading(false);
            return;
        }

        if (!confirmPassword.trim()) {
            setError("Please confirm your password");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        const payLoad: any = {
            email: email,
            oldPassword: oldPassword,
            newPassword: password,
        }

        try {
            resetPassword(payLoad).then((response: any) => {
                if (response && response.data && response.data.status === 200) {
                    toast.success(response.data.message);
                    setTimeout(() => {
                        navigate('/login');
                    }, 1000);
                }
            }).catch((error: any) => {
                toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
                setLoading(false);
            });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <AuthLayout type="forgot-password" title="Reset Password" subtitle="Enter your new password">
            <Paper elevation={0} className="auth-form-paper">
                <Box className="auth-form-header">
                    <Box className="auth-icon-wrapper">
                        <LockResetOutlined className="auth-icon" />
                    </Box>
                    <Typography variant="h4" className="auth-form-title" gutterBottom>
                        Reset Password
                    </Typography>
                    <Typography variant="body2" className="auth-form-subtitle">
                        Please enter your new password below
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} className="auth-form">

                    <TextField
                        label="Old Password"
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => {
                            setOldPassword(e.target.value);
                            setError("");
                        }}
                        required
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        className="auth-input"
                        placeholder="Enter your old password"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlined className="input-icon" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        edge="end"
                                        aria-label={showOldPassword ? "Hide password" : "Show password"}
                                        className="password-toggle"
                                    >
                                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
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

                    <TextField
                        label="New Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                        }}
                        required
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        className="auth-input"
                        placeholder="Enter your new password"
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

                    <TextField
                        label="Confirm New Password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setError("");
                        }}
                        required
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        className="auth-input"
                        placeholder="Confirm your new password"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlined className="input-icon" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        className="password-toggle"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                            'Reset Password'
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
            </Paper>
        </AuthLayout>
    );
}

export default ResetPassword;

