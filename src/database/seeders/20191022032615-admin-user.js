const bcrytp = require('bcryptjs');

module.exports = {
   up: queryInterface => {
      return queryInterface.bulkInsert(
         'users',
         [
            {
               name: 'Administrator',
               email: 'admin@gympoint.com',
               password_hash: bcrytp.hashSync('123456', 8),
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: () => {},
};
