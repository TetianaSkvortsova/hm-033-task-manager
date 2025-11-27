import React, {useState} from 'react';
import {
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Box,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Три вертикальні крапки
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ActionMenu({onEdit, onDelete}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const handleEdit = (event) => {
        event.stopPropagation();
        handleClose(event);
        onEdit && onEdit();
    };

    const handleDelete = (event) => {
        event.stopPropagation();
        handleClose(event);
        onDelete && onDelete();
    };

    return (
        <Box
            sx={{
                p: 0,
                backgroundColor: '#1E2532',
                border: 'none', // Додаємо рамку
                position: 'absolute', // Це важливо для розміщення іконки
                right: '15px',
                display: 'flex',
                justifyContent: 'flex-end', // Розміщуємо кнопку праворуч
                alignItems: 'flex-start',
                height: 'fit-content',
                width: 'fit-content',
            }}
        >
            <IconButton
                aria-label="налаштування"
                aria-controls={open ? 'action-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                size="small"

                sx={{
                    color: '#007bff', // Колір іконки
                }}
            >
                <MoreVertIcon/>
            </IconButton>
            <Menu
                id="action-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}

                PaperProps={{
                    sx: {
                        backgroundColor: '#333b4a', // Темний фон для меню
                        borderRadius: 1,
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)', // Тінь
                    },
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem
                    onClick={handleEdit}
                    disableRipple={true}
                    sx={{
                        color: '#ffffff',
                        minWidth: 150,
                        '&:hover': {
                            backgroundColor: '#444d60',
                        },
                    }}
                >
                    <ListItemIcon>
                        <EditIcon fontSize="small" sx={{color: '#007bff'}}/>
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>

                <MenuItem
                    onClick={handleDelete}
                    disableRipple={true}
                    sx={{
                        color: '#ffffff',
                        '&:hover': {
                            backgroundColor: '#444d60',
                        },
                    }}
                >
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" sx={{color: '#ff4d4d'}}/>
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
}

export default ActionMenu;