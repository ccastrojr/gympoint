import * as Yup from 'yup';

import Plan from '../models/Plan';

class PlanController {
   async index(req, res) {
      const plans = await Plan.findAll({
         attributes: ['id', 'title', 'description', 'duration', 'price'],
      });

      if (!plans) {
         return res
            .status(404)
            .json({ error: 'There are no plans registered' });
      }

      return res.status(200).json(plans);
   }

   async store(req, res) {
      const schema = Yup.object().shape({
         title: Yup.string().required(),
         description: Yup.string().required(),
         duration: Yup.number()
            .integer()
            .positive()
            .required(),
         price: Yup.number()
            .positive()
            .required(),
      });

      if (!(await schema.isValid(req.body))) {
         return res.status(400).json({ error: 'Fields validation invalid.' });
      }

      const planExists = await Plan.findOne({
         where: { title: req.body.title },
      });

      if (planExists) {
         return res.status(400).json({
            error: 'This plan already exists',
            data: {
               title: planExists.title,
               description: planExists.description,
               duration: planExists.duration,
               price: planExists.price,
            },
         });
      }

      const { id, title, description, duration, price } = await Plan.create(
         req.body
      );

      return res.status(200).json({
         message: 'Plan succesfully created',
         id,
         title,
         description,
         duration,
         price,
      });
   }

   async update(req, res) {
      const schema = Yup.object().shape({
         title: Yup.string(),
         description: Yup.string(),
         duration: Yup.number()
            .integer()
            .positive(),
         price: Yup.number().positive(),
      });

      if (!(await schema.isValid(req.body))) {
         return res.status(400).json({ error: 'Fields validation invalid.' });
      }

      const plan = await Plan.findByPk(req.params.planId);

      if (!plan) {
         return res.status(400).json({ error: 'Plan not found' });
      }

      if (req.body.title && req.body.title !== plan.title) {
         const planExists = await Plan.findOne({
            where: { title: req.body.title },
         });

         if (planExists) {
            return res.status(401).json({ error: 'This plan already exists' });
         }
      }

      const { id, title, description, duration, price } = await plan.update(
         req.body
      );

      return res.status(200).json({
         message: 'Plan successfully updated',
         id,
         title,
         description,
         duration,
         price,
      });
   }

   async delete(req, res) {
      const plan = await Plan.findByPk(req.params.planId);

      if (!plan) {
         return res.status(404).json({ error: 'Plan not found.' });
      }

      await Plan.destroy({
         where: { id: plan.id },
      });

      return res.status(200).json({ message: 'Plan successfully deleted.' });
   }
}

export default new PlanController();
