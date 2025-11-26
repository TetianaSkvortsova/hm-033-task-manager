import PriorityLabel from '../PriorityLabel/PriorityLabel';
import './TaskCard.css';
import ActionMenu from "../ActionMenu/ActionMenu.jsx";
import { useDispatch } from "react-redux";
// ПОТРІБЕН ІМПОРТ З НОВОСТВОРЕНОГО ФАЙЛУ store/features/tasks.js
import { deleteTaskAsync, getTaskByIdAsync } from '../../store/features/tasks';
import { useNavigate } from "react-router";

export default function TaskCard({id, title, description, priority}) {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Для переходу на сторінку редагування таски

    // Обробник для редагування таски
    const handleEditTask = () => {
        // Завантажуємо таску в Redux-стан (currentTask) та перенаправляємо
        // ВАЖЛИВО: Хоча ми dispatch getTaskByIdAsync тут, для Redux-Form в компоненті EditTaskPage буде зручніше.
        dispatch(getTaskByIdAsync(id));
        navigate(`/tasks/edit/${id}`); // СТВОРІТЬ ЦЕЙ МАРШРУТ У menu.js!
        console.log(`Navigating to edit task with ID: ${id}`);
    };

    // Обробник для видалення таски
    const handleDeleteTask = () => {
        // В ідеалі тут має бути діалогове вікно підтвердження перед dispatch
        if (window.confirm("Are you sure you want to delete this task?")) {
            // Викликаємо асинхронний Thunk для видалення
            dispatch(deleteTaskAsync(id));
        }
    };

    // ПРИМІТКА: Ми передаємо ці обробники в ActionMenu
    return (
        <div className='TaskCard'>
            {/* onEdit та onDelete передаються з TaskCard в ActionMenu */}
            <ActionMenu
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
            />
            <h3>{title}</h3>
            <PriorityLabel priority={priority}/>
            <p>
                {description.slice(0, 100)}
            </p>
        </div>
    )
}