module.exports = (sequelize, Sequelize) => {
    const MstPoint = sequelize.define('mst_point', {
        title: Sequelize.STRING,
        desc: Sequelize.TEXT,
        value: Sequelize.STRING,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        published: Sequelize.BOOLEAN,
    });
    return MstPoint;
};