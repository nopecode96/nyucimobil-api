const { where } = require("sequelize");
const db = require("../../models/index.model");
const { sortBy } = require("async");

exports.detail = async (req, res) => {
    const { orderno } = req.query;

    const getData = db.transaction.findAll({
        where: {order_no: orderno}
    })

    res.status(200).send({
        code: 200,
        success: false,
        message: 'Data berhasil ditampilkan',
        data: getData[0]
    });
    return;
}