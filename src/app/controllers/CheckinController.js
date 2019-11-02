import { Op } from 'sequelize';
import {
   isWithinInterval,
   startOfDay,
   endOfDay,
   subDays,
   addDays,
} from 'date-fns';

import Checkin from '../models/Checkin';
import Student from '../models/Student';
import Matriculation from '../models/Matriculation';

class CheckinController {
   async index(req, res) {
      const { studentId } = req.params;

      const studentExists = await Student.findByPk(studentId);

      const { name, email } = studentExists;

      const studentCheckins = await Checkin.findAll({
         where: { student_id: studentId },
         attributes: ['id', ['created_at', 'checkin_date']],
         order: [['created_at', 'desc']],
      });

      return res.status(200).json({
         student_data: {
            name,
            email,
         },
         studentCheckins,
      });
   }

   async store(req, res) {
      const { studentId } = req.params;

      const matriculationExists = await Matriculation.findOne({
         where: { student_id: studentId },
      });

      if (!matriculationExists) {
         return res
            .status(400)
            .json({ error: 'This students has not an matriculation' });
      }

      const isValidMatriculation = isWithinInterval(new Date(), {
         start: startOfDay(subDays(matriculationExists.start_date, 1)),
         end: endOfDay(addDays(matriculationExists.end_date, 1)),
      });

      if (!isValidMatriculation) {
         return res
            .status(401)
            .json({ error: 'Student matriculation is no valid' });
      }

      const hasCheckinOnDay = await Checkin.findOne({
         where: {
            created_at: {
               [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
            },
         },
      });

      if (hasCheckinOnDay) {
         return res
            .status(401)
            .json({ error: 'You cannot do more than one checkin per day' });
      }

      const isOnLimit = subDays(new Date(), 6);

      const countCheckins = await Checkin.count({
         where: {
            student_id: studentId,
            created_at: {
               [Op.gte]: isOnLimit,
            },
         },
      });

      if (countCheckins >= 5) {
         return res.status(401).json({
            error: 'You reached the limit of checkins in a week',
         });
      }

      const checkinSucess = await Checkin.create({
         student_id: studentId,
      });

      return res
         .status(200)
         .json({ message: 'Checkin successfully created', checkinSucess });
   }
}

export default new CheckinController();
