const { where } = require("sequelize");
const db = require("../../models/index.model");

exports.category = async (req, res) => {

    try {
        const getDataCategory = await db.productCategory.findAll({where: {published: true}});
        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data berhasil ditampilkan.',
            data: getDataCategory
        });
        return;

    } catch (err) {
        res.status(400).send({
            code: 400,
            success: false,
            message: err.message
        });
        return;
    }
}

exports.productByCategory = async (req, res) => {
    const { catID } = req.query;

    try {
        const getDataProduct = await db.productCategory.findAll({
            where: {id: catID, published: true},
            include: {
                model: db.product
            }
        });
        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data berhasil ditampilkan.',
            data: getDataProduct[0]
        });
        return;

    } catch (err) {
        res.status(400).send({
            code: 400,
            success: false,
            message: err.message
        });
        return;
    }
}