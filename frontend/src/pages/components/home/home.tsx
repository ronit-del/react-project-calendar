import { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Menu,
    MenuItem,
    Avatar,
    Tooltip,
    Container,
    Paper,
} from '@mui/material';
import {
    AccountCircle,
    Logout,
    Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './home.css';

function Home() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        // Clear any stored tokens or user data here if needed
        // localStorage.clear();
        toast.success('Logged out successfully');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    return (
        <Box className="dashboard-container">
            <AppBar position="static" className="dashboard-appbar">
                <Toolbar className="dashboard-toolbar">
                    <Box className="dashboard-logo-section">
                        <DashboardIcon className="dashboard-icon" />
                        <Typography variant="h6" component="div" className="dashboard-title">
                            Dashboard
                        </Typography>
                    </Box>
                    <Box className="dashboard-actions">
                        <Tooltip title="Profile">
                            <IconButton
                                onClick={handleProfileMenuOpen}
                                size="small"
                                className="profile-icon-button"
                                aria-controls={open ? 'profile-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Avatar className="profile-avatar">
                                    <AccountCircle />
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id="profile-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            className="profile-menu"
                        >
                            <MenuItem onClick={handleMenuClose}>
                                <AccountCircle className="menu-icon" />
                                Profile
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <Logout className="menu-icon" />
                                Logout
                            </MenuItem>
                        </Menu>
                        <Tooltip title="Logout">
                            <IconButton
                                onClick={handleLogout}
                                className="logout-icon-button"
                                aria-label="logout"
                            >
                                <Logout />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" className="dashboard-content">
                <Paper elevation={3} className="dashboard-paper">
                    <Typography variant="h4" component="h1" gutterBottom className="dashboard-welcome">
                        Welcome to Dashboard
                    </Typography>
                    <Typography variant="body1" className="dashboard-subtitle">
                        This is your dashboard. You can add your content here.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}

export default Home;