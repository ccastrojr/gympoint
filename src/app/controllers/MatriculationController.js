import * as Yup from 'yup';
import {
   isBefore,
   parseISO,
   addMonths,
   startOfHour,
   startOfDay,
   endOfDay,
   subDays,
   addDays,
   isWithinInterval,
} from 'date-fns';

import Plan from '../models/Plan';
import Student from '../models/Student';
import Matriculation from '../models/Matriculation';

import Queue from '../../lib/Queue';
import MatriculationMail from '../jobs/MatriculationMail';

class MatriculationController {
   async index(req, res) {
      const { page = 1 } = req.query;

      const matriulations = await Matriculation.findAll({
         attributes: ['id', 'start_date', 'end_date', 'price'],
         order: ['start_date'],
         limit: 20,
         offset: (page - 1) * 20,
         include: [
            {
               model: Student,
               as: 'student',
               attributes: ['id', 'name', 'age'],
            },
            {
               model: Plan,
               as: 'plan',
               attributes: ['id', 'title', 'description'],
            },
         ],
      });

      if (!matriulations) {
         res.status(404).json({ error: 'There are no matriculations to list' });
      }

      return res.status(200).json(matriulations);
   }

   async store(req, res) {
      const schema = Yup.object().shape({
         student_id: Yup.number()
            .positive()
            .required(),
         plan_id: Yup.number()
            .positive()
            .required(),
         start_date: Yup.date().required(),
      });

      if (!(await schema.isValid(req.body))) {
         return res.status(400).json({ error: 'Fields validation invalid' });
      }

      const studentExists = await Student.findByPk(req.body.student_id);

      if (!studentExists) {
         return res
            .status(400)
            .json({ error: 'There are no student with this id.' });
      }

      const matriculationExists = await Matriculation.findOne({
         where: { student_id: req.body.student_id },
      });

      if (matriculationExists) {
         const isValidMatriculation = isWithinInterval(new Date(), {
            start: startOfDay(subDays(matriculationExists.start_date, 1)),
            end: endOfDay(addDays(matriculationExists.end_date, 1)),
         });

         if (!isValidMatriculation) {
            return res.status(401).json({
               error:
                  'This student is already matriculated but his matriculation has expired',
            });
         }

         return res
            .status(401)
            .json({ error: 'This student is already matriculated' });
      }

      const plan = await Plan.findByPk(req.body.plan_id);

      if (!plan) {
         return res.status(400).json({ error: 'This plan does not exists' });
      }

      const startDate = startOfHour(parseISO(req.body.start_date));

      if (isBefore(startDate, new Date())) {
         return res.status(400).json({ error: 'Past dates are not permitted' });
      }

      const endDate = addMonths(startDate, plan.duration);
      const price = plan.duration * plan.price;

      const { id, student_id, plan_id } = await Matriculation.create({
         student_id: req.body.student_id,
         plan_id: req.body.plan_id,
         start_date: startDate,
         end_date: endDate,
         price,
      });

      const matriculation = await Matriculation.findOne({
         where: { id },
         attributes: ['start_date', 'end_date', 'price'],
         include: [
            {
               model: Student,
               as: 'student',
               attributes: ['name', 'email'],
            },
            {
               model: Plan,
               as: 'plan',
               attributes: ['title'],
            },
         ],
      });

      await Queue.add(MatriculationMail.key, {
         matriculation,
      });

      return res.status(200).json({
         message: 'Matricullation successfully created',
         id,
         student_id,
         plan_id,
         startDate,
         endDate,
         price,
      });
   }

   async update(req, res) {
      const schema = Yup.object().shape({
         plan_id: Yup.number()
            .positive()
            .required(),
         start_date: Yup.date(),
      });

      if (!(await schema.isValid(req.body))) {
         return res.status(400).json({ error: 'Fields validation invalid' });
      }

      const { matriculationId } = req.params;

      const matriculation = await Matriculation.findByPk(matriculationId);

      if (!matriculation) {
         return res
            .status(400)
            .json({ error: 'There are no matriculation with this id' });
      }

      const { plan_id, start_date } = req.body;

      const startDate = startOfHour(parseISO(start_date));

      if (isBefore(startDate, new Date())) {
         return res.status(400).json({ error: 'Past dates are not permitted' });
      }

      const newPlan = await Plan.findByPk(plan_id);

      if (!newPlan) {
         return res
            .status(400)
            .json({ error: 'There are no plan with this id' });
      }

      const isValidMatriculation = isWithinInterval(new Date(), {
         start: startOfDay(subDays(matriculation.start_date, 1)),
         end: endOfDay(addDays(matriculation.end_date, 1)),
      });

      if (isValidMatriculation) {
         return res.status(401).json({
            error:
               'You can only renew your registration after the current plan ends',
         });
      }

      const newEnd_date = addMonths(startDate, newPlan.duration);
      const newPrice = newPlan.duration * newPlan.price;

      const { student_id } = await matriculation.update({
         plan_id,
         start_date: startDate,
         end_date: newEnd_date,
         price: newPrice,
      });

      return res.status(200).json({
         message: 'Matriculation succesffuly updated',
         id: matriculationId,
         student_id,
         plan_id,
         start_date: startDate,
         end_date: newEnd_date,
         price: newPrice,
      });
   }

   async delete(req, res) {
      const matriculation = await Matriculation.findByPk(
         req.params.matriculationId
      );

      if (!matriculation) {
         return res.status(404).json({ error: 'Matriculation not found' });
      }

      await Matriculation.destroy({
         where: { id: matriculation.id },
      });

      return res
         .status(200)
         .json({ message: 'Matriculation successfully deleted' });
   }
}

export default new MatriculationController();
