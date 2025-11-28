import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { getProjectByIdAsync } from '../../store/features/projects';
import ProjectForm from "../../components/ProjectForm/ProjectForm.jsx";

export default function EditProjectPage() {
    const { projectId } = useParams();
    const dispatch = useDispatch();
    const projectToEdit = useSelector(state => state.projects.data.find(project => project.id === projectId));

    useEffect(() => {
        if (projectId && !projectToEdit) {
            dispatch(getProjectByIdAsync(projectId));
        }
    }, [projectId, projectToEdit, dispatch]);

    if (!projectToEdit) {
        return <div>Loading...</div>;
    }

    return <ProjectForm initialData={projectToEdit} />;
}