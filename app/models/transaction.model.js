module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define('transaction', {
        order_no: Sequelize.STRING,
        product_name: Sequelize.STRING,
        qty: Sequelize.INTEGER,
        price: Sequelize.DOUBLE,
        discount_percent: Sequelize.DOUBLE,
        discount: Sequelize.DOUBLE,
        totalpay: Sequelize.DOUBLE,
        promocode: Sequelize.STRING,
        jalan: Sequelize.STRING,
        kecamatan: Sequelize.STRING,
        kota: Sequelize.STRING,
        provinsi: Sequelize.STRING,
        kodepos: Sequelize.STRING,
        latitude: Sequelize.DOUBLE,
        longitude: Sequelize.DOUBLE,
        alamat_map: Sequelize.TEXT,
        payment_method: Sequelize.STRING,
        status_pembayaran: Sequelize.STRING,
        status_transaksi: Sequelize.STRING,
    });
    return Transaction;
};