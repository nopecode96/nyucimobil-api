const { where } = require("sequelize");
const db = require("../../models/index.model");
const { sortBy } = require("async");

exports.category = async (req, res) => {

    try {
        const getDataCategory = await db.productCategory.findAll({
            where: {published: true},
            order: [
                [['id', 'ASC']],
            ],
        });
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
                model: db.product,
            },
            order: [[
                {model: db.product }, 
                'id', 'ASC'
            ]]    
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

exports.productDetail = async (req, res) => {
    const { productID } = req.query;

    try {
        const getDetailProduct = await db.product.findAll({
            where: {id: productID, published: true},
            include: {
                model: db.productCategory,
            },
        });
        console.log(getDetailProduct[0]);

        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data berhasil ditampilkan.',
            data: getDetailProduct[0]
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