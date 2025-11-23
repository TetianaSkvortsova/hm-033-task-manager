import PriorityLabel from '../PriorityLabel/PriorityLabel';
import './ProjectCard.css';
import {useDispatch} from "react-redux";
import {deleteProjectAsync} from "../../store/features/projects.js";

export default function ProjectCard({id, title, description, priority, onClick}) {
    const dispatch = useDispatch();
    const handleClick = () => {
        onClick && onClick(id);
    }
    const handleDelete = (event) => {
        event.stopPropagation();
        dispatch(deleteProjectAsync(id));
    }
    return (
        <div className='ProjectCard' onClick={handleClick}>
            <div className="delete" onClick={handleDelete}></div>
            <h3>{title}</h3>
            <PriorityLabel priority={priority}/>
            <p>
                {description}
            </p>
        </div>
    )
}