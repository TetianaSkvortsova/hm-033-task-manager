import express from 'express';
import cors from 'cors';
import {v4 as uuidv4} from 'uuid';
import projectsMock from './mockData/projects.json' with { type: 'json' };
import tasksData from './mockData/tasks.json' with { type: 'json' };
import {usersData} from './mockData/users.js';
import {createHash} from 'node:crypto';
import { writeFile } from 'fs/promises';

const app = express();
app.use(express.json());
app.use(cors());

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

async function saveFileAsync(filename, data) {
    try {
        const dataToWrite = JSON.stringify(data, null, 2);

        await writeFile(filename, dataToWrite, 'utf-8');
        console.log(`Дані успішно збережено у файл: ${filename}`);
    } catch (error) {
        console.error("Помилка при записі файлу:", error);
    }
}

app.get('/projects', (request, response) => {
    return response.json(projectsMock);
});

app.post('/projects', (request, response) => {
    const data = request.body;
    const newProject = {
        id: uuidv4(),
        ...data,
    };
    projectsMock.push(newProject);
    return response.send(newProject);
})

app.get('/tasks', (request, response) => {
    return response.json(tasksData);
});

app.get('/tasks/:projectId', (request, response) => {
    const {projectId} = request.params;
    const filtered = tasksData.filter((t) => t.projectId === projectId);
    return response.json(filtered);
});

app.post('/auth', (req, res) => {
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

app.get('/user-info', (request, response) => {
    const hash = request.header('Authorization');
    const user = usersData.find(user => user.password_hash === hash);
    response.status(200).json({
        message: "Login successful",
        user: {id: user.id, name: user.name, hash: user.password_hash}
    });
});

app.delete('/projects/:id', async (request, response) => {
    const {id} = request.params;
    const index = projectsMock.findIndex(project => project.id === id);
    if (index !== -1) {
        projectsMock.splice(index, 1);
        const filteredTasks = tasksData.filter(task => task.projectId !== id);
        await saveFileAsync('./mockData/projects.json', projectsMock);
        await saveFileAsync('./mockData/tasks.json', filteredTasks);

        return response.status(200).json({
            message: `Project with ID ${id} deleted successfully.`,
            newProjectsCount: projectsMock.length,
            projects: projectsMock,
            tasks: filteredTasks
        });
    } else {
        return response.status(404).json({
            message: `Project with ID ${id} has not been found.`
        });
    }
})

app.get('/projects/:id', (request, response) => {
    const {id} = request.params;
    const projectData = projectsMock.find(project => project.id === id);
    return response.status(200).json({
        message: `Project with ID ${id}.`,
        projectCount: projectsMock.length,
        project: projectData,
    });
})

app.put('/projects/:id', (request, response) => {
    const updateData = request.body;
    const projectId = request.params.id;
    const indexProject = projectsMock.findIndex(project => project.id === updateData.id);
    projectsMock[indexProject] = {
        ...projectsMock[indexProject],
        ...updateData,
        id: projectId
    };
    return response.status(200).json({
        message: `Project with ID ${projectId}.`,
        projectCount: projectsMock.length,
        project: projectsMock[indexProject],
    });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// console.log(md5('mysPassword1'));
// console.log(md5('mysPassword2'));
