// src/pages/Login/SignUpPage.jsx

import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {AppBar, Box, Button, Stack, TextField, Toolbar, Typography} from '@mui/material';
import "./style.css"
import AuthenticationService from '../../services/AuthService';
// Adjust the import if your authService is located differently

const SignUpPage = () => {
    const navigate = useNavigate();

    // State for the sign-up form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handle the sign-up form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await AuthenticationService.register(name, email, password);
            // If backend returns a token upon successful sign-up:
            if (data.token) {
                localStorage.setItem('token', data.token);
                navigate('/home/dashboard');
            } else {
                // Otherwise, go back to login
                navigate('/login');
            }
        } catch (error) {
            console.error('Sign-up failed:', error);
            // Optionally handle or display an error message
        }
    };

    // Navigate back to login page
    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <Box sx={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            {/* DARK TOP BAR */}
            <AppBar position="static" sx={{backgroundColor: '#333'}}>
                <Toolbar>
                    {/* Title next to the icon */}
                    <Typography variant="h6" component="div">
                        ICON 1
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* MAIN CONTENT with Flex layout: 70% form, 30% image */}
            <Box sx={{display: 'flex', flex: 1}}>
                {/* LEFT SIDE (70%) - SIGN-UP FORM */}
                <Box
                    sx={{
                        flex: '0 0 70%',
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
                        {/* ICON ABOVE "Create your account!" */}
                        <Stack
                            spacing={1}
                            mb={3}
                        >
                            <Typography variant="h6">
                                ICON 2
                            </Typography>
                            <Typography
                                variant="h5"
                                className="bigBoldTitle"
                            >
                                Create your account!
                            </Typography>

                            <Typography variant="body2" mb={3}>
                                Let's get your account ready in a second!
                            </Typography>
                        </Stack>

                        {/* Name Field */}
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{mb: 2}}
                        />

                        {/* Email Field */}
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{mb: 2}}
                        />

                        {/* Password Field */}
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{mb: 3}}
                        />

                        <Button type="submit" variant="contained" fullWidth>
                            Sign Up
                        </Button>

                        <Box textAlign="center" mt={3}>
                            <Typography variant="body2">
                                Already have an account?{' '}
                                <Button
                                    onClick={goToLogin}
                                    sx={{textTransform: 'none', p: 0}}
                                >
                                    Sign in
                                </Button>
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* RIGHT SIDE (30%) - IMAGE PLACEHOLDER */}
                <Box
                    sx={{
                        flex: '0 0 30%',
                        backgroundColor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Replace this with a real image or background as needed */}
                    <Typography>Image Placeholder</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default SignUpPage;
