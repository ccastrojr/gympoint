module.exports = {
   up: queryInterface => {
      return queryInterface.bulkInsert(
         'plans',
         [
            {
               title: 'Start',
               description: 'The basic plan',
               duration: 1,
               price: 129.0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               title: 'Gold',
               description: 'Plan with some benefits',
               duration: 3,
               price: 109.0,
               created_at: new Date(),
               updated_at: new Date(),
            },
            {
               title: 'Diamond',
               description: 'Best plan',
               duration: 6,
               price: 89.0,
               created_at: new Date(),
               updated_at: new Date(),
            },
         ],
         {}
      );
   },

   down: () => {},
};
