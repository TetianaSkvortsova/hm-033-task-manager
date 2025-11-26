import React, { useEffect } from 'react';
import { useParams } from 'react-router'; // Для отримання ID з URL
import { useSelector, useDispatch } from 'react-redux';
// import { getProjectByIdAsync } from '../../store/features/projects';
import { getProjectByIdAsync } from '../../store/features/projects';
import ProjectForm from "../../components/ProjectForm/ProjectForm.jsx"; // Вам знадобиться нова дія

// Ця сторінка відповідає за редагування існуючого проекту
export default function EditProjectPage() {
    const { projectId } = useParams(); // Припускаємо, що маршрут виглядає як /edit/:projectId
    const dispatch = useDispatch();

    // Припускаємо, що у вашому Redux-стані ви зберігаєте поточний проект, який редагується
    const projectToEdit = useSelector(state => state.projects.data.find(project => project.id === projectId));
    console.log(projectToEdit);

    // Ефект для завантаження даних, якщо їх немає
    useEffect(() => {
        if (projectId && !projectToEdit) {
            // Якщо проект ще не завантажено, завантажуємо його
            dispatch(getProjectByIdAsync(projectId));
        }
    }, [projectId, projectToEdit, dispatch]);

    // Якщо дані ще завантажуються
    if (!projectToEdit) {
        // Або індикатор завантаження
        return <div>Loading...</div>;
    }

    // Передаємо завантажені дані в універсальну форму
    return <ProjectForm initialData={projectToEdit} />;
}