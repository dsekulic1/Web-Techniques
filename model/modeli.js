const Sequelize = require ('sequelize');

module.exports = function (sequelize) {
    //kreiranje tabela koristeci model shodno kreiranju modela na spirali 2, 
    //koje vracamo iz modela kako bi ih dalje mogli koristiti

    const Predmet = sequelize.define('Predmet', {
        naziv: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    });
    const Grupa = sequelize.define('Grupa', {
        naziv: {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {
        name: {
            singular: 'Grupa',
            plural: 'Grupe',
        }
    });

    const Aktivnost = sequelize.define('Aktivnost', {
        naziv: {
            type: Sequelize.STRING,
            allowNull: false
        },
        pocetak: {
            type: Sequelize.FLOAT,
            allowNull: false,
            validate:{
                min:8,
                max:20
            }
        },
        kraj: {
            type: Sequelize.FLOAT,
            allowNull: false,
            validate:{
                min:8,
                max:20
            }
        }
    });
    const Dan = sequelize.define('Dan', {
        naziv: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    });
    const Tip = sequelize.define('Tip', {
        naziv: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    });
    const Student = sequelize.define('Student', {
        ime: {
            type: Sequelize.STRING,
            allowNull: false
        },
        index: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    });

    //kreiranje relacija, cime ispunjavamo prvi dio spirale 4

    //Predmet 1-N Grupa
    Predmet.hasMany(Grupa, {
        foreignKey: {
            allowNull: false
        }
    });
    Grupa.belongsTo(Predmet);

    //Aktivnost N-1 Predmet
    Aktivnost.belongsTo(Predmet, {
        foreignKey: {
            allowNull: false
        }
    });
    Predmet.hasMany(Aktivnost);

    //Aktivnost N-0 Grupa
    Aktivnost.belongsTo(Grupa);
    Grupa.hasMany(Aktivnost);

    //Aktivnost N-1 Dan
    Aktivnost.belongsTo(Dan, {
        foreignKey: {
            allowNull: false
        }
    });
    Dan.hasMany(Aktivnost);

    //Aktivnost N-1 Tip
    Aktivnost.belongsTo(Tip, {
        foreignKey: {
            allowNull: false
        }
    });
    Tip.hasMany(Aktivnost);

    //Student N-M Grupa
    Student.belongsToMany(Grupa, { through: 'StudentGrupa' });
    Grupa.belongsToMany(Student, { through: 'StudentGrupa' });

    return {
        Predmet,
        Grupa,
        Aktivnost,
        Dan,
        Tip,
        Student
    }
}