import Mail from '../../lib/Mail';

class AnswerMail {
   get key() {
      return AnswerMail;
   }

   async handle({ data }) {
      const { helpOrder_mail } = data;

      await Mail.sendMail({
         to: `${helpOrder_mail.student.name} <${helpOrder_mail.student.email}>`,
         subject: `GymPoint - Resposta da sua pergunta`,
         template: 'answer',
         context: {
            student: helpOrder_mail.student.name,
            question: helpOrder_mail.question,
            answer: helpOrder_mail.answer,
         },
      });
   }
}

export default new AnswerMail();
