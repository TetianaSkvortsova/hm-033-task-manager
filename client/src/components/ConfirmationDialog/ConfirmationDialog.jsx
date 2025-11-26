import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';

export default function ConfirmationDialog({
                                               open,
                                               onClose,
                                               onConfirm,
                                               title,
                                               description,
                                               confirmText = 'Confirm',
                                               cancelText = 'Cancel',
                                           }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="confirmation-dialog-title"
            aria-describedby="confirmation-dialog-description"
            PaperProps={{
                sx: {
                    backgroundColor: '#2e343e',
                    color: '#ffffff',
                    borderRadius: '12px',
                }
            }}
        >
            <DialogTitle id="confirmation-dialog-title" sx={{ color: '#ff4d4d' }}>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="confirmation-dialog-description" sx={{ color: '#bdbdbd' }}>
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    sx={{ color: '#007bff' }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    sx={{ color: '#ff4d4d' }}
                    autoFocus
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}