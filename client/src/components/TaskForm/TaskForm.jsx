import React from 'react';
import {PRIORITIES} from "../../common/priorities.js";
import {ASSIGNEES} from "../../common/assignees.js";
import {useFormik} from 'formik'; // Import Formik hook
import * as Yup from 'yup'; // Import Yup for schema validation
import './TaskForm.css';
import {useDispatch, useSelector} from "react-redux";
import {createTaskAsync, updateTaskAsync} from "../../store/features/tasks.js";
import {useNavigate} from "react-router"; // Import minimal styling for error messages
import { urls } from '../../common/menu';

// 1. Define the validation schema using Yup
const TaskSchema = Yup.object().shape({
    title: Yup.string()
        .min(2, 'Title is too short (min 2 chars)')
        .max(100, 'Title is too long (max 100 chars)')
        .required('Title is required'),
    description: Yup.string()
        .min(10, 'Description is too short (min 10 chars)')
        .required('Description is required'),
    priority: Yup.string()
        // Ensure the selected value is one of the valid priority keys
        .oneOf(Object.keys(PRIORITIES), 'Invalid Priority selected')
        .required('Priority is required'),
    assignee: Yup.string()
        // Ensure the selected value is one of the valid priority keys
        .oneOf((ASSIGNEES.map(assignee => assignee.id)), 'Invalid Assignee selected')
        .required('Priority is required'),
    projectId: Yup.string() // <-- Додано валідацію для Project
        .required('Project is required'),
    // status, assignee, and projectId are needed for the task object but assumed to be handled
    // by default values or parent component and not directly rendered/validated here.
});

// Note: onSave should be an async function (e.g., a wrapper around Redux dispatch)
function TaskForm({
                      initialData = {},
                      projectId = '',
                  }) {
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const projects = useSelector(state => state.projects.data);
    const isEditing = Boolean(initialData.id);
    const formTitle = isEditing ? 'Edit Task' : 'Add New Task';
    const buttonText = isEditing ? 'Save Changes' : 'Create Task';

    const onSave = async (values) => {
        const action = isEditing ? updateTaskAsync : createTaskAsync;

        // В action ми передаємо дані, які включають ID, якщо це редагування
        // await dispatch(action(values)).unwrap();
        await dispatch(action(values));

        // Викликаємо функцію успіху, наприклад, для перенаправлення
        navigation(urls.TASK_URL);
    };

    // 2. Formik initialization
    const formik = useFormik({
        // Set initial values based on existing data or defaults
        initialValues: {
            title: initialData.title || '',
            description: initialData.description || '',
            priority: initialData.priority || Object.keys(PRIORITIES)[0],
            // Include other necessary fields with defaults/initial data
            status: initialData.status || 'todo',
            assignee: initialData.assignee || ASSIGNEES.map(assignee => assignee.id),
            projectId: initialData.projectId || 'Unassigned',
        },
        validationSchema: TaskSchema,
        onSubmit: async (values, {setSubmitting}) => {
            // Include the ID if editing
            const finalValues = isEditing ? {...values, id: initialData.id} : values;

            try {
                // Call the external save handler
                await onSave(finalValues);
            } catch (error) {
                console.error("Task save failed:", error);
            } finally {
                setSubmitting(false);
            }
        },
        // Allows form to update initial values when initialData prop changes (important for editing)
        enableReinitialize: true,
    });

    // Helper to check for validation error and display
    const getError = (field) => {
        return formik.touched[field] && formik.errors[field] ? formik.errors[field] : null;
    };

    return (
        <div className='TaskForm'>
            <h1>{formTitle}</h1>
            {/* 3. Attach Formik's handleSubmit to the form */}
            <form onSubmit={formik.handleSubmit}>

                {/* Title Input */}
                <div className='form-group'>
                    <label htmlFor="title">Task Title</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        // Attach Formik props
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} // Important for validation to trigger on touch
                        className={getError('title') ? 'input-error' : ''}
                    />
                    {/* Display error message */}
                    {getError('title') && (
                        <div className="error-message">{getError('title')}</div>
                    )}
                </div>

                {/* Description Textarea */}
                <div className='form-group'>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Enter detailed description"
                        rows="4"
                        // Attach Formik props
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={getError('description') ? 'input-error' : ''}
                    ></textarea>
                    {/* Display error message */}
                    {getError('description') && (
                        <div className="error-message">{getError('description')}</div>
                    )}
                </div>

                {/* Priority Select */}
                <div className='form-group'>
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        name="priority"
                        // Attach Formik props
                        value={formik.values.priority}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={getError('priority') ? 'select-error' : ''}
                    >
                        {/* Render options for priorities */}
                        {Object.entries(PRIORITIES).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                    {/* Display error message */}
                    {getError('priority') && (
                        <div className="error-message">{getError('priority')}</div>
                    )}
                </div>

                <div className='form-group'>
                    <label htmlFor="assignee">Assignees</label>
                    <select
                        id="assignee"
                        name="assignee"
                        // Attach Formik props
                        value={formik.values.assignee}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={getError('assignee') ? 'select-error' : ''}
                    >
                        {/* Render options for priorities */}
                        {ASSIGNEES.map(assignee => (
                            <option key={assignee.id} value={assignee.id}>
                                {assignee.name}
                            </option>
                        ))}
                    </select>
                    {/* Display error message */}
                    {getError('assignee') && (
                        <div className="error-message">{getError('assignee')}</div>
                    )}
                </div>

                <div className='form-group'>
                    <label htmlFor="projectId">Project</label>
                    <select
                        id="projectId"
                        name="projectId"
                        // Attach Formik props
                        value={formik.values.projectId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={getError('projectId') ? 'select-error' : ''}
                    >
                        {/* Render options for priorities */}
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.title}
                            </option>
                        ))}
                    </select>
                    {/* Display error message */}
                    {getError('projectId') && (
                        <div className="error-message">{getError('projectId')}</div>
                    )}
                </div>

                {/* Submit Button */}
                <div className='form-actions'>
                    <button
                        type="submit"
                        // Disable button if form is submitting or invalid (Formik's built-in check)
                        disabled={formik.isSubmitting || !formik.isValid}
                    >
                        {buttonText}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TaskForm;