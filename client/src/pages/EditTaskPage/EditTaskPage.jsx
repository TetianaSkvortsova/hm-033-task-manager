import React from 'react';
import TaskForm from "../../components/TaskForm/TaskForm.jsx";
import {useSelector} from "react-redux";
import {useParams} from "react-router";

function EditTaskPage() {
    const {taskId} = useParams();
    const taskToEdit = useSelector(state => state.tasks.data.find(task => task.id === taskId));

    return (
        <div>
            <TaskForm initialData={taskToEdit} taskId={taskId}/>
        </div>
    );
}

export default EditTaskPage;