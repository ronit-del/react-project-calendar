import { useState } from "react";
import {
    Autocomplete,
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
    FormControl,
} from "@mui/material";
import { 
    Visibility, 
    VisibilityOff,
    LockOutlined,
    EmailOutlined,
    PersonOutlined,
    PhoneOutlined,
    LocationOnOutlined,
    LocationCityOutlined,
    PublicOutlined,
    PlaceRounded, 
    LocalPostOffice,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../AuthLayout";
import { country } from "../../../assets/countryCode";
import './signup.css';
import { register } from "../service";
import { toast } from "react-toastify";

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        countryCode: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSelectChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            setLoading(false);
            return;
        }

        
        const payLoad: any = {
            ...formData,
            role: 'user',
            phone: `${formData.countryCode} ${formData.phone}`,
        }

        delete payLoad?.confirmPassword;
        delete payLoad?.countryCode;

        try {
            register(payLoad).then((response: any) => {
                if (response && response.data.status === 200) {
                    toast.success('Account created successfully. Please login to continue');
                    setTimeout(() => {
                        navigate('/login');
                    }, 1000);
                } else {
                    toast.error(response.data.message);
                }
            }).catch((error: any) => {
                const errorMessage = error.response?.data?.message;
                if (Array.isArray(errorMessage)) {
                    setError(errorMessage.join('\n'));
                } else if (errorMessage) {
                    setError(errorMessage);
                } else {
                    setError("Something went wrong. Please try again.");
                }
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message;
            if (Array.isArray(errorMessage)) {
                setError(errorMessage.join('\n'));
            } else if (errorMessage) {
                setError(errorMessage);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
    };

    return (
        <AuthLayout type="signup" title="Create Account" subtitle="Get started with your free account">
            <Paper elevation={0} className="auth-form-paper">
                <Box className="auth-form-header">
                    <Typography variant="h4" className="auth-form-title" gutterBottom>
                        Sign Up
                    </Typography>
                    <Typography variant="body2" className="auth-form-subtitle">
                        Fill in your details to create your account
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} className="auth-form">
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        className="auth-input"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlined className="input-icon" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            },
                        }}
                    />

                    <TextField
                        label="Email Address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
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
                            },
                        }}
                    />

                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
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
                                        onClick={handleTogglePassword}
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
                            },
                        }}
                    />

                    <TextField
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
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
                                        onClick={handleToggleConfirmPassword}
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
                            },
                        }}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl sx={{ flex: '0 0 35%' }} margin="normal" required>
                            <Autocomplete
                                options={country}
                                getOptionLabel={(option) => `${option.code} - ${option.label}`}
                                value={country.find(c => c.code === formData.countryCode) || null}
                                onChange={(_, newValue) => {
                                    handleSelectChange({
                                    target: {
                                        name: "countryCode",
                                        value: newValue?.code || "",
                                    },
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        label="Country Code"
                                        className="auth-input"
                                    />
                                )}
                                sx={{
                                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                                }}
                            />
                        </FormControl>

                        <TextField
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            margin="normal"
                            variant="outlined"
                            className="auth-input"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PhoneOutlined className="input-icon" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                flex: '1 1 auto',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />
                    </Box>

                    <TextField
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocationOnOutlined className="input-icon" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            },
                        }}
                    />

                    <TextField
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocationCityOutlined className="input-icon" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            },
                        }}
                    />

                    <TextField
                        label="Zip"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocalPostOffice className="input-icon" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            },
                        }}
                    />

                    <TextField
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PlaceRounded className="input-icon" />
                            </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            },
                        }}
                    />

                    <FormControl sx={{ width: '100%' }} margin="normal" required>
                        <Autocomplete
                            options={country}
                            getOptionLabel={(option) => option.value}
                            value={country.find(c => c.value === formData.country) || null}
                            onChange={(_, newValue) => {
                            handleSelectChange({
                                target: {
                                name: "country",
                                value: newValue?.value || "",
                                },
                            });
                            }}
                            renderInput={(params) => (
                            <TextField
                                {...params}
                                required
                                label="Country"
                                className="auth-input"
                                InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                    <PublicOutlined className="input-icon" />
                                    </InputAdornment>
                                ),
                                }}
                                sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                                }}
                            />
                            )}
                            sx={{
                            '& .MuiOutlinedInput-root': { borderRadius: 2 },
                            }}
                        />
                    </FormControl>

                    {error && (
                        <Alert severity="error" sx={{ mt: 3, mb: 2, borderRadius: 2 }}>
                            <Box component="div" sx={{ whiteSpace: 'pre-line' }}>
                                {error.split('\n').map((err: string, index: number) => (
                                    <Box key={index} component="div" sx={{ mb: index < error.split('\n').length - 1 ? 0.5 : 0 }}>
                                        • {err}
                                    </Box>
                                ))}
                            </Box>
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        className="auth-button"
                        disabled={loading}
                        sx={{
                            mt: 3,
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                    </Button>

                    <Box className="auth-footer">
                        <Typography variant="body2" className="auth-footer-text">
                            Already have an account?{' '}
                            <Link href="/login" className="auth-link auth-link-bold">
                                Sign In
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </AuthLayout>
    );
}

export default Signup;
