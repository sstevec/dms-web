import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    SwipeableDrawer,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import CachedTwoToneIcon from '@mui/icons-material/CachedTwoTone';
import AddIcon from '@mui/icons-material/Add';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import ProductService from "../../services/ProductService";
import productService from "../../services/ProductService";
import {useOutletContext} from "react-router-dom";
import renderDrawerContent from "../../components/ProductDisplay/ProductDrawer"

const AuthorizedPage = () => {
    const {showAlert} = useOutletContext();
    // Mock data for groups and products
    const [groups, setGroups] = useState([
        {id: 1, name: 'Group A'},
        {id: 2, name: 'Group B'},
    ]);
    const [authorizedProducts, setAuthorizedProducts] = useState([
        {id: 1, name: 'Product 1', provider: 'Provider A'},
        {id: 2, name: 'Product 2', provider: 'Provider B'},
    ]);
    const [groupProducts, setGroupProducts] = useState([
        {id: 3, name: 'Product 3', provider: 'Provider C'},
    ]);

    // State for filters, selections, and selected group
    const [groupSearch, setGroupSearch] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [groupProductSearch, setGroupProductSearch] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedGroupProducts, setSelectedGroupProducts] = useState([]);
    const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
    const [isAddGroup, setIsAddGroup] = useState(false);
    const [groupId, setGroupId] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [displayedProduct, setDisplayedProduct] = useState({name: '', description: '', productDetail: []});

    const userId = localStorage.getItem('dms_user_id');


    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Fetch all groups and authorized products
                const [groupsData, authorizedProductsData] = await Promise.all([
                    ProductService.getGroups(userId), // Replace with the actual API function for fetching groups
                    ProductService.getAuthorizedProducts(userId),
                ]);

                // Update state with fetched data
                setGroups(groupsData);
                setAuthorizedProducts(authorizedProductsData);

                // Clear selections and reset group-related states
                setSelectedGroup(null);
                setGroupProducts([]);
                setSelectedProducts([]);
                setSelectedGroupProducts([]);
            } catch (error) {
                showAlert('Failed to load groups and authorized products. Please try again.');
            }
        };
        loadInitialData()
    }, [userId]);

    const refreshGroupData = async () => {
        const groupData = await ProductService.getGroups(userId);
        setGroups(groupData);
    };


    // Filtered lists
    const filteredGroups = groups.filter((group) =>
        group.name.toLowerCase().includes(groupSearch.toLowerCase())
    );

    const filteredAuthorizedProducts = authorizedProducts.filter(
        (product) =>
            product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            product.provider.toLowerCase().includes(productSearch.toLowerCase())
    );

    const filteredGroupProducts = groupProducts.filter(
        (product) =>
            product.name.toLowerCase().includes(groupProductSearch.toLowerCase()) ||
            product.provider.toLowerCase().includes(groupProductSearch.toLowerCase())
    );

    // Handlers for selection
    const handleAddToGroup = async () => {
        if (!selectedGroup) {
            showAlert('Please select a group first.');
            return;
        }

        try {
            await Promise.all(
                selectedProducts.map((productId) =>
                    ProductService.addProductToGroup(productId, userId, selectedGroup.id)
                )
            );
            showAlert('Products added to the group successfully!');
            // Refresh group products
            const updatedGroupProducts = await ProductService.getAuthorizedProductsByGroup(
                selectedGroup.id
            );
            setGroupProducts(updatedGroupProducts);
            setSelectedProducts([]); // Clear selected products
        } catch (error) {
            showAlert('Failed to add products to the group.');
        }
    };

    const handleRemoveFromGroup = async () => {
        if (!selectedGroup) {
            showAlert('Please select a group first.');
            return;
        }

        try {
            await Promise.all(
                selectedGroupProducts.map((productId) =>
                    ProductService.removeProductFromGroup(productId, selectedGroup.id)
                )
            );
            showAlert('Products removed from the group successfully!');
            // Refresh group products
            const updatedGroupProducts = await ProductService.getAuthorizedProductsByGroup(
                selectedGroup.id
            );
            setGroupProducts(updatedGroupProducts);
            setSelectedGroupProducts([]); // Clear selected group products
        } catch (error) {
            console.error('Error removing products from group:', error);
            showAlert('Failed to remove products from the group.');
        }
    };

// Clear selected group products when changing groups
    const handleSelectGroup = (group) => {
        setSelectedGroup(group);
        setSelectedGroupProducts([]);
        // Load group products for the selected group
        ProductService.getAuthorizedProductsByGroup(group.id).then(setGroupProducts);
    };

    const handleSelectProduct = (id) =>
        setSelectedProducts((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    const handleSelectGroupProduct = (id) =>
        setSelectedGroupProducts((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );

    const handleAddGroup = async () => {
        if (!newGroupName.trim()) {
            showAlert('Group name cannot be empty.');
            return;
        }

        try {
            await ProductService.createProductGroup(newGroupName.trim(), userId);
            showAlert('Group created successfully!');

            // Fetch updated group list
            await refreshGroupData();

            // Close dialog and reset state
            setIsGroupDialogOpen(false);
            setNewGroupName('');
        } catch (error) {
            console.error('Error creating group:', error);
            showAlert('Failed to create group. Please try again.');
        }
    };

    const handleUpdateGroup = async () => {
        if (!newGroupName.trim()) {
            showAlert('Group name cannot be empty.');
            return;
        }

        try {
            // TODO call update name function here
            showAlert('Group info updated successfully!');

            // Fetch updated group list
            await refreshGroupData();

            // Close dialog and reset state
            setIsGroupDialogOpen(false);
            setNewGroupName('');
        } catch (error) {
            showAlert('Failed to create group. Please try again.', 'error');
        }
    };

    const handleDeleteGroup = async (groupId) => {
        await productService.deleteGroup(groupId)
        await refreshGroupData();
        showAlert('Delete group succeed!')
    }

    const handleGroupDialogOpen = (isAddMode) => {
        setIsAddGroup(isAddMode)
        setIsGroupDialogOpen(true)
    };

    const handleProductDisplay = (product) => {
        const detail = JSON.parse(product.productDetail || '{}');
        setDisplayedProduct({
            name: product.name,
            description: product.description,
            productDetail: Object.entries(detail || {}).map(
                ([key, value]) => ({propertyName: key, propertyValue: value})
            ),
        });
        setIsDrawerOpen(true)
    }

    return (
        <Box sx={{display: 'flex', height: '100vh', p: 2}}>
            {/* Group Section */}
            <Box sx={{
                width: '30%',
                pr: 2,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: "grey.100",
                padding: "16px",
                borderRadius: 3
            }}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
                    <Button variant="contained" startIcon={<AddIcon/>} onClick={() => handleGroupDialogOpen(true)}>
                        Add Group
                    </Button>
                    <Button variant="outlined" startIcon={<CachedTwoToneIcon/>} onClick={refreshGroupData}>
                        Refresh
                    </Button>
                </Box>
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
                            <TableCell>Action</TableCell>
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
                                <TableCell>
                                    <IconButton onClick={() => {
                                        setGroupId(group.id)
                                        setNewGroupName(group.name)
                                        handleGroupDialogOpen(false);
                                    }}>
                                        <EditTwoToneIcon/>
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteGroup(group.id)}>
                                        <DeleteTwoToneIcon/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            {/* Authorized Products Section */}
            <Box sx={{
                width: '70%',
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
                        <Box sx={{display: "flex", flex: 1}}>
                            <TextField
                                label="Search Authorized Products"
                                fullWidth
                                variant="outlined"
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddToGroup}
                            disabled={!selectedProducts.length || !selectedGroup}
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
                                <TableCell>Provider</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAuthorizedProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedProducts.includes(product.id)}
                                            onChange={() => handleSelectProduct(product.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.provider}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => {
                                            handleProductDisplay(product)
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
                                value={groupProductSearch}
                                onChange={(e) => setGroupProductSearch(e.target.value)}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleRemoveFromGroup}
                            disabled={!selectedGroupProducts.length || !selectedGroup}
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
                                <TableCell>Provider</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredGroupProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedGroupProducts.includes(product.id)}
                                            onChange={() =>
                                                handleSelectGroupProduct(product.id)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.provider}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => {
                                            handleProductDisplay(product)
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

            <Dialog
                open={isGroupDialogOpen}
                onClose={() => setIsGroupDialogOpen(false)}
                aria-labelledby="add-group-dialog-title"
            >
                {isAddGroup && (<DialogTitle id="add-group-dialog-title">Add New Group</DialogTitle>)}
                {!isAddGroup && (<DialogTitle id="add-group-dialog-title">Update Group</DialogTitle>)}
                <DialogContent>
                    <Box sx={{width: "28vw", minWidth: "200px", maxWidth: "500px", padding: "24px"}}>
                        <TextField
                            autoFocus
                            label="Group Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsGroupDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                    {isAddGroup && (<Button onClick={handleAddGroup} color="primary" variant="contained">
                        Add
                    </Button>)}
                    {!isAddGroup && (<Button onClick={handleUpdateGroup} color="primary" variant="contained">
                        Confirm
                    </Button>)}
                </DialogActions>
            </Dialog>

            <SwipeableDrawer
                anchor="right"
                open={isDrawerOpen}
                onOpen={() => setIsDrawerOpen(true)}
                onClose={() => setIsDrawerOpen(false)}
            >
                {renderDrawerContent(displayedProduct, setIsDrawerOpen)}
            </SwipeableDrawer>

        </Box>

    );
};

export default AuthorizedPage;
