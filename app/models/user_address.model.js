module.exports = (sequelize, Sequelize) => {
    const UserAddess = sequelize.define('user_address', {
        title: Sequelize.STRING,
        lat: Sequelize.STRING,
        lng: Sequelize.STRING,
        jalan: Sequelize.STRING,
        kota: Sequelize.STRING,
        provinsi: Sequelize.STRING,
        kodepos: Sequelize.STRING,
        default: Sequelize.BOOLEAN,
        alamat_map: Sequelize.TEXT,
        detail: Sequelize.TEXT
    });
    return UserAddess;
};