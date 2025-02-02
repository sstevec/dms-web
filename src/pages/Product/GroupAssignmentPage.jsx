import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    SwipeableDrawer,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import ProductService from "../../services/ProductService";
import productService from "../../services/ProductService";
import {useOutletContext} from "react-router-dom";
import UserService from "../../services/UserService";

const GroupAssignmentPage = () => {
    const {showAlert} = useOutletContext();
    // Mock data for groups and products
    const [groups, setGroups] = useState([
        {id: 1, name: 'Group A'},
        {id: 2, name: 'Group B'},
    ]);
    const [userData, setUserData] = useState([
        {id: 1, name: 'Product 1', provider: 'Provider A'},
        {id: 2, name: 'Product 2', provider: 'Provider B'},
    ]);
    const [userInGroup, setUserInGroup] = useState([
        {id: 3, name: 'Product 3', provider: 'Provider C'},
    ]);

    // State for filters, selections, and selected group
    const [groupSearch, setGroupSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [groupUserSearch, setGroupUserSearch] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [displayedUser, setDisplayedUser] = useState({assignedGroups: []});
    const [filters, setFilters] = useState(['Free Accounts']);
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

    const userId = localStorage.getItem('dms_user_id');


    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Fetch all groups and authorized products
                const [groupsData, userData] = await Promise.all([
                    ProductService.getGroups(userId), // Replace with the actual API function for fetching groups
                    UserService.getAllLinkedAccounts(userId, filters.includes('Free Accounts'), filters.includes('Distributors'), filters.includes('Providers'))
                ]);

                // Update state with fetched data
                setGroups(groupsData);
                setUserData(userData);

                // Clear selections and reset group-related states
                setSelectedGroup(null);
                setUserInGroup([]);
                setSelectedUsers([]);
                setSelectedGroupUsers([]);
            } catch (error) {
                showAlert('Failed to load groups and authorized products. Please try again.');
            }
        };
        loadInitialData()
    }, [userId]);

    // Fetch all accounts
    const handleQuery = async () => {
        try {
            const result = await UserService.getAllLinkedAccounts(userId, filters.includes('Free Accounts'), filters.includes('Distributors'), filters.includes('Providers'))
            setUserData(result);
        } catch (error) {
            showAlert('Error fetching accounts', 'error');
        }
    };


    // Filtered lists
    const filteredGroups = groups.filter((group) =>
        group.name.toLowerCase().includes(groupSearch.toLowerCase())
    );

    const filteredUserData = userData.filter(
        (product) =>
            product.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            product.provider.toLowerCase().includes(userSearch.toLowerCase())
    );

    const filteredGroupUser = userInGroup.filter(
        (product) =>
            product.name.toLowerCase().includes(groupUserSearch.toLowerCase()) ||
            product.provider.toLowerCase().includes(groupUserSearch.toLowerCase())
    );

    // Handlers for selection
    const handleAddToGroup = async () => {
        if (!selectedGroup) {
            showAlert('Please select a group first.', 'warning');
            return;
        }

        try {
            await Promise.all(
                selectedUsers.map((id) =>
                    ProductService.addUserToGroup(userId, id, selectedGroup.id)
                )
            );
            showAlert('User assign to the group successfully!');
            // Refresh group products
            const updatedGroupUsers = await ProductService.getUsersByGroup(
                selectedGroup.id
            );
            setUserInGroup(updatedGroupUsers);
            setSelectedUsers([]); // Clear selected products
        } catch (error) {
            showAlert('Failed to assign users to the group.', 'error');
        }
    };

    const handleRemoveFromGroup = async () => {
        if (!selectedGroup) {
            showAlert('Please select a group first.');
            return;
        }

        try {
            await Promise.all(
                selectedGroupUsers.map((id) =>
                    ProductService.removeUserFromGroup(id, selectedGroup.id)
                )
            );
            showAlert('Users removed from the group successfully!');
            // Refresh group products
            const updatedGroupUsers = await ProductService.getUsersByGroup(
                selectedGroup.id
            );
            setUserInGroup(updatedGroupUsers);
            setSelectedGroupUsers([]); // Clear selected group products
        } catch (error) {
            showAlert('Failed to remove users from the group.', 'error');
        }
    };

// Clear selected group products when changing groups
    const handleSelectGroup = (group) => {
        setSelectedGroup(group);
        setSelectedGroupUsers([]);
        // Load group products for the selected group
        console.log(group)
        ProductService.getUsersByGroup(group.id).then(setUserInGroup);
    };

    const handleSelectUser = (id) =>
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    const handleSelectGroupUser = (id) =>
        setSelectedGroupUsers((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );


    const handleUserInfoDisplay = async (user) => {
        const groups = await productService.getGroupAssignedToUser(user.id)
        setDisplayedUser({
            assignedGroups: groups
        });
        setIsDrawerOpen(true)
    }

    return (
        <Box sx={{display: 'flex', height: '100vh', p: 2}}>
            {/* Group Section */}
            <Box sx={{
                width: '18%',
                minWidth: '250px',
                pr: 2,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: "grey.100",
                padding: "16px",
                borderRadius: 3
            }}>
                <TextField
                    label="Search Groups"
                    fullWidth
                    variant="outlined"
                    value={groupSearch}
                    onChange={(e) => setGroupSearch(e.target.value)}
                    sx={{mb: 2}}
                />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Group Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredGroups.map((group) => (
                            <TableRow key={group.id}>
                                <TableCell>
                                    <Button
                                        variant="text"
                                        onClick={() => handleSelectGroup(group)}
                                    >
                                        {group.name}
                                    </Button>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            {/* Authorized Products Section */}
            <Box sx={{
                width: '82%',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Authorized Products */}
                <Box
                    sx={{
                        mb: 2,
                        backgroundColor: 'grey.100',
                        padding: '16px',
                        borderRadius: 3,
                        marginLeft: '24px',
                        height: '50vh',
                        overflowY: "auto"
                    }}
                >
                    <Box display="flex" alignItems="center" gap={2} sx={{mb: 2}}>
                        <Button
                            variant="outlined"
                            onClick={() => setIsFilterDialogOpen(true)}
                            sx={{
                                mr: 1,
                                height: 56,
                                width: 87,
                            }}
                        >
                            Filter
                        </Button>
                        <Box sx={{display: "flex", flex: 1}}>
                            <TextField
                                label="Search Authorized Products"
                                fullWidth
                                variant="outlined"
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddToGroup}
                            disabled={!selectedUsers.length || !selectedGroup}
                            sx={{height: 56, width: 95}}
                        >
                            Add
                        </Button>
                    </Box>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox/>
                                </TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUserData.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={() => handleSelectUser(user.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => {
                                            handleUserInfoDisplay(user)
                                        }}>
                                            <VisibilityTwoToneIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>


                {/* Current Group Products */}
                <Box
                    sx={{
                        backgroundColor: 'grey.100',
                        padding: '16px',
                        borderRadius: 3,
                        marginLeft: '24px',
                        overflowY: "auto"
                    }}
                >
                    <Box display="flex" alignItems="center" gap={2} sx={{mb: 2}}>
                        <Box sx={{display: "flex", flex: 1}}>
                            <TextField
                                label="Search Group Products"
                                fullWidth
                                variant="outlined"
                                value={groupUserSearch}
                                onChange={(e) => setGroupUserSearch(e.target.value)}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleRemoveFromGroup}
                            disabled={!selectedGroupUsers.length || !selectedGroup}
                            sx={{height: 56, width: 95}}
                        >
                            Remove
                        </Button>
                    </Box>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox/>
                                </TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredGroupUser.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedGroupUsers.includes(user.id)}
                                            onChange={() => handleSelectGroupUser(user.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => {
                                            handleUserInfoDisplay(user)
                                        }}>
                                            <VisibilityTwoToneIcon/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Box>


            <SwipeableDrawer
                anchor="right"
                open={isDrawerOpen}
                onOpen={() => setIsDrawerOpen(true)}
                onClose={() => setIsDrawerOpen(false)}
            >
                <Box
                    sx={{
                        width: 550,
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Typography variant='h5'>
                        Currently Assigned Groups:
                    </Typography>
                    {displayedUser.assignedGroups.map((group) => (
                        <Typography>
                            {group.name}
                        </Typography>
                    ))}
                </Box>
            </SwipeableDrawer>

            <Dialog open={isFilterDialogOpen} onClose={() => setIsFilterDialogOpen(false)}>
                <DialogTitle>Select Filters</DialogTitle>
                <DialogContent>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filters.includes('Free Accounts')}
                                onChange={(e) =>
                                    setFilters((prev) =>
                                        e.target.checked
                                            ? [...prev, 'Free Accounts']
                                            : prev.filter((f) => f !== 'Free Accounts')
                                    )
                                }
                            />
                        }
                        label="Free Accounts"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filters.includes('Distributors')}
                                onChange={(e) =>
                                    setFilters((prev) =>
                                        e.target.checked
                                            ? [...prev, 'Distributors']
                                            : prev.filter((f) => f !== 'Distributors')
                                    )
                                }
                            />
                        }
                        label="Distributors"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filters.includes('Providers')}
                                onChange={(e) =>
                                    setFilters((prev) =>
                                        e.target.checked
                                            ? [...prev, 'Providers']
                                            : prev.filter((f) => f !== 'Providers')
                                    )
                                }
                            />
                        }
                        label="Providers"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsFilterDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => {
                        handleQuery();
                        setIsFilterDialogOpen(false)
                    }} color="primary">
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>

    );
};

export default GroupAssignmentPage;
