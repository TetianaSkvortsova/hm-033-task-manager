import { useNavigate } from 'react-router';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import './ProjectsPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getProjectsAsync } from '../../store/features/projects';
import { urls } from '../../common/menu';

export default function ProjectsPage() {
  const { data: projects } = useSelector(state => state.projects);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProjectsAsync());
  }, [dispatch]);

  const handleClick = projectId => {
    navigate(`/tasks/${projectId}`);
  }

  return (
    <div className='ProjectsPage'>
      <button type='button' onClick={() => navigate(urls.NEW_PROJECT_URL)}>Add Project</button>
      <div className='Projects'>
        {projects.length === 0 && <span>No projects available</span>}
        {projects.map(project => (
          <ProjectCard key={project.id} {...project} onClick={handleClick} />
        ))}
      </div>
    </div>
  )
}