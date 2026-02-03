/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react';
import {
    Typography,
    Box,
    Container,
    Paper,
    IconButton,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './home.css';
import { getUser } from '../../Auth/service';
import Sidebar from './Sidebar';

function Home() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const hasFetchedRef = useRef(false);
    const [_, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-unused-vars
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;

        try {
            getUser().then((response) => {
                if (response.data.status === 200) {
                    setUser(response.data.data);
                } else {
                    toast.error(response.data.message);
                }
            }).catch((error) => {
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
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <Box className="dashboard-container">
            <Sidebar 
                isOpen={sidebarOpen} 
                onClose={closeSidebar}
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
                <Box className="dashboard-content-wrapper">
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
            </Box>
        </Box>
    );
}

export default Home;