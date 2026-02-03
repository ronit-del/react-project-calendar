import { useState, useEffect, useRef } from 'react';
import {
    Typography,
    Box,
    Container,
    Paper,
    IconButton,
    useMediaQuery,
    useTheme,
    TextField,
    Button,
    Avatar,
    InputAdornment,
    FormControl,
    Autocomplete,
} from '@mui/material';
import { 
    Menu as MenuIcon,
    PersonOutlined,
    EmailOutlined,
    PhoneOutlined,
    LocationOnOutlined,
    Edit as EditIcon,
    Save as SaveIcon,
    LocationCityOutlined,
    PlaceRounded,
    LocalPostOffice,
    PublicOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUser } from '../../Auth/service';
import Sidebar from '../home/Sidebar';
import '../home/home.css';
import './profile.css';
import { country } from '../../../assets/countryCode';

function Profile() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));   
    const hasFetchedRef = useRef(false);
    const [user, setUser] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        countryCode: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
    });

    useEffect(() => {
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;

        try {
            getUser().then((response) => {
                if (response.data.status === 200) {
                    const userData = response.data.user;
                    const [countryCode, phoneNumber] = userData && userData?.phone ? userData.phone.split(' ') : ['', ''];
                    setUser(userData);
                    setFormData({
                        name: userData?.name || '',
                        email: userData?.email || '',
                        countryCode: countryCode || '',
                        phone: phoneNumber || '',
                        address: userData?.address || '',
                        city: userData?.city || '',
                        state: userData?.state || '',
                        zip: userData?.zip || '',
                        country: userData?.country || '',
                    });
                } else {
                    toast.error(response.data.message);
                }
            }).catch((error) => {
                if (error.response?.data?.message === 'Session expired. Please login again.') {
                    toast.error(error.response.data.message);
                    localStorage.removeItem('token');
                    setTimeout(() => {
                        navigate('/login');
                    }, 1000);
                }
                else {
                    toast.error(error.response?.data?.message || 'Failed to load profile');
                }
            });
        } catch (error: any) {
            if (error.response) {
                if (error.response.data.message === 'Session expired. Please login again.') {
                    toast.error(error.response.data.message);
                    localStorage.removeItem('token');
                    setTimeout(() => {
                        navigate('/login');
                    }, 1000);
                }
                else {
                    toast.error(error.response.data.message);
                }
            } else {
                toast.error(error.message);
            }
        }
    }, [navigate]);

    const handleSelectChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleProfileClick = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (user) {
            setFormData({
                name: user?.name || '',
                email: user?.email || '',
                countryCode: user?.countryCode || '',
                phone: user?.phone || '',
                address: user?.address || '',
                city: user?.city || '',
                state: user?.state || '',
                zip: user?.zip || '',
                country: user?.country || '',
            });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        console.log('Profile data:', formData);
    };

    const getInitials = (name: string) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    return (
        <Box className="dashboard-container">
            <Sidebar 
                isOpen={sidebarOpen} 
                onClose={closeSidebar}
                onProfileClick={handleProfileClick}
                isMobile={isMobile}
            />
            {sidebarOpen && <Box className="sidebar-overlay" onClick={closeSidebar} />}
            <Box className="dashboard-main-content">
                <Box className="dashboard-header-mobile">
                    <IconButton
                        className="menu-toggle-button"
                        onClick={toggleSidebar}
                        aria-label="toggle sidebar"
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
                <Box className="dashboard-content-wrapper profile-wrapper">
                    <Container maxWidth="lg" className="dashboard-content">
                            <Box className="profile-container">

                            <Paper elevation={3} className="profile-header-card">
                                <Box className="profile-header-content">
                                    <Avatar className="profile-avatar">
                                        {getInitials(formData.name || user?.name || 'User')}
                                    </Avatar>
                                    <Box className="profile-header-info">
                                        <Typography variant="h4" className="profile-name">
                                            {formData.name || user?.name || 'User Name'}
                                        </Typography>
                                        <Typography variant="body1" className="profile-email">
                                            {formData.email || user?.email || 'user@example.com'}
                                        </Typography>
                                    </Box>
                                    {!isEditing ? (
                                        <Button
                                            variant="contained"
                                            startIcon={<EditIcon />}
                                            onClick={handleEdit}
                                            className="profile-edit-button"
                                        >
                                            Edit Profile
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            onClick={handleCancel}
                                            className="profile-cancel-button"
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </Box>
                            </Paper>

                            <Paper elevation={3} className="profile-form-card">
                                <Typography variant="h5" className="profile-section-title">
                                    Personal Information
                                </Typography>
                                <Box component="form" onSubmit={handleSubmit} className="profile-form">
                                    <Box className="profile-form-grid">
                                        <Box className="profile-form-field profile-form-field-half">
                                            <TextField
                                                label="Name"
                                                variant="outlined"
                                                fullWidth
                                                value={formData.name}
                                                onChange={handleInputChange('name')}
                                                disabled={!isEditing}
                                                margin="normal"
                                                className="profile-input auth-input"
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
                                        </Box>

                                        <Box className="profile-form-field profile-form-field-half">
                                            <TextField
                                                label="Email Address"
                                                variant="outlined"
                                                fullWidth
                                                value={formData.email}
                                                disabled
                                                margin="normal"
                                                className="profile-input auth-input"
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
                                                        cursor: 'not-allowed',
                                                        backgroundColor: '#f5f5f5',
                                                    },
                                                }}
                                            />
                                        </Box>

                                        <Box className="profile-form-field profile-form-field-half" sx={{ display: 'flex', gap: 2 }}>
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
                                                    disabled={!isEditing}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            disabled={!isEditing}
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
                                                onChange={handleInputChange('phone')}
                                                required
                                                margin="normal"
                                                disabled={!isEditing}
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

                                        <Box className="profile-form-field profile-form-field-half">
                                            <TextField
                                                label="Address"
                                                variant="outlined"
                                                fullWidth
                                                value={formData.address}
                                                onChange={handleInputChange('address')}
                                                disabled={!isEditing}
                                                margin="normal"
                                                className="profile-input auth-input"
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
                                        </Box>

                                        <Box className="profile-form-field profile-form-field-third">
                                            <TextField
                                                label="City"
                                                variant="outlined"
                                                fullWidth
                                                value={formData.city}
                                                onChange={handleInputChange('city')}
                                                disabled={!isEditing}
                                                margin="normal"
                                                className="profile-input auth-input"
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
                                        </Box>

                                        <Box className="profile-form-field profile-form-field-third">
                                            <TextField
                                                label="State"
                                                variant="outlined"
                                                fullWidth
                                                value={formData.state}
                                                onChange={handleInputChange('state')}
                                                disabled={!isEditing}
                                                margin="normal"
                                                className="profile-input auth-input"
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
                                        </Box>

                                        <Box className="profile-form-field profile-form-field-third">
                                            <TextField
                                                label="Zip"
                                                variant="outlined"
                                                fullWidth
                                                value={formData.zip}
                                                onChange={handleInputChange('zip')}
                                                disabled={!isEditing}
                                                margin="normal"
                                                className="profile-input auth-input"
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
                                        </Box>

                                        <Box className="profile-form-field profile-form-field-half">
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
                                                    disabled={!isEditing}
                                                    renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        required
                                                        label="Country"
                                                        disabled={!isEditing}
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
                                        </Box>
                                    </Box>

                                    {isEditing && (
                                        <Box className="profile-form-actions">
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                startIcon={<SaveIcon />}
                                                className="profile-save-button"
                                            >
                                                Save Changes
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            </Paper>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </Box>
    );
}

export default Profile;
