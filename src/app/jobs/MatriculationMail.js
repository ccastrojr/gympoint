import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class MatriculationMail {
   get key() {
      return 'MatriculationMail';
   }

   async handle({ data }) {
      const { matriculation } = data;

      await Mail.sendMail({
         to: `${matriculation.student.name} <${matriculation.student.email}>`,
         subject: `GymPoint - Sua Matricula`,
         template: 'matriculation',
         context: {
            student: matriculation.student.name,
            plan: matriculation.plan.title,
            startDate: format(
               parseISO(matriculation.start_date),
               "'dia' dd 'de' MMMM 'de' yyyy",
               {
                  locale: pt,
               }
            ),
            endDate: format(
               parseISO(matriculation.end_date),
               "'dia' dd 'de' MMMM 'de' yyyy",
               {
                  locale: pt,
               }
            ),
            price: matriculation.price,
         },
      });
   }
}

export default new MatriculationMail();
