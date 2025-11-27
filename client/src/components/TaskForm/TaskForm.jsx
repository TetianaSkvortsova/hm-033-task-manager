import React from 'react';
import {PRIORITIES} from "../../common/priorities.js";
import {ASSIGNEES} from "../../common/assignees.js";
import {useFormik} from 'formik'; // Import Formik hook
import * as Yup from 'yup'; // Import Yup for schema validation
import './TaskForm.css';
import {useDispatch, useSelector} from "react-redux";
import {createTaskAsync, updateTaskAsync} from "../../store/features/tasks.js";
import {useNavigate} from "react-router"; // Import minimal styling for error messages
import {urls} from '../../common/menu';

const TaskSchema = Yup.object().shape({
    title: Yup.string()
        .min(2, 'Title is too short (min 2 chars)')
        .max(100, 'Title is too long (max 100 chars)')
        .required('Title is required'),
    description: Yup.string()
        .min(10, 'Description is too short (min 10 chars)')
        .required('Description is required'),
    priority: Yup.string()
        .oneOf(Object.keys(PRIORITIES), 'Invalid Priority selected')
        .required('Priority is required'),
    assignee: Yup.string()
        .oneOf((ASSIGNEES.map(assignee => assignee.id)), 'Choose assignee')
        .required('Assignee is required'),
    projectId: Yup.string()
        .required('Project is required'),
});

function TaskForm({initialData = {}}) {
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const projects = useSelector(state => state.projects.data);
    const isEditing = Boolean(initialData.id);
    const formTitle = isEditing ? 'Edit Task' : 'Add New Task';
    const buttonText = isEditing ? 'Save Changes' : 'Create Task';

    const onSave = async (values) => {
        const action = isEditing ? updateTaskAsync : createTaskAsync;
        await dispatch(action(values));
        navigation(urls.TASK_URL);
    };

    const formik = useFormik({
        initialValues: {
            title: initialData.title || '',
            description: initialData.description || '',
            priority: initialData.priority || Object.keys(PRIORITIES)[0],
            status: initialData.status || 'todo',
            assignee: initialData.assignee || ASSIGNEES.map(assignee => assignee.id),
            projectId: initialData.projectId || 'Unassigned',
        },
        validationSchema: TaskSchema,
        onSubmit: async (values, {setSubmitting}) => {
            const finalValues = isEditing ? {...values, id: initialData.id} : values;

            try {
                await onSave(finalValues);
            } catch (error) {
                console.error("Task save failed:", error);
            } finally {
                setSubmitting(false);
            }
        },
        enableReinitialize: true,
    });

    const getError = (field) => {
        return formik.touched[field] && formik.errors[field] ? formik.errors[field] : null;
    };

    return (
        <div className='TaskForm'>
            <h1>{formTitle}</h1>
            <form onSubmit={formik.handleSubmit}>

                <div className='form-group'>
                    <label htmlFor="title">Task Title</label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={getError('title') ? 'input-error' : ''}
                    />
                    {getError('title') && (
                        <div className="error-message">{getError('title')}</div>
                    )}
                </div>

                <div className='form-group'>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Enter detailed description"
                        rows="4"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={getError('description') ? 'input-error' : ''}
                    ></textarea>
                    {getError('description') && (
                        <div className="error-message">{getError('description')}</div>
                    )}
                </div>

                <div className='form-group'>
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        name="priority"
                        value={formik.values.priority}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={getError('priority') ? 'select-error' : ''}
                    >
                        {Object.entries(PRIORITIES).map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                    {getError('priority') && (
                        <div className="error-message">{getError('priority')}</div>
                    )}
                </div>

                <div className='form-group'>
                    <label htmlFor="assignee">Assignees</label>
                    <select
                        id="assignee"
                        name="assignee"
                        value={formik.values.assignee}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={getError('assignee') ? 'select-error' : ''}
                    >
                        <option value="">Choose assignee</option>
                        {ASSIGNEES.map(assignee => (
                            <option key={assignee.id} value={assignee.id}>
                                {assignee.name}
                            </option>
                        ))}
                    </select>
                    {getError('assignee') && (
                        <div className="error-message">{getError('assignee')}</div>
                    )}
                </div>

                <div className='form-group'>
                    <label htmlFor="projectId">Project</label>
                    <select
                        id="projectId"
                        name="projectId"
                        value={formik.values.projectId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={getError('projectId') ? 'select-error' : ''}
                    >
                        <option value="">Choose project</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.title}
                            </option>
                        ))}
                    </select>
                    {getError('projectId') && (
                        <div className="error-message">{getError('projectId')}</div>
                    )}
                </div>

                <div className='form-actions'>
                    <button
                        type="submit"
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