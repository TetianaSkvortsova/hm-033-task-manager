import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import './TaskFilter.css';
import {useDispatch, useSelector} from "react-redux";
import {getTasksAsync} from "../../store/features/tasks.js";

function TaskFilter({projectId = null}) {
    const dispatch = useDispatch();
    const projects = useSelector(state => state.projects.data);
    const [selectedProject, setSelectedProject] = useState(null);
    const currentProject = projects.find(project => project.id === projectId);

    useEffect(() => {
        if (selectedProject && selectedProject.id) {
            dispatch(getTasksAsync(selectedProject.id));
        } else {
            dispatch(getTasksAsync(null));
            console.log('null')
        }
    }, [dispatch, selectedProject]);

    return (
        <div>
            <Autocomplete
                disablePortal
                options={projects}
                getOptionLabel={(option) => option.title || ''}
                onChange={(event, newValue) => {
                    setSelectedProject(newValue);
                }}
                value={selectedProject || currentProject}
                sx={{
                    width: 300,
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        '& fieldset': {
                            borderColor: 'var(--border-color)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'var(--accent-cyan)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'var(--accent-green)',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: 'var(--text-primary)',
                        '&.Mui-focused': {
                            color: 'var(--accent-green)',
                        },
                    },
                    '& .MuiSvgIcon-root': {
                        color: 'var(--text-primary)',
                    },

                    '& + .MuiAutocomplete-popper .MuiAutocomplete-listbox': {
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                    },
                    '& + .MuiAutocomplete-popper .MuiAutocomplete-option': {
                        color: 'var(--text-primary)',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 206, 209, 0.1)',
                        },
                        '&.Mui-focused': {
                            backgroundColor: 'rgba(0, 206, 209, 0.2)',
                        }
                    }
                }}

                renderInput={(params) => <TextField {...params} label="Project"/>}
            />

        </div>
    );
}

export default TaskFilter;