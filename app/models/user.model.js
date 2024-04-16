module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        uid: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
        },
        fid_type: Sequelize.INTEGER,
        email: {
            allowNull: true,
            autoIncrement: false,
            unique: true,
            type: Sequelize.STRING,
        },
        phone: {
            allowNull: false,
            autoIncrement: false,
            unique: true,
            type: Sequelize.STRING,
        },
        passcode: Sequelize.STRING,
        name: Sequelize.STRING,
        birthday: Sequelize.DATE,
        gender: Sequelize.STRING,
        token: Sequelize.TEXT,
        referral_code: Sequelize.TEXT,
        point_balance: Sequelize.DOUBLE,
        last_login: Sequelize.DATE,
        fid_status: Sequelize.INTEGER,
        photo: Sequelize.STRING
    });
    return User;
};