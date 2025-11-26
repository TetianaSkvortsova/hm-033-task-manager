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
import {useDispatch} from "react-redux";
import {deleteProjectAsync, getProjectByIdAsync} from "../../store/features/projects.js";
import {useNavigate} from "react-router";
import {urls} from "../../common/menu.js";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog.jsx";

function ActionMenu({onEdit, onDelete}) {
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    // const [openConfirm, setOpenConfirm] = useState(false);
    const open = Boolean(anchorEl);

    // Обробник відкриття меню
    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    // Обробник закриття меню
    const handleClose = (event) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    // Обробники дій
    const handleEdit = (event) => {
        event.stopPropagation();
       /* const editUrl = urls.EDIT_PROJECT_URL.replace(':projectId', id);
        dispatch(getProjectByIdAsync(id));
        navigate(editUrl);
        console.log(id);*/
        handleClose(event);
        onEdit && onEdit();
    };

    /*const handleOpenConfirm = (event) => {
        event.stopPropagation();
        handleClose(event); // Закриваємо меню
        setOpenConfirm(true); // Відкриваємо діалог
    };*/

   /* const handleCloseConfirm = (event) => {
        event.stopPropagation();
        setOpenConfirm(false);
    };*/

    const handleDelete = (event) => {
        event.stopPropagation();
        // dispatch(deleteProjectAsync(id));
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
                open={open} // Чи відкрите меню (залежить від стану `anchorEl`)
                onClose={handleClose} // Викликається при кліку поза меню або натисканні Esc

                // Стилізація самого меню (наприклад, колір фону)
                PaperProps={{
                    sx: {
                        backgroundColor: '#333b4a', // Темний фон для меню
                        borderRadius: 1,
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)', // Тінь
                    },
                }}
                // Вертикальне розташування, щоб відкривалося над кнопкою
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {/* 3. ПУНКТ МЕНЮ: РЕДАГУВАТИ */}
                <MenuItem
                    onClick={handleEdit}
                    disableRipple={true} // Вимикаємо ripple на елементі меню
                    sx={{
                        color: '#ffffff', // Білий текст
                        minWidth: 150, // Мінімальна ширина
                        // Стилі hover для елемента меню: робимо фон світлішим
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

                {/* 4. ПУНКТ МЕНЮ: ВИДАЛИТИ */}
                <MenuItem
                    onClick={handleDelete}
                    disableRipple={true} // Вимикаємо ripple на елементі меню
                    sx={{
                        color: '#ffffff',
                        // Стилі hover для елемента меню: робимо фон світлішим
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
            {/*<ConfirmationDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                onConfirm={handleConfirmDelete}
                title={"Confirm Project Deletion"}
                description={"Are you sure you want to permanently delete this project? This action cannot be undone and will also delete all associated tasks."}
                confirmText="Delete Project"
            />*/}
        </Box>
    );
}

export default ActionMenu;