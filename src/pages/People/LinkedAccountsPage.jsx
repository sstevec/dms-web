import React, {useState} from 'react';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import CachedTwoToneIcon from '@mui/icons-material/CachedTwoTone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import UserService from '../../services/UserService';
import {useOutletContext} from "react-router-dom";
import {ClearOutlined} from "@mui/icons-material";

const LinkedAccountsPage = () => {
    const {showAlert} = useOutletContext();

    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [filters, setFilters] = useState(['Free Accounts']);
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedAccountInfo, setSelectedAccountInfo] = useState({});

    const [guestEmail, setGuestEmail] = useState('');
    const email = localStorage.getItem('dms_login_email');
    const userId = localStorage.getItem("dms_user_id");

    // Fetch all accounts
    const handleQuery = async () => {
        try {
            const result = await UserService.getAllLinkedAccounts(userId, filters.includes('Free Accounts'), filters.includes('Distributors'), filters.includes('Providers'))
            setAccounts(result);
            setFilteredAccounts(result);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    // Filter accounts by search keyword
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

    // Handle Invite Dialog
    const handleSendInvitation = async () => {
        try {
            await UserService.sendInvitation(email, guestEmail);
            showAlert('Invitation sent successfully!');
            setIsInviteDialogOpen(false);
        } catch (error) {
            showAlert('Failed to send invitation.', "error");
        }
    };

    const openDeleteDialog = (accountId, name, relation) => {
        setSelectedAccountInfo({id: accountId, name: name, relation: relation});
        setIsDeleteDialogOpen(true);
    };

    const handleLinkDelete = async () => {
        try{
            if (selectedAccountInfo.relation === "Provider") {
                await UserService.deleteLink(selectedAccountInfo.id, userId);
                showAlert("Link deleted successfully!");
            } else if(selectedAccountInfo.relation === "Distributor") {
                await UserService.deleteLink(userId, selectedAccountInfo.id);
                showAlert("Link deleted successfully!");
            } else {
                showAlert("Cannot delete link with free accounts!", "warning");
            }
            setIsDeleteDialogOpen(false)
        } catch (error) {
            showAlert('Failed to delete link.', "error");
        }
    };

    return (
        <Box sx={{p: 3}}>
            {/* First Row: Title and Buttons */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Links</Typography>
                <Box>
                    <Button
                        variant="outlined"
                        onClick={handleQuery}
                        sx={{mr: 1, height: 48}}
                    >
                        <CachedTwoToneIcon/>
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{height: 48, width: 110}}
                        onClick={() => setIsInviteDialogOpen(true)}
                    >
                        <MailOutlineIcon/> Invite
                    </Button>
                </Box>
            </Box>

            {/* Second Row: Search Bar and Filter */}
            <Box display="flex" alignItems="center" mb={2}>
                <Box sx={{display: "flex", flex: 1}}>
                    <TextField
                        label="Search Accounts"
                        variant="outlined"
                        fullWidth
                        value={searchKeyword}
                        onChange={handleSearch}
                        sx={{
                            mr: 2
                        }}
                    />
                </Box>
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
                <Button variant="contained" sx={{
                    height: 56,
                    width: 87,
                }} onClick={handleQuery}>
                    Query
                </Button>
            </Box>

            {/* Third Row: Accounts Table */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Create Time</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredAccounts.map((account) => (
                        <TableRow key={account.id}>
                            <TableCell>{account.name}</TableCell>
                            <TableCell>{account.email}</TableCell>
                            <TableCell>{account.relation}</TableCell>
                            <TableCell>{account.createdAt}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => {
                                    openDeleteDialog(account.id, account.name, account.relation)
                                }}>
                                    <ClearOutlined/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Invite Dialog */}
            <Dialog open={isInviteDialogOpen} onClose={() => setIsInviteDialogOpen(false)}>
                <DialogTitle>Invite Guest</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Guest Email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsInviteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSendInvitation} color="primary">
                        Send
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Filter Dialog */}
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
                    <Button onClick={() => setIsFilterDialogOpen(false)} color="primary">
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
                <DialogTitle>Delete Link</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure, you want to delete the link with {selectedAccountInfo.name} ?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleLinkDelete} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LinkedAccountsPage;
