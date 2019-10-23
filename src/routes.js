import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';

import authMiddleware from './app/middlewares/auth';
import fieldProvidedMiddleware from './app/middlewares/fields_provided';

const routes = new Router();

routes.get('/', (req, res) => {
   return res.json({ message: 'Rodando' });
});

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students/:id', fieldProvidedMiddleware, StudentController.update);

export default routes;
