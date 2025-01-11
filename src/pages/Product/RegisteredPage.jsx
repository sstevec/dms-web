import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    Menu,
    SwipeableDrawer,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import CachedTwoToneIcon from '@mui/icons-material/CachedTwoTone';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import ProductService from '../../services/ProductService';
import {ClearOutlined} from "@mui/icons-material";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";

const RegisteredPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [tableHeaders, setTableHeaders] = useState(['name', 'description', 'createdAt']); // Default headers
    const [allHeaders, setAllHeaders] = useState(new Set()); // Set of all potential headers
    const [anchorEl, setAnchorEl] = useState(null); // For settings menu
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState("");
    const [editProductId, setEditProductId] = useState("");
    const [productToDelete, setProductToDelete] = useState(null);
    const [newProduct, setNewProduct] = useState({name: '', description: '', properties: []});
    const userId = localStorage.getItem('dms_user_id');


    const fetchProducts = async () => {
        try {
            const productList = await ProductService.getRegisteredProducts(userId);

            // Parse productDetail and extract unique keys
            const parsedProducts = productList.map((product) => {
                const detailDict = JSON.parse(product.productDetail || '{}');
                product.productDetail = detailDict; // Store parsed JSON back to object
                return product;
            });

            const uniqueKeys = new Set();
            parsedProducts.forEach((product) => {
                Object.keys(product.productDetail || {}).forEach((key) => uniqueKeys.add(key));
            });

            setProducts(parsedProducts);
            setFilteredProducts(parsedProducts);
            setAllHeaders(uniqueKeys);
        } catch (error) {
            console.error('Error fetching registered products:', error);
        }
    };

    // Fetch products on page load
    useEffect(() => {
        fetchProducts();
    }, [userId]);

    // Handle Input Changes for Name and Description
    const handleInputChange = (field, value) => {
        setNewProduct((prev) => ({...prev, [field]: value}));
    };

    // Add a New Property Row
    const handleAddProperty = () => {
        setNewProduct((prev) => ({
            ...prev,
            properties: [...prev.properties, {propertyName: '', propertyValue: ''}],
        }));
    };

    // Handle Property Input Changes
    const handlePropertyChange = (index, field, value) => {
        const updatedProperties = [...newProduct.properties];
        updatedProperties[index][field] = value;
        setNewProduct((prev) => ({...prev, properties: updatedProperties}));
    };

    // Delete a Property Row
    const handleDeleteProperty = (index) => {
        const updatedProperties = [...newProduct.properties];
        updatedProperties.splice(index, 1);
        setNewProduct((prev) => ({...prev, properties: updatedProperties}));
    };

    const handleDrawOpen = (isAdd) => {
        setIsDrawerOpen(true);
        isAdd ? setDrawerMode("add") : setDrawerMode("edit");
    }

    // Handle Submit for Adding a New Product
    const handleAddProduct = async () => {
        try {
            // Filter properties to skip empty names or values
            const validProperties = newProduct.properties.filter(
                (prop) => prop.propertyName.trim() && prop.propertyValue.trim()
            );

            // If no valid properties and productDetail is expected, initialize as an empty object
            const productDetail = validProperties.length
                ? JSON.stringify(
                    validProperties.reduce((acc, prop) => {
                        acc[prop.propertyName.trim()] = prop.propertyValue.trim();
                        return acc;
                    }, {})
                )
                : '{}'; // Default to an empty JSON object

            // Call the service to register the product
            if (drawerMode === "add") {
                await ProductService.registerProduct(
                    newProduct.name.trim(),
                    newProduct.description.trim(),
                    productDetail,
                    userId
                );

                alert('Product added successfully!');
            } else if (drawerMode === "edit") {
                await ProductService.modifyProduct(
                    editProductId,
                    newProduct.name.trim(),
                    newProduct.description.trim(),
                    productDetail)
                alert('Product edited successfully!');
                setEditProductId("");
            }

            // Clear the input fields, but retain property names
            setNewProduct((prev) => ({
                ...prev,
                name: '',
                description: '',
                properties: prev.properties.map((prop) => ({
                    propertyName: prop.propertyName, // Retain the property name
                    propertyValue: '', // Clear the property value
                })),
            }));

            setIsDrawerOpen(false);
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product.');
        }
    };


    // Handle Search
    const handleSearch = (event) => {
        const keyword = event.target.value.toLowerCase();
        setSearchKeyword(keyword);

        const filtered = products.filter((product) =>
            tableHeaders.some((header) => {
                const value = product[header] || product.productDetail?.[header] || '';
                return value.toString().toLowerCase().includes(keyword);
            })
        );
        setFilteredProducts(filtered);
    };

    // Handle Settings Menu
    const openSettingsMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeSettingsMenu = () => {
        setAnchorEl(null);
    };

    const toggleHeader = (header) => {
        setTableHeaders((prevHeaders) =>
            prevHeaders.includes(header)
                ? prevHeaders.filter((h) => h !== header)
                : [...prevHeaders, header]
        );
    };


    // Open the confirmation dialog
    const openDeleteDialog = (productId) => {
        setProductToDelete(productId);
        setIsDialogOpen(true);
    };

    // Close the dialog
    const closeDeleteDialog = () => {
        setProductToDelete(null);
        setIsDialogOpen(false);
    };

    // Handle delete confirmation
    const handleDeleteProduct = async () => {
        if (!productToDelete) return;

        try {
            await ProductService.deleteProduct(productToDelete);
            alert('Product deleted successfully!');
            fetchProducts(); // Refresh the product list
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product.');
        } finally {
            closeDeleteDialog();
        }
    };

    const renderDrawerContent = () => (
        <Box
            sx={{
                width: 550,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography variant="h6">Add New Product</Typography>
            <TextField
                label="Name"
                value={newProduct.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                fullWidth
            />
            <TextField
                label="Description"
                value={newProduct.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                fullWidth
            />

            <Typography variant="h6" sx={{mt: 2}}>Properties</Typography>
            {newProduct.properties.map((property, index) => (
                <Box key={index} sx={{display: 'flex', gap: 1, alignItems: 'center', mb: 1}}>
                    <TextField
                        label="Property Name"
                        value={property.propertyName}
                        onChange={(e) =>
                            handlePropertyChange(index, 'propertyName', e.target.value)
                        }
                        fullWidth
                    />
                    <TextField
                        label="Property Value"
                        value={property.propertyValue}
                        onChange={(e) =>
                            handlePropertyChange(index, 'propertyValue', e.target.value)
                        }
                        fullWidth
                    />
                    <IconButton
                        onClick={() => handleDeleteProperty(index)}
                    >
                        <ClearOutlined></ClearOutlined>
                    </IconButton>
                </Box>
            ))}
            <Button variant="outlined" onClick={handleAddProperty}>
                Add Property
            </Button>
            <Box sx={{display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3}}>
                <Button onClick={() => setIsDrawerOpen(false)} variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleAddProduct} variant="contained" color="primary">
                    Submit
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{p: 3}}>
            {/* First Row: Title and Buttons */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Registered Products</Typography>
                <Box>
                    <Button variant="outlined" sx={{mr: 1, height: 48}} onClick={fetchProducts}>
                        <CachedTwoToneIcon/>
                    </Button>
                    <Button variant="contained" color="primary" sx={{height: 48}} onClick={() => handleDrawOpen(true)}>
                        <AddIcon/> Add New
                    </Button>
                </Box>
            </Box>

            {/* Second Row: Search Bar and Settings */}
            <Box display="flex" alignItems="center" mb={2} gap={1}>
                <TextField
                    label="Search Products"
                    variant="outlined"
                    fullWidth
                    value={searchKeyword}
                    onChange={handleSearch}
                />
                <IconButton onClick={openSettingsMenu}>
                    <SettingsIcon/>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={closeSettingsMenu}
                    PaperProps={{
                        sx: {
                            width: 300,
                            padding: 2,
                            borderRadius: 2,
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                        },
                    }}
                >
                    <Typography variant="h6" sx={{mb: 1}}>
                        Table Headers
                    </Typography>
                    <Divider sx={{mb: 1}}/>
                    <List dense>
                        {[...allHeaders].map((header) => (
                            <ListItem key={header} disablePadding>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={tableHeaders.includes(header)}
                                            onChange={() => toggleHeader(header)}
                                            sx={{
                                                color: 'primary.main',
                                                '&.Mui-checked': {
                                                    color: 'primary.main',
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                textTransform: 'capitalize',
                                                fontWeight: tableHeaders.includes(header) ? 600 : 400,
                                            }}
                                        >
                                            {header}
                                        </Typography>
                                    }
                                    sx={{margin: 0, width: '100%'}}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Menu>
            </Box>

            {/* Third Row: Products Table */}
            <Table>
                <TableHead>
                    <TableRow>
                        {tableHeaders.map((header) => (
                            <TableCell key={header}>{header}</TableCell>
                        ))}
                        <TableCell>Action</TableCell> {/* Action column */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredProducts.map((product, index) => (
                        <TableRow key={index}>
                            {tableHeaders.map((header) => (
                                <TableCell key={header}>
                                    {product[header] || product.productDetail?.[header] || ''}
                                </TableCell>
                            ))}
                            <TableCell>
                                {/* Edit Button */}
                                <IconButton
                                    onClick={() => {
                                        setNewProduct({
                                            name: product.name,
                                            description: product.description,
                                            properties: Object.entries(product.productDetail || {}).map(
                                                ([key, value]) => ({propertyName: key, propertyValue: value})
                                            ),
                                        });
                                        setEditProductId(product.id)
                                        handleDrawOpen(false); // Reuse the drawer for editing
                                    }}
                                >
                                    <EditTwoToneIcon/>
                                </IconButton>
                                {/* Delete Button */}
                                <IconButton onClick={() => {
                                    openDeleteDialog(product.id)
                                }}>
                                    <ClearOutlined/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>

            <SwipeableDrawer
                anchor="right"
                open={isDrawerOpen}
                onOpen={() => setIsDrawerOpen(true)}
            >
                {renderDrawerContent()}
            </SwipeableDrawer>

            <Dialog
                open={isDialogOpen}
                onClose={closeDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete this product? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteProduct} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RegisteredPage;
