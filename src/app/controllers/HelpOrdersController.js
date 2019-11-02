import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Matriculation from '../models/Matriculation';

class HelpOrdersController {
   async index(req, res) {
      const { studentId } = req.params;

      const questions = await HelpOrder.findAll({
         where: { student_id: studentId },
         attributes: [
            'question',
            'answer',
            'answer_at',
            ['created_at', 'sent_at'],
         ],
      });

      if (questions.length === 0) {
         return res
            .status(200)
            .json({ message: 'There are no questions from this student' });
      }

      return res.status(200).json({ questions });
   }

   async store(req, res) {
      const schema = Yup.object().shape({
         question: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
         return res
            .status(400)
            .json({ error: 'You need to provide a question' });
      }

      const { studentId } = req.params;

      const matriculationExists = await Matriculation.findOne({
         where: { student_id: studentId },
      });

      if (!matriculationExists) {
         return res
            .status(400)
            .json({ error: 'This students has not an matriculation' });
      }

      const { id, question } = await HelpOrder.create({
         student_id: studentId,
         question: req.body.question,
      });

      return res.status(200).json({
         message: 'Question succesffully sent',
         id,
         question,
      });
   }
}

export default new HelpOrdersController();
