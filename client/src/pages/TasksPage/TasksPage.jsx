import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router';
import './TasksPage.css';
import TaskCard from '../../components/TaskCard/TaskCard';
import {useEffect} from 'react';
import {getTasksAsync} from '../../store/features/tasks';
import {urls} from "../../common/menu.js";

export default function TasksPage() {
    const {data: tasks} = useSelector(state => state.tasks);
    const navigate = useNavigate();
    const {projectId} = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTasksAsync(projectId));
    }, [dispatch, projectId]);

    return (
        <div className='TasksPage'>
            <button type='button' onClick={() => navigate(urls.NEW_TASK_URL)}>Add Task</button>
            <div className="Tasks">
                {tasks.length === 0 && <span>No tasks available</span>}
                {tasks.map(task => (
                    <TaskCard key={task.id} {...task} />
                ))}
            </div>
        </div>
    )
}