import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import './TasksPage.css';
import TaskCard from '../../components/TaskCard/TaskCard';
import { useEffect } from 'react';
import { getTasksAsync } from '../../store/features/tasks';

export default function TasksPage() {
  const { data: tasks } = useSelector(state => state.tasks);
  const { projectId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTasksAsync(projectId));
  }, [dispatch, projectId]);


  return (
    <div className='TasksPage'>
      {tasks.length === 0 && <span>No tasks available</span>}
      {tasks.map(task => (
        <TaskCard key={task.id} {...task} />
      ))}
    </div>
  )
}