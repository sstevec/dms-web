import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Collapse, Drawer, List, ListItemButton, ListItemText, Typography,} from '@mui/material';
import {
    ExpandLess,
    ExpandMore,
    InboxOutlined as ProductIcon,
    PaidOutlined as CommissionIcon,
    PeopleAltOutlined as PeopleIcon,
    ShoppingCartOutlined as OrderIcon,
    SpaceDashboardOutlined as DashboardIcon,
} from '@mui/icons-material';

const menuItems = [
    {
        name: 'Dashboard',
        icon: <DashboardIcon/>,
        path: '/home/dashboard',
    },
    {
        name: 'People',
        icon: <PeopleIcon/>,
        subItems: [
            {name: 'Free Accounts', path: '/home/people/free-accounts'},
            {name: 'Linked Accounts', path: '/home/people/linked-accounts'},
        ],
    },
    {
        name: 'Product',
        icon: <ProductIcon/>,
        subItems: [
            {name: 'Registered', path: '/home/product/registered'},
            {name: 'Grouping', path: '/home/product/authorized'},
            {name: 'Group Assignment', path: '/home/product/group-assignment'},
        ],
    },
    {
        name: 'Order',
        icon: <OrderIcon/>,
        subItems: [
            {name: 'My Order', path: '/home/order/my-order'},
            {name: 'Report', path: '/home/order/report'},
        ],
    },
    {
        name: 'Commission',
        icon: <CommissionIcon/>,
        subItems: [
            {name: 'Summary', path: '/home/commission/summary'},
            {name: 'History', path: '/home/commission/history'},
            {name: 'Calculator', path: '/home/commission/calculator'},
        ],
    },
];

const SideMenu = ({isCollapsed, toggleMenuCollapse}) => {
    const navigate = useNavigate();
    const [openSubMenus, setOpenSubMenus] = useState({});
    const [hoveredItem, setHoveredItem] = useState(null);
    const [hoveredSubItem, setHoveredSubItem] = useState(null);
    const [selectedItem, setSelectedItem] = useState("Dashboard");
    const [selectedSubItem, setSelectedSubItem] = useState(null);

    const handleToggle = (menuName) => {
        setOpenSubMenus((prev) => ({
            ...prev,
            [menuName]: !prev[menuName],
        }));
    };


    return (
        <Drawer
            variant="permanent"
            sx={{
                width: isCollapsed ? 80 : 289,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: isCollapsed ? 80 : 289,
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                    transition: 'width 0.3s ease',
                    backgroundColor: "black",
                    position: "relative"
                },
            }}
        >

            <List>
                {menuItems.map((item) => (
                    <React.Fragment key={item.name}>
                        <ListItemButton
                            onMouseEnter={() => setHoveredItem(item.name)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => {
                                if (item.path) {
                                    setSelectedItem(item.name);
                                    setSelectedSubItem(null);
                                    navigate(item.path);
                                } else if (isCollapsed) {
                                    setSelectedItem(item.name)
                                    setSelectedSubItem(item.subItems[0].name)
                                    navigate(item.subItems[0].path);
                                } else
                                    handleToggle(item.name);
                            }}
                            sx={{
                                justifyContent: isCollapsed ? 'center' : 'flex-start',
                                color:
                                    selectedItem === item.name
                                        ? '#34a4ff'
                                        : hoveredItem === item.name
                                            ? 'grey.200'
                                            : 'grey.400',
                                transition: 'color 0.3s',
                                padding: "12px 16px"
                            }}
                        >
                            <span
                                style={{
                                    marginRight: isCollapsed ? 0 : '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                {item.icon}
                            </span>
                            {!isCollapsed && (
                                <ListItemText
                                    primary={
                                        <Typography sx={{fontWeight: 700, padding: '0 12px'}}>
                                            {item.name}
                                        </Typography>
                                    }
                                />
                            )}
                            {item.subItems &&
                                !isCollapsed &&
                                (openSubMenus[item.name] ? <ExpandLess/> : <ExpandMore/>)}
                        </ListItemButton>

                        {item.subItems && !isCollapsed && (
                            <Collapse in={openSubMenus[item.name]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.subItems.map((subItem) => (
                                        <ListItemButton
                                            key={subItem.name}
                                            sx={{
                                                pl: 4,
                                            }}
                                            onMouseEnter={() => setHoveredSubItem(subItem.name)}
                                            onMouseLeave={() => setHoveredSubItem(null)}
                                            onClick={() => {
                                                setSelectedItem(item.name);
                                                setSelectedSubItem(subItem.name);
                                                navigate(subItem.path);
                                            }}
                                        >
                                            <ListItemText
                                                primary={<Typography sx={{
                                                    color:
                                                        selectedSubItem === subItem.name
                                                            ? '#34a4ff'
                                                            : hoveredSubItem === subItem.name
                                                                ? 'grey.200'
                                                                : 'grey.400',
                                                    fontWeight: 700,
                                                    transition: 'color 0.3s',
                                                }}>
                                                    {subItem.name}
                                                </Typography>}
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                    </React.Fragment>
                ))}
            </List>
        </Drawer>
    );
};

export default SideMenu;
