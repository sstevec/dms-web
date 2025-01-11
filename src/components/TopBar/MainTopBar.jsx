// components/TopBar/MainTopBar.jsx

import React from 'react';
import {AppBar, Typography} from '@mui/material';

const MainTopBar = () => {
    return (
        <AppBar position="static" sx={{
            backgroundColor: '#333',
            height: "54px",
            display: 'flex',
            justifyContent: 'center',
            padding: '0 16px',
            boxShadow: "none"
        }}>

            <Typography variant="h6">
                {/* Project Name or leave as placeholder */}
                ICON 1
            </Typography>

        </AppBar>
    );
};

export default MainTopBar;
