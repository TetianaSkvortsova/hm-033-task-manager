import React from 'react';
import * as Yup from "yup";
import {PRIORITIES} from "../../common/priorities.js";
import {useFormik} from "formik";
import {urls} from "../../common/menu.js";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router";
import {saveProjectAsync, updateProjectAsync} from "../../store/features/projects.js";
import './ProjectForm.css';

const ProjectSchema = Yup.object().shape({
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
});

function ProjectForm({initialData = {}}) {
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const isEditing = Boolean(initialData.id);
    const formTitle = isEditing ? 'Edit Project' : 'Add New Project';
    const buttonText = isEditing ? 'Save Changes' : 'Create Project';

    const onSave = async (values) => {
        const action = isEditing ? updateProjectAsync : saveProjectAsync;
        await dispatch(action(values));
        setTimeout(() => {navigation(urls.PROJECTS_URL)}, 1000);
        // navigation(urls.PROJECTS_URL);
    };

    const formik = useFormik({
        initialValues: {
            title: initialData.title || '',
            description: initialData.description || '',
            priority: initialData.priority || Object.keys(PRIORITIES)[0],
        },
        validationSchema: ProjectSchema,
        onSubmit: async (values, {setSubmitting}) => {
            const finalValues = isEditing ? {...values, id: initialData.id} : values;

            try {
                await onSave(finalValues);
            } catch (error) {
                console.error("Project save failed:", error);
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
        <div className="projectForm">
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

                <div className='form-actions'>
                    <button
                        type="submit"
                        disabled={formik.isSubmitting || !formik.isValid}
                    >
                        {buttonText}
                    </button>
                    <button type="button" onClick={()=> navigation(urls.PROJECTS_URL)}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default ProjectForm;