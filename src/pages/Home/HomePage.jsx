// pages/Home/HomePage.jsx

import React, {useEffect, useState} from 'react';
import {Outlet} from 'react-router-dom';
import {Box, Typography} from '@mui/material';
import SecondaryTopBar from '../../components/TopBar/SecondaryTopBar';
import SideMenu from '../../components/SideMenu';
import UserService from "../../services/UserService";
import {useNavigate} from 'react-router-dom';

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
                console.error('Error fetching user info or accounts:', error);
            }
        };
        navigate("/home/Dashboard");
        fetchUserInfo();
    }, [email]);

    const toggleMenuCollapse = () => {
        setIsCollapsed((prev) => !prev);
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
                    left: isCollapsed ? 80: 289,
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
                            <Outlet/>
                        </Box>
                    </Box>
                </Box>


        </Box>
    );
};


export default HomePage;
