// src/pages/Login/LoginPage.jsx

import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {AppBar, Box, Button, Stack, TextField, Toolbar, Typography} from '@mui/material';
import "./style.css"
import myImage from '../../assets/auth-side-bg.png';

import AuthenticationService from '../../services/AuthService';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await AuthenticationService.login(email, password);
            localStorage.setItem('dms_jwt_token', data);
            localStorage.setItem('dms_login_email', email);
            navigate('/home/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            // handle error display if needed
        }
    };

    const goToSignUp = () => {
        navigate('/signup');
    };

    return (
        <Box sx={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            {/* DARK TOP BAR */}
            <AppBar position="static" sx={{backgroundColor: '#333', flexShrink: 0}}>
                <Toolbar>
                    {/* Title next to the icon */}
                    <Typography variant="h6" component="div">
                        ICON 1
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* MAIN CONTENT: Flex layout with left 70% / right 30% */}
            <Box sx={{display: 'flex', flex: 1, overflow: 'hidden'}}>
                {/* LEFT SIDE (70%) - FORM */}
                <Box
                    sx={{
                        flex: '0 0 70%',  // ensures it stays at 70% width
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            width: '100%',
                            maxWidth: 400,
                            p: 4,
                            mx: 'auto',
                        }}
                    >
                        {/* ICON ABOVE "Welcome back!" */}
                        <Stack
                            spacing={1}
                            mb={3}
                        >
                            <Typography variant="h6">
                                ICON 2
                            </Typography>
                            <Typography variant="h5" className="bigBoldTitle">
                                Welcome back!
                            </Typography>
                        </Stack>

                        <Typography variant="body2" mb={3}>
                            Please enter your credentials to sign in!
                        </Typography>

                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{mb: 2}}
                        />

                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{mb: 2}}
                        />

                        <Box textAlign="right" mb={2}>
                            <Typography
                                variant="caption"
                                sx={{cursor: 'pointer'}}
                            >
                                Forgot password
                            </Typography>
                        </Box>

                        <Button type="submit" variant="contained" fullWidth>
                            Sign In
                        </Button>

                        <Box textAlign="center" mt={3}>
                            <Typography variant="body2">
                                Don’t have an account yet?{' '}
                                <Button
                                    onClick={goToSignUp}
                                    sx={{textTransform: 'none', p: 0}}
                                >
                                    Sign up
                                </Button>
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Right side (30%) - Card with rounded corners and margins */}
                <Box
                    sx={{
                        flex: '0 0 30%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // No default backgroundColor here, we'll rely on the Card's styling
                    }}
                >
                    <Box
                        sx={{
                            width: '90%',
                            mx: 'auto',
                            // Set a fixed height or some responsive logic
                            height: '90%',
                            maxHeight: '85vh',
                            borderRadius: '16px',
                            overflow: 'hidden', // Ensures image corners are clipped to the radius
                        }}
                    >
                        <img
                            src={myImage}
                            alt="Your image description"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover', // Makes the image fill while keeping aspect ratio
                                display: 'block',   // Removes default inline spacing
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default LoginPage;
