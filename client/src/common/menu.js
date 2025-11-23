import MainPage from "../pages/MainPage/MainPage";
import NewProjectPage from "../pages/NewProjectPage/NewProjectPage";
import ProjectsPage from "../pages/ProjectsPage/ProjectsPage";
import TasksPage from "../pages/TasksPage/TasksPage";

export const urls = {
  NEW_PROJECT_URL: '/projects/new',
  PROJECTS_URL: '/projects',
};

export const menuItems = [
  {
    path: '/',
    title: 'Main',
    Component: MainPage,
  },
  {
    path: urls.PROJECTS_URL,
    hideInMenu: true,
    title: 'Projects',
    Component: ProjectsPage,
  },
  {
    path: urls.NEW_PROJECT_URL,
    hideInMenu: true,
    Component: NewProjectPage,
  },
  {
    path: '/tasks',
    hideInMenu: true,
    title: 'Tasks',
    Component: TasksPage
  },
  {
    path: '/tasks/:projectId',
    hideInMenu: true,
    Component: TasksPage
  },
];