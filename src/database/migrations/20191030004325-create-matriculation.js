module.exports = {
   up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('matriculations', {
         id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
         },
         student_id: {
            type: Sequelize.INTEGER,
            references: {
               model: 'students',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: false,
         },
         plan_id: {
            type: Sequelize.INTEGER,
            references: {
               model: 'plans',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: false,
         },
         start_date: {
            type: Sequelize.DATE,
            allowNull: false,
         },
         end_date: {
            type: Sequelize.DATE,
            allowNull: false,
         },
         price: {
            type: Sequelize.DOUBLE,
            allowNull: false,
         },
         created_at: {
            type: Sequelize.DATE,
            allowNull: false,
         },
         updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
         },
      });
   },

   down: queryInterface => {
      return queryInterface.dropTable('matriculations');
   },
};
