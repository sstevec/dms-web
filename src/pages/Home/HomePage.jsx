// pages/Home/HomePage.jsx

import React, {useEffect, useState} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import {Alert, Box, Typography} from '@mui/material';
import SecondaryTopBar from '../../components/TopBar/SecondaryTopBar';
import SideMenu from '../../components/SideMenu';
import UserService from "../../services/UserService";

const HomePage = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();

    const email = localStorage.getItem('dms_login_email');
    // Fetch user info and accounts on page load
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await UserService.getAccountInfo(email);
                localStorage.setItem("dms_user_id", userInfo.id)
            } catch (error) {
                showAlert('Error fetching user info or accounts');
            }
        };
        navigate("/home/Dashboard");
        fetchUserInfo();
    }, [email]);

    const toggleMenuCollapse = () => {
        setIsCollapsed((prev) => !prev);
    };

    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success', // 'success', 'error', 'warning', 'info'
    });
    const [alertTimeout, setAlertTimeout] = useState(null);

    const showAlert = (message, severity = 'success', duration = 3000) => {
        // Clear any existing timeout
        if (alertTimeout) clearTimeout(alertTimeout);

        setAlert({ open: true, message, severity });

        // Set a new timeout for auto-close
        const timeout = setTimeout(() => {
            setAlert({ open: false, message: '', severity: '' });
        }, duration);

        setAlertTimeout(timeout);
    };

// Handle manual close
    const closeAlert = () => {
        if (alertTimeout) clearTimeout(alertTimeout); // Clear timeout
        setAlert({ open: false, message: '', severity: '' });
    };


    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: "black",
            padding: "24px 0",
            minWidth: 1300,
            overflowX: "auto",
        }}>

            {/* Left Side: Side Menu */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: isCollapsed ? 80 : 289,
                    transition: 'width 0.3s ease',
                    position: "sticky",
                    top: 0
                }}
            >
                <Box sx={{
                    height: 64,
                    display: "flex",
                }}>
                    {!isCollapsed && (
                        <Typography sx={{height: 40, margin: "12px 16px", color: "white"}} variant="h4">
                            ICON
                        </Typography>)}
                    {isCollapsed && (
                        <Typography sx={{height: 40, margin: "12px 22px", color: "white"}}>
                            ICON
                        </Typography>
                    )}
                </Box>

                <SideMenu isCollapsed={isCollapsed} toggleMenuCollapse={toggleMenuCollapse}/>
            </Box>

            {/* Right Side: Content Area */}
            <Box sx={{
                display: 'flex',
                flex: 1,
                padding: "0 32px",
                left: isCollapsed ? 80 : 289,
                right: 0,
            }}>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    borderRadius: 4,
                    backgroundColor: "white",
                    overflow: "hidden"
                }}>
                    {/* Secondary Top Bar */}
                    <Box sx={{
                        zIndex: 900,
                        position: 'sticky', // Ensures the top bar remains visible during scroll
                        top: 0,
                    }}>
                        <SecondaryTopBar toggleMenuCollapse={toggleMenuCollapse}/>
                    </Box>

                    {/* Main Content */}
                    <Box sx={{flex: 1, overflowY: 'auto'}}>
                        <Outlet context={{ showAlert }} />
                    </Box>
                </Box>
            </Box>

            {alert.open && (
                <Alert
                    severity={alert.severity}
                    onClose={closeAlert}
                    sx={{
                        position: 'fixed',
                        top: 16, // Distance from the top of the screen
                        left: '50%', // Center horizontally
                        transform: 'translateX(-50%)', // Adjust to center
                        zIndex: 1300, // Ensure it appears above other elements
                        width: '80%', // Adjust width
                        maxWidth: 600, // Optional max width
                    }}
                >
                    {alert.message}
                </Alert>
            )}
        </Box>
    );
};


export default HomePage;
