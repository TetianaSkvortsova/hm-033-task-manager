import PriorityLabel from '../PriorityLabel/PriorityLabel';
import './TaskCard.css';
import ActionMenu from "../ActionMenu/ActionMenu.jsx";
import {useDispatch} from "react-redux";
import {deleteTaskAsync, getTaskByIdAsync} from '../../store/features/tasks';
import {useNavigate} from "react-router";
import {useState} from "react";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog.jsx";
import StatusLabel from "../StatusLabel/StatusLabel.jsx";

export default function TaskCard({id, title, description, priority, status}) {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Для переходу на сторінку редагування таски
    const [openConfirm, setOpenConfirm] = useState(false);

    const handleEditTask = () => {
        dispatch(getTaskByIdAsync(id));
        navigate(`/tasks/edit/${id}`);
    };

    const handleDeleteTask = () => {
        dispatch(deleteTaskAsync(id));
        setOpenConfirm(false);
    };

    const handleCloseConfirm = (event) => {
        event.stopPropagation();
        setOpenConfirm(false);
    };

    return (
        <div className='TaskCard'>
            <ActionMenu
                onEdit={handleEditTask}
                onDelete={() => setOpenConfirm(true)}
            />
            <h3>{title}</h3>

            <PriorityLabel priority={priority}/>
            <p>
                {description.slice(0, 100)}
            </p>
            <StatusLabel status={status} />
            <ConfirmationDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                onConfirm={handleDeleteTask}
                title={"Confirm Task Deletion"}
                description={"Are you sure you want to permanently delete this task? This action cannot be undone."}
                confirmText="Delete Task"
            />
        </div>
    )
}