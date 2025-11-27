import PriorityLabel from '../PriorityLabel/PriorityLabel';
import './ProjectCard.css';
import ActionMenu from "../ActionMenu/ActionMenu.jsx";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog.jsx";
import {useState} from "react";
import {deleteProjectAsync, getProjectByIdAsync} from "../../store/features/projects.js";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router";

export default function ProjectCard({id, title, description, priority, onClick}) {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Для переходу на сторінку редагування
    const [openConfirm, setOpenConfirm] = useState(false);
    const handleClick = () => {
        onClick && onClick(id);
    }

    const handleEditProject = () => {
        dispatch(getProjectByIdAsync(id));
        navigate(`/projects/edit/${id}`); // СТВОРІТЬ ЦЕЙ МАРШРУТ У menu.js!
    };

    const handleCloseConfirm = (event) => {
        event.stopPropagation();
        setOpenConfirm(false);
    };

    const handleDeleteProject = () => {
        dispatch(deleteProjectAsync(id));
        setOpenConfirm(false);
    };

    return (
        <div className='ProjectCard' onClick={handleClick}>
            <ActionMenu onEdit={handleEditProject}
                        onDelete={() => setOpenConfirm(true)}/>
            <h3>{title}</h3>
            <PriorityLabel priority={priority}/>
            <p>
                {description}
            </p>
            <ConfirmationDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                onConfirm={handleDeleteProject}
                title={"Confirm Project Deletion"}
                description={"Are you sure you want to permanently delete this project? This action cannot be undone."}
                confirmText="Delete Project"
            />
        </div>
    )
}