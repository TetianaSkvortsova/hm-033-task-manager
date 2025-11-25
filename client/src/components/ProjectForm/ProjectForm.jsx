import React, { useState, useEffect } from 'react';
import { PRIORITIES } from '../../common/priorities';
import { useDispatch, useSelector } from 'react-redux';
import {saveProjectAsync, updateProjectAsync} from '../../store/features/projects';
import { useNavigate } from 'react-router';
import { urls } from '../../common/menu';

// Універсальний компонент форми, який може працювати в двох режимах: СТВОРЕННЯ або РЕДАГУВАННЯ
// 'initialData' міститиме дані проєкту, якщо ми редагуємо
export default function ProjectForm({ initialData = {} }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 1. Використовуємо локальний стан (useState) замість useRef
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || Object.keys(PRIORITIES)[0], // Пріоритет за замовчуванням
    });

    // Визначаємо, чи це режим редагування (якщо є ID або інші дані)
    const isEditing = Boolean(initialData.id);
    const formTitle = isEditing ? 'Edit project' : 'Add project';
    const buttonText = isEditing ? 'Save changes' : 'Create project';

    const { loaded: isProjectSaved } = useSelector(state => state.projects);

    // Оновлення стану форми при зміні полів
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Обробка збереження/оновлення
    const handleSave = () => {
        if (isEditing) {
            dispatch(updateProjectAsync({...formData, id: initialData.id }));
            navigate(urls.PROJECTS_URL);
        } else {
            dispatch(saveProjectAsync(formData));
            console.log(isEditing);
        }
    }

    // Перенаправлення після успішного збереження
    useEffect(() => {
        if (isProjectSaved) {
            navigate(urls.PROJECTS_URL);
        }
    }, [navigate, isProjectSaved]);

    return (
        <div>
            <h1>{formTitle}</h1>
            <form>
                <div>
                    <input
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        value={formData.title} // Контрольований елемент
                        onChange={handleChange}
                    />
                </div>
                <div>
          <textarea
              name="description"
              placeholder="Enter description"
              value={formData.description} // Контрольований елемент
              onChange={handleChange}
          ></textarea>
                </div>
                <div>
                    <select
                        name="priority"
                        value={formData.priority} // Контрольований елемент
                        onChange={handleChange}
                    >
                        {Object.entries(PRIORITIES).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <button type="button" onClick={handleSave}>{buttonText}</button>
                </div>
            </form>
        </div>
    )
}