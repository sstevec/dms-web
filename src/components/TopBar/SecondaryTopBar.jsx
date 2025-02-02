import React, {useEffect, useState} from 'react';
import {
    AppBar,
    Badge,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    Popover,
    Toolbar,
    Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import NotificationService from '../../services/NotificationService';
import AcceptInvitationDialog from "../NotificationPopup/AcceptInvitationDialog";

const SecondaryTopBar = ({toggleMenuCollapse}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isInvitationDialogOpen, setInvitationDialogOpen] = useState(false);
    const [invitorEmail, setInvitorEmail] = useState('')

    const userId = localStorage.getItem('dms_user_id'); // Get user ID from localStorage

    // Fetch unread notifications on load
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const unreadNotifications = await NotificationService.getNotifications(userId, false);
                setNotifications(Array.isArray(unreadNotifications) ? unreadNotifications : []);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, [userId]);

    // Handle Popover
    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    const isPopoverOpen = Boolean(anchorEl);

    // Mark notification as read
    const handleMarkAsRead = async (notificationId) => {
        try {
            await NotificationService.markNotificationAsRead(notificationId);
            setNotifications((prev) => prev.filter((n) => n.notificationId !== notificationId));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Handle notification click
    const handleNotificationAction = (notification) => {
        if (notification.type === 'Invitation') {
            const payload = JSON.parse(notification.payload)
            setInvitorEmail(payload.fromUserEmail)
            setInvitationDialogOpen(true)
        } else if (notification.type === 'redirect') {
            window.location.href = notification.targetUrl;
        } else {

        }
        handleMarkAsRead(notification.id)
    };

    return (
        <Box>
            <AppBar
                position="static"
                color="white"
                sx={{boxShadow: 'none', backgroundColor: 'white'}}
            >
                <Toolbar sx={{minHeight: 48, display: 'flex', justifyContent: 'space-between'}}>
                    {/* Left side */}
                    <Box>
                        <IconButton onClick={toggleMenuCollapse}>
                            <MenuIcon/>
                        </IconButton>
                        <IconButton>
                            <SearchIcon/>
                        </IconButton>
                    </Box>

                    {/* Right side */}
                    <Box>
                        {/* Language switch */}
                        <IconButton>
                            <Box
                                component="span"
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}
                            >
                                EN
                            </Box>
                        </IconButton>

                        {/* Notifications */}
                        <IconButton onClick={handleNotificationClick}>
                            <Badge badgeContent={notifications.length} color="primary">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>

                        {/* Notification Popover */}
                        <Popover
                            open={isPopoverOpen}
                            anchorEl={anchorEl}
                            onClose={handleNotificationClose}
                            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                            transformOrigin={{vertical: 'top', horizontal: 'right'}}
                        >
                            <List sx={{maxHeight: 300, overflowY: 'auto', width: 300}}>
                                {notifications.length === 0 ? (
                                    <ListItem>
                                        <Typography variant="body2" color="textSecondary">
                                            No new notifications
                                        </Typography>
                                    </ListItem>
                                ) : (
                                    notifications.map((notification) => (
                                        <ListItem
                                            key={notification.notificationId}
                                            disablePadding
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                backgroundColor: "grey.100"
                                            }}
                                        >
                                            <ListItemButton
                                                sx={{
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                    padding: 2,
                                                    gap: 1, // Spacing between title, message, and date
                                                }}
                                                onClick={() => handleNotificationAction(notification)}
                                            >
                                                {/* Title and Date */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    width: '100%'
                                                }}>
                                                    <Typography variant="subtitle1"
                                                                sx={{
                                                                    fontFamily: 'Arial, sans-serif',
                                                                    fontWeight: "bold",
                                                                    fontSize: '1rem',
                                                                }}>
                                                        {notification.type}
                                                    </Typography>
                                                    <Typography sx={{
                                                        fontFamily: 'Arial, sans-serif',
                                                        fontSize: '0.75rem',
                                                        color: 'grey.600',
                                                        alignContent: "center"
                                                    }}>
                                                        {notification.createdAt.split('T')[0]} {/* Extract the date part */}
                                                    </Typography>
                                                </Box>

                                                {/* Message */}
                                                <Typography
                                                    sx={{
                                                        fontFamily: 'Arial, sans-serif',
                                                        fontSize: '0.8rem',
                                                        color: 'grey.600',
                                                        fontWeight: "bold"
                                                    }}
                                                >
                                                    {notification.message}
                                                </Typography>
                                            </ListItemButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleMarkAsRead(notification.notificationId)}
                                            >
                                                <CloseIcon fontSize="small"/>
                                            </IconButton>
                                        </ListItem>
                                    ))
                                )}
                            </List>
                        </Popover>

                        {/* User Profile */}
                        <IconButton>
                            <PersonIcon/>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <AcceptInvitationDialog open={isInvitationDialogOpen} setOpen={setInvitationDialogOpen}
                                    senderEmail={invitorEmail} userId={userId}/>
        </Box>

    );
};

export default SecondaryTopBar;
