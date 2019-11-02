import * as Yup from 'yup';
import { Op } from 'sequelize';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import Queue from '../../lib/Queue';
import AnswerMail from '../jobs/AnswerMail';

class AnswerQuestionsController {
   async index(req, res) {
      const helpOrdersWithoutAnswer = await HelpOrder.findAll({
         where: { answer: { [Op.is]: null } },
      });

      if (helpOrdersWithoutAnswer.length === 0) {
         return res
            .status(200)
            .json({ message: 'There are no messages to answer' });
      }

      return res.status(200).json(helpOrdersWithoutAnswer);
   }

   async store(req, res) {
      const schema = Yup.object().shape({
         id: Yup.number()
            .positive()
            .required(),
         answer: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
         return res.status(400).json({ error: 'Validation fields invalid' });
      }

      const { studentId } = req.params;

      const helpOrder = await HelpOrder.findOne({
         where: {
            id: req.body.id,
            student_id: studentId,
         },
      });

      if (helpOrder.answer !== null) {
         return res
            .status(401)
            .json({ message: 'This question is already answed' });
      }

      if (!helpOrder) {
         return res
            .status(400)
            .json({ error: 'There are no message to answer' });
      }

      const { id, question, answer, answer_at } = await helpOrder.update({
         answer: req.body.answer,
         answer_at: new Date(),
      });

      const helpOrder_mail = await HelpOrder.findOne({
         where: { id },
         attributes: ['question', 'answer'],
         include: [
            {
               model: Student,
               as: 'student',
               attributes: ['name', 'email'],
            },
         ],
      });

      Queue.add(AnswerMail.key, {
         helpOrder_mail,
      });

      return res.status(200).json({
         message: 'Question succesffully answed',
         id,
         question,
         answer,
         answer_at,
      });
   }
}

export default new AnswerQuestionsController();
