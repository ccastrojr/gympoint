import Bee from 'bee-queue';

import MatriculationMail from '../app/jobs/MatriculationMail';
import AnswerMail from '../app/jobs/AnswerMail';

import redisConfig from '../config/redis';

const jobs = [MatriculationMail, AnswerMail];

class Queue {
   constructor() {
      this.queues = {};

      this.init();
   }

   init() {
      jobs.forEach(({ key, handle }) => {
         this.queues[key] = {
            bee: new Bee(key, {
               redis: redisConfig,
            }),
            handle,
         };
      });
   }

   add(queue, job) {
      return this.queues[queue].bee.createJob(job).save();
   }

   processQueue() {
      jobs.forEach(job => {
         const { bee, handle } = this.queues[job.key];

         bee.on('failed', this.handleFailure).process(handle);
      });
   }

   handleFailure(job, err) {
      console.log(`\n\nQueue ${job.queue.name} failed\nLogs:\n`, err);
   }
}

export default new Queue();
