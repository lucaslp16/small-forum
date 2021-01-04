const Sequelize = require ('sequelize');


const connection = new Sequelize('guiaperguntas', 'root','toor',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;