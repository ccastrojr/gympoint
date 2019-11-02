import Student from '../models/Student';

export default async (req, res, next) => {
   const { studentId } = req.params;

   const studentExists = await Student.findByPk(studentId);

   if (!studentExists) {
      return res
         .status(400)
         .json({ error: 'There are no student with this id.' });
   }

   return next();
};
