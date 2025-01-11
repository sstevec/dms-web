// pages/Dashboard/DashboardPage.jsx

import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const DashboardPage = () => {
    return (
        <Card sx={{boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)", borderRadius: 4}}>
            <CardContent sx={{height: 1500}}>
                <Typography variant="h4">Dashboard</Typography>
            </CardContent>
        </Card>
    );
};

export default DashboardPage;
