import React from 'react';
import './TaskViewPage.css';
import {useParams} from "react-router";
import {useSelector} from "react-redux";

function TaskViewPage() {
    const taskId = useParams().taskId;
    const task = useSelector(state =>
        state.tasks.data.find(task => task.id === taskId)
    );
    const project = useSelector(state => state.projects.data);

    if (!task) {
        return <div>Task not found or loading...</div>;
    }
    const {title, description, priority, status, assignee, projectId} = task;
    const projectTitle = project.find(project => project.id === projectId).title;


    return (
        <div className="task-view">
            <div className="title">{title}</div>
            <div className="description">{description}</div>
            <div className="info-grid">
                <div className="status info-item">
                    <span className="info-item-label">Status</span>
                    <span className="info-item-value">{status}</span>
                </div>

                <div className="priority info-item">
                    <span className="info-item-label">Priority</span>
                    <span className="info-item-value">{priority}</span>
                </div>

                <div className="assignee info-item">
                    <span className="info-item-label">Assignee</span>
                    <span className="info-item-value">{assignee}</span>
                </div>

                <div className="project info-item">
                    <span className="info-item-label">Project ID</span>
                    <span className="info-item-value">{projectTitle}</span>
                </div>
            </div>
        </div>
    );
}

export default TaskViewPage;