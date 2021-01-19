const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('wt2018244', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        freezeTableName: true
    }
});

try {
    sequelize.authenticate().then(s => {
        console.log('Connection has been established successfully.')
    })
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

module.exports = sequelize;