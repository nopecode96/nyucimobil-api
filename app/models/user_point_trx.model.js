module.exports = (sequelize, Sequelize) => {
    const UserPointTrx = sequelize.define('user_point_trx', {
        fid_point: Sequelize.INTEGER,
        title: Sequelize.STRING,
        desc: Sequelize.TEXT,
        value: Sequelize.STRING,
    });
    return UserPointTrx;
};