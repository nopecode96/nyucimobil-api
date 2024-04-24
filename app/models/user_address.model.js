module.exports = (sequelize, Sequelize) => {
    const UserAddess = sequelize.define('user_address', {
        title: Sequelize.STRING,
        lat: Sequelize.STRING,
        lng: Sequelize.STRING,
        jalan: Sequelize.STRING,
        kecamatan: Sequelize.STRING,
        kota: Sequelize.STRING,
        provinsi: Sequelize.STRING,
        default: Sequelize.BOOLEAN,
        alamat_map: Sequelize.TEXT,
        negara: Sequelize.STRING,
        kelurahan: Sequelize.STRING,
        detail: Sequelize.TEXT
    });
    return UserAddess;
};