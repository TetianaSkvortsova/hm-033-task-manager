import express, {json} from 'express';
import cors from 'cors';
import {v4 as uuidv4} from 'uuid';
import tasksData from './mockData/tasks.json' with { type: 'json' };
import {usersData} from './mockData/users.js';
import {createHash} from 'node:crypto';
import { writeFile, readFile } from 'fs/promises';

const apiPrefix = '/api/';
let projectsData = [];

const app = express();
app.use(express.json());
app.use(cors({origin: '*'}));
const router = express.Router();

router.use((request, response, next) => {
    console.log(`New Request: ${request.protocol}://${request.headers.host}${request.url}`);
    next();
});
app.use(apiPrefix, router);

function md5(content) {
    return createHash('md5').update(content).digest('base64');
}

function findUserAndVerify(login, password) {
    const user = usersData.find(user => user.login === login);
    const passwordHash = md5(password);

    if (!user) {
        return null;
    }

    if (user.password_hash === passwordHash) {
        return user;
    } else {
        return null;
    }
}

async function readFileAsync(filename) {
    try {
        projectsData = JSON.parse(await readFile(filename, {encoding: 'utf-8', flag: 'r+'}));
        console.log(`Дані успішно прочитані з: ${filename}`);
    } catch (error) {
        console.error("Помилка при читанні файлу:", error);
    }
}

async function saveFileAsync(filename, data) {
    try {
        const dataToWrite = JSON.stringify(structuredClone(data), null, 2);

        await writeFile(filename, dataToWrite, 'utf-8');
        console.log(`Дані успішно збережено у файл: ${filename}`);
    } catch (error) {
        console.error("Помилка при записі файлу:", error);
    }
}

router.get('/projects', (request, response) => {
    return response.json(projectsData);
});

router.post('/projects', async (request, response) => {
    const data = request.body;
    const newProject = {
        id: uuidv4(),
        ...data,
    };
    projectsData.push(newProject);
    await saveFileAsync('./mockData/projects.json', projectsData);

    return response.send(newProject);
})

router.get('/tasks', (request, response) => {
    return response.json(tasksData);
});

router.get('/tasks/:projectId', (request, response) => {
    const {projectId} = request.params;
    const filtered = tasksData.filter((t) => t.projectId === projectId);
    return response.json(filtered);
});

router.post('/auth', (req, res) => {
    const {login, password} = req.body;

    const user = findUserAndVerify(login, password);

    if (user) {
        res.status(200).json({
            message: "Login successful",
            user: {id: user.id, name: user.name, hash: user.password_hash}
        });
    } else {
        res.status(401).json({message: "Wrong login or password"});
    }
});

router.get('/user-info', (request, response) => {
    const hash = request.header('Authorization');
    const user = usersData.find(user => user.password_hash === hash);
    response.status(200).json({
        message: "Login successful",
        user: {id: user.id, name: user.name, hash: user.password_hash}
    });
});

router.delete('/projects/:id', async (request, response) => {
    const {id} = request.params;
    const index = projectsData.findIndex(project => project.id === id);
    if (index !== -1) {
        projectsData.splice(index, 1);
        const filteredTasks = tasksData.filter(task => task.projectId !== id);
        await saveFileAsync('./mockData/projects.json', projectsData);
        await saveFileAsync('./mockData/tasks.json', filteredTasks);

        return response.status(200).json({
            message: `Project with ID ${id} deleted successfully.`,
            newProjectsCount: projectsData.length,
            projects: projectsData,
            tasks: filteredTasks
        });
    } else {
        return response.status(404).json({
            message: `Project with ID ${id} has not been found.`
        });
    }
})

router.get('projects/:id', (request, response) => {
    const {id} = request.params;
    const projectData = projectsData.find(project => project.id === id);
    return response.status(200).json({
        message: `Project with ID ${id}.`,
        projectCount: projectsData.length,
        project: projectData,
    });
})

router.put('/projects/:id', async (request, response) => {
    const updateData = request.body;
    const projectId = request.params.id;
    const indexProject = projectsData.findIndex(project => project.id === updateData.id);
    projectsData[indexProject] = {
        ...projectsData[indexProject],
        ...updateData,
        id: projectId
    };
    await saveFileAsync('./mockData/projects.json', projectsData);
    return response.status(200).json({
        message: `Project with ID ${projectId}.`,
        projectCount: projectsData.length,
        project: projectsData[indexProject],
    });
})

router.post('/tasks', async (request, response) => {
    const task = request.body;
    const newTask = {
        id: uuidv4(),
        ...task,
    };
    tasksData.push(newTask);

    await saveFileAsync('./mockData/tasks.json', tasksData);

    return response.status(201).json({
        message: 'Task created successfully.',
        task: newTask,
    });
});

router.delete('/tasks/:id', async (request, response) => {
    const { id } = request.params;
    const indexTask = tasksData.findIndex(task => task.id === id);

    if (indexTask !== -1) {
        tasksData.splice(indexTask, 1);
        await saveFileAsync('./mockData/tasks.json', tasksData);

        return response.status(200).json({
            message: `Task with ID ${id} deleted successfully.`,
            tasks: tasksData,
        });
    } else {
        return response.status(404).json({
            message: `Task with ID ${id} has not been found.`,
        });
    }
});

router.put('/tasks/:id', async (request, response) => {
    const updateData = request.body;
    const taskId = request.params.id;
    const indexTask = tasksData.findIndex(task => task.id === taskId);

    if (indexTask !== -1) {
        tasksData[indexTask] = {
            ...tasksData[indexTask],
            ...updateData,
            id: taskId
        };
        await saveFileAsync('./mockData/tasks.json', tasksData);
        return response.status(200).json({
            message: `Task with ID ${taskId} updated successfully.`,
            task: tasksData[indexTask],
        });
    } else {
        return response.status(404).json({
            message: `Task with ID ${taskId} has not been found.`
        });
    }
});

const PORT = process.env.PORT || 3000;

// console.log(md5('mysPassword1'));
// console.log(md5('mysPassword2'));

async function startServer() {
    await readFileAsync('./mockData/projects.json');
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

startServer();