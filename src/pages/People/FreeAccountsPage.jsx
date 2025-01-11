import React, {useEffect, useState} from 'react';
import {
    Box,
    Button, IconButton,
    SwipeableDrawer,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import UserService from '../../services/UserService';

import CachedTwoToneIcon from '@mui/icons-material/CachedTwoTone';
import AddIcon from '@mui/icons-material/Add';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

const FreeAccountsPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerType, setDrawerType] = useState(''); // 'add' or 'modify'
    const [drawerData, setDrawerData] = useState({}); // Stores data for the drawer
    const [newAccount, setNewAccount] = useState({name: '', email: '', password: ''});

    const email = localStorage.getItem('dms_login_email');
    const userId = localStorage.getItem("dms_user_id");

    // Fetch user info and accounts on page load
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const accountsList = await UserService.getFreeAccounts(userId);
                setAccounts(accountsList);
                setFilteredAccounts(accountsList);
            } catch (error) {
                console.error('Error fetching user info or accounts:', error);
            }
        };

        fetchUserInfo();
    }, [email]);

    // Handle Search
    const handleSearch = (event) => {
        const keyword = event.target.value.toLowerCase();
        setSearchKeyword(keyword);

        const filtered = accounts.filter(
            (account) =>
                account.name.toLowerCase().includes(keyword) ||
                account.email.toLowerCase().includes(keyword)
        );
        setFilteredAccounts(filtered);
    };

    // Handle Refresh
    const handleRefresh = async () => {
        try {
            const accountsList = await UserService.getFreeAccounts(userId);
            setAccounts(accountsList);
            setFilteredAccounts(accountsList);
        } catch (error) {
            console.error('Error refreshing accounts:', error);
        }
    };

    // Open Drawer
    const openDrawer = (type, data = {}) => {
        setDrawerType(type);
        setDrawerData(data);
        setNewAccount(data);
        setIsDrawerOpen(true);
    };

    // Close Drawer
    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setDrawerType('');
        setDrawerData({});
        setNewAccount({name: '', email: '', password: ''});
    };

    // Handle Input Changes
    const handleInputChange = (field, value) => {
        setNewAccount((prev) => ({...prev, [field]: value}));
    };

    // Add Free Account
    const handleAddFreeAccount = async () => {
        try {
            await UserService.addFreeUser(newAccount.name, newAccount.password, newAccount.email, userId);
            alert('Free account added successfully!');
            closeDrawer();
            handleRefresh(); // Refresh the accounts list
        } catch (error) {
            console.error('Error adding free account:', error);
            alert('Failed to add free account.');
        }
    };

    // Modify Account
    const handleModifyAccount = async () => {
        try {
            await UserService.modifyUser(drawerData.id, newAccount.name, newAccount.password, newAccount.email);
            alert('Account modified successfully!');
            closeDrawer();
            handleRefresh(); // Refresh the accounts list
        } catch (error) {
            console.error('Error modifying account:', error);
            alert('Failed to modify account.');
        }
    };

    // Drawer Content
    const renderDrawerContent = () => {
        const isAdd = drawerType === 'add';
        return (
            <Box
                sx={{
                    width: 350,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Typography variant="h6">{isAdd ? 'Add New Free Account' : 'Modify Account'}</Typography>
                <TextField
                    label="Name"
                    value={newAccount.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Email"
                    value={newAccount.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Password"
                    type="password"
                    value={newAccount.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    fullWidth
                />
                <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 2}}>
                    <Button onClick={closeDrawer} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        onClick={isAdd ? handleAddFreeAccount : handleModifyAccount}
                        variant="contained"
                        color="primary"
                    >
                        Confirm
                    </Button>
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{p: 3}}>
            {/* First Row: Title and Buttons */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Free Accounts</Typography>
                <Box>
                    <Button variant="outlined" onClick={handleRefresh} sx={{mr: 1, height: 48}}>
                        <CachedTwoToneIcon></CachedTwoToneIcon>
                    </Button>
                    <Button variant="contained" color="primary" sx={{height: 48}} onClick={() => openDrawer('add')}>
                        <AddIcon></AddIcon> Create New
                    </Button>
                </Box>
            </Box>

            {/* Second Row: Search Bar */}
            <TextField
                label="Search Accounts"
                variant="outlined"
                fullWidth
                value={searchKeyword}
                onChange={handleSearch}
                sx={{mb: 2}}
            />

            {/* Third Row: Accounts Table */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Create Date</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredAccounts.map((account) => (
                        <TableRow key={account.id}>
                            <TableCell>{account.name}</TableCell>
                            <TableCell>{account.email}</TableCell>
                            <TableCell>{account.createdAt}</TableCell>
                            <TableCell>
                                <IconButton
                                    sx={{padding:0, margin:0}}
                                    onClick={() => openDrawer('modify', account)} // Pass the selected account
                                >
                                    <EditTwoToneIcon></EditTwoToneIcon>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Swipeable Drawer */}
            <SwipeableDrawer
                anchor="right"
                open={isDrawerOpen}
                onClose={closeDrawer}
                onOpen={() => setIsDrawerOpen(true)} // Required for SwipeableDrawer
            >
                {renderDrawerContent()}
            </SwipeableDrawer>
        </Box>
    );
};

export default FreeAccountsPage;
