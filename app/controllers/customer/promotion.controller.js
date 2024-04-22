const { where } = require("sequelize");
const { Sequelize, Op } = require('sequelize');
const db = require("../../models/index.model");

exports.promotion = async (req, res) => {
    const datenow = new Date(Date.now());
    try {
        const getDataVoucher = await db.mstVoucher.findAll({
            where: {
                published: true, 
                start_date: { [Op.lte]: datenow },
                end_date: { [Op.gte]: datenow },
            }, 
            attributes: ['id', 'title', 'image', 'start_date', 'end_date', 'usage', 'published'],
            order: [
                ['id', 'DESC'],
            ],
        });
        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data berhasil ditampilkan.',
            data: getDataVoucher
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

exports.detail = async (req, res) => {
    const datenow = new Date(Date.now());
    const { id } = req.query;
    try {
        const getDataVoucherDetail = await db.mstVoucher.findAll({
            where: {
                id: id, 
                start_date: { [Op.lte]: datenow },
                end_date: { [Op.gte]: datenow },
            },
        });

        if(getDataVoucherDetail.length === 0){
            res.status(200).send({
                code: 200,
                success: true,
                message: 'Data tidak berhasil ditampilkan.',
                // data: getDataVoucher
            });
            return;
        }
        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data berhasil ditampilkan.',
            data: getDataVoucherDetail[0]
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