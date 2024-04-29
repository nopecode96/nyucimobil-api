const { Sequelize, Op } = require('sequelize');
const db = require("../../models/index.model");
const randomstring = require('randomstring');

exports.submitTransaction = async (req, res) => {
    const uid = req.userid;

    const { product_name, qty, price, discount_percent, discount, totalpay, promocode, jalan, kecamatan, kota, provinsi, kodepos, latitude, longitude, alamat_map, payment_method, fid_product, fid_voucher } = req.body;

    if(!jalan){
        res.status(200).send({
            code: 200,
            success: false,
            message: 'Anda belum menentukan alamat, silahkan pilih Alamat Anda terlebih dahulu.',
        });
        return;
    }

    const orderNo = randomstring.generate(10);

    try {
        const save = await db.transaction.create({
            order_no: orderNo.toUpperCase(),
            product_name : product_name,
            qty : qty, 
            price : price, 
            discount_percent : discount_percent, 
            discount : discount, 
            totalpay :totalpay, 
            promocode:promocode, 
            jalan : jalan, 
            kecamatan : kecamatan, 
            kota : kota, 
            provinsi : provinsi, 
            kodepos : kodepos, 
            latitude : latitude, 
            longitude : longitude, 
            alamat_map: alamat_map, 
            payment_method : payment_method, 
            status_pembayaran : 'MENUNGGU PEMBAYARAN',  //MENUNGGU PEMBAYARAN | BATAL | MENUNGGU KONFORMASI | TELAH DIBAYAR
            status_transaksi : 'TERTUNDA', //TERTUNDA | BATAL | MENEMUKAN MITRA | DALAM PERJALANAN | SELESAI
            fid_product : fid_product, 
            fid_voucher : fid_voucher ,
            uid: uid
        });

        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data transaksi berhasil disimpan',
            data: save
        });
        return;
    } catch (err) {
        res.status(400).send({
            code: 400,
            success: false,
            message: err.message,
        });
        return;
    }

}

exports.getOrders = async (req, res) => {
    const uid = req.userid;

    try {
        var allData = await db.transaction.findAll({
            where: {uid : uid, status_transaksi : { [Op.ne]: 'SELESAI' }},
            include: {
                model: db.product,
                attributes: ['title'],
                include: {
                    model: db.productCategory,
                    attributes: ['title'],
                }
            }
        });

        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data berhasil ditampilkan',
            data: allData
        });
        return;
    } catch (err) {
        res.status(400).send({
            code: 400,
            success: false,
            message: err.message,
        });
        return;
    }
    
}

exports.getHistory = async (req, res) => {
    const uid = req.userid;

    try {
        var allData = await db.transaction.findAll({
            where: {uid : uid, status_transaksi : 'SELESAI' },
            include: {
                model: db.product,
                attributes: ['title'],
                include: {
                    model: db.productCategory,
                    attributes: ['title'],
                }
            }
        });

        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data berhasil ditampilkan',
            data: allData
        });
        return;
    } catch (err) {
        res.status(400).send({
            code: 400,
            success: false,
            message: err.message,
        });
        return;
    }
    
}

exports.getDetail = async (req, res) => {
    const uid = req.userid;
    const {orderNo} = req.query;

    try {
        var getData = await db.transaction.findAll({
            where: {order_no : orderNo, uid : uid},
            include: {
                model: db.product,
                attributes: ['title'],
                include: {
                    model: db.productCategory,
                    attributes: ['title'],
                }
            }
        });

        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data berhasil ditampilkan',
            data: getData[0]
        });
        return;
    } catch (err) {
        res.status(400).send({
            code: 400,
            success: false,
            message: err.message,
        });
        return;
    }
}

