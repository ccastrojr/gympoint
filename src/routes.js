import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import MatriculationController from './app/controllers/MatriculationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrdersController from './app/controllers/HelpOrdersController';
import AnswerQuestionsController from './app/controllers/AnswerQuestionsController';

import authMiddleware from './app/middlewares/auth';
import fieldProvidedMiddleware from './app/middlewares/fields_provided';
import studentValidation from './app/middlewares/studant_validation';

const routes = new Router();

routes.get('/', (req, res) => {
   return res.json({ message: 'Rodando' });
});

routes.post('/users', UserController.store);

routes.post('/sessions', SessionController.store);

routes.get('/plans', PlanController.index);

routes.post(
   '/students/:studentId/checkins',
   studentValidation,
   CheckinController.store
);
routes.get(
   '/students/:studentId/checkins',
   studentValidation,
   CheckinController.index
);
routes.post(
   '/students/:studentId/help-orders',
   studentValidation,
   HelpOrdersController.store
);
routes.get(
   '/students/:studentId/help-orders',
   studentValidation,
   HelpOrdersController.index
);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put(
   '/students/:studentId',
   fieldProvidedMiddleware,
   studentValidation,
   StudentController.update
);

routes.post('/plans', PlanController.store);
routes.put('/plans/:planId', fieldProvidedMiddleware, PlanController.update);
routes.delete('/plans/:planId', PlanController.delete);

routes.post('/matriculations', MatriculationController.store);
routes.get('/matriculations', MatriculationController.index);
routes.put(
   '/matriculations/:matriculationId',
   fieldProvidedMiddleware,
   MatriculationController.update
);
routes.delete(
   '/matriculations/:matriculationId',
   MatriculationController.delete
);

routes.post(
   '/help_orders/:studentId/answer',
   studentValidation,
   AnswerQuestionsController.store
);
routes.get('/help_orders', AnswerQuestionsController.index);

export default routes;
