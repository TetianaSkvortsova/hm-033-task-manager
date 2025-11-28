import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router';
import './TasksPage.css';
import TaskCard from '../../components/TaskCard/TaskCard';
import {useEffect} from 'react';
import {getTasksAsync} from '../../store/features/tasks';
import {urls} from "../../common/menu.js";
import TaskFilter from "../../components/TaskFilter/TaskFilter.jsx";

export default function TasksPage() {
    const {data: tasks} = useSelector(state => state.tasks);
    const navigate = useNavigate();
    const {projectId} = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTasksAsync(projectId));
    }, [dispatch, projectId]);

    const handleClick = (taskId) => {
        navigate(`/tasks/view/${taskId}`);
    }

    return (
        <div className='TasksPage'>
            {!projectId &&
            <div className='TasksPage__Header'>
                <TaskFilter />
                <button type='button' onClick={() => navigate(urls.NEW_TASK_URL)}>Add Task</button>
            </div>
            }
            <div className="Tasks">
                {tasks.length === 0 && <span>No tasks available</span>}
                {tasks.map(task => (
                    <TaskCard key={task.id} {...task} onClick={handleClick}/>
                ))}
            </div>
        </div>
    )
}