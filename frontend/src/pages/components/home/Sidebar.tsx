import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material';
import { AccountCircle, Logout, Dashboard as DashboardIcon, Close as CloseIcon, BookOutlined as BookIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUser } from '../../Auth/service';
import './Sidebar.css';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
}

function Sidebar({ isOpen = false, onClose, isMobile = false }: SidebarProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (onClose) {
            onClose();
        }
        getUser().then((response) => {
            if (response && response.data && response.data.status === 200) {
                toast.success('Logged out successfully');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                toast.error(response.data.message || 'Error logging out');
            }
        }).catch((error) => {
            toast.error(error.response?.data?.message || 'Error logging out');
        });
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const handleProfile = () => {
        navigate('/profile');
        // Only close sidebar on mobile if it is open
        if (isMobile && onClose) {
            onClose();
        }
    };

    const handleCreateBook = () => {
        navigate('/create-book');
        // Only close sidebar on mobile
        if (isMobile && onClose) {
            onClose();
        }
    };

    const handleDashboard = () => {
        navigate('/home');
        // Only close sidebar on mobile
        if (isMobile && onClose) {
            onClose();
        }
    };

    return (
        <Box className={`sidebar-container ${isOpen ? 'open' : ''}`}>
            <Box className="sidebar-header">
                {/* <DashboardIcon className="sidebar-logo-icon" /> */}
                <Box className="sidebar-title">Calendar Photo</Box>
                {onClose && (
                    <IconButton
                        className="sidebar-close-button"
                        onClick={onClose}
                        aria-label="close sidebar"
                    >
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>
            <Divider className="sidebar-divider" />
            <Box className="sidebar-content">
                <List className="sidebar-list">
                    <ListItem disablePadding className="sidebar-list-item">
                        <ListItemButton 
                            className="sidebar-button"
                            onClick={handleDashboard}
                        >
                            <ListItemIcon className="sidebar-icon">
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText 
                                primary="Dashboard" 
                                className="sidebar-text"
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding className="sidebar-list-item">
                        <ListItemButton 
                            className="sidebar-button"
                            onClick={handleCreateBook}
                        >
                            <ListItemIcon className="sidebar-icon">
                                <BookIcon />
                            </ListItemIcon>
                            <ListItemText 
                                primary="Create Book" 
                                className="sidebar-text"
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding className="sidebar-list-item">
                        <ListItemButton 
                            className="sidebar-button"
                            onClick={handleProfile}
                        >
                            <ListItemIcon className="sidebar-icon">
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText 
                                primary="Profile" 
                                className="sidebar-text"
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Box className="sidebar-footer">
                    <List className="sidebar-list">
                        <ListItem disablePadding className="sidebar-list-item">
                            <ListItemButton 
                                className="sidebar-button sidebar-logout-button"
                                onClick={handleLogout}
                            >
                                <ListItemIcon className="sidebar-icon">
                                    <Logout />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Logout" 
                                    className="sidebar-text"
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Box>
        </Box>
    );
}

export default Sidebar;

