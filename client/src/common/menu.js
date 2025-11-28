import MainPage from "../pages/MainPage/MainPage";
import NewProjectPage from "../pages/NewProjectPage/NewProjectPage";
import ProjectsPage from "../pages/ProjectsPage/ProjectsPage";
import TasksPage from "../pages/TasksPage/TasksPage";
import EditProjectPage from "../pages/EditProjectPage/EditProjectPage.jsx";
import NewTaskPage from "../pages/NewTaskPage/NewTaskPage.jsx";
import EditTaskPage from "../pages/EditTaskPage/EditTaskPage.jsx";
import TaskViewPage from "../pages/TaskViewPage/TaskViewPage.jsx";

export const urls = {
    NEW_PROJECT_URL: '/projects/new',
    EDIT_PROJECT_URL: 'projects/edit/:projectId',
    PROJECTS_URL: '/projects',
    TASK_URL: '/tasks',
    NEW_TASK_URL: '/tasks/new',
    EDIT_TASK_URL: 'tasks/edit/:taskId',
    VIEW_TASK_URL: 'tasks/view/:taskId',
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
        path: '/tasks/:projectId',
        hideInMenu: true,
        Component: TasksPage
    },
    {
        path: urls.EDIT_PROJECT_URL,
        hideInMenu: true,
        Component: EditProjectPage,
    },
    {
        path: urls.NEW_TASK_URL,
        hideInMenu: true,
        Component: NewTaskPage,
    },
    {
        path: urls.EDIT_TASK_URL,
        hideInMenu: true,
        Component: EditTaskPage,
    },
    {
        path: urls.TASK_URL,
        hideInMenu: true,
        title: 'Tasks',
        Component: TasksPage
    },
    {
        path: urls.VIEW_TASK_URL,
        hideInMenu: true,
        Component: TaskViewPage
    },

];