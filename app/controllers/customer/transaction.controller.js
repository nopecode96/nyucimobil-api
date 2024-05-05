const { Sequelize, Op } = require('sequelize');
const db = require("../../models/index.model");
const randomstring = require('randomstring');
const qs = require('qs');
const dotenv = require('dotenv');
const axios = require("axios");
dotenv.config();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

exports.submitTransaction = async (req, res) => {
    const uid = req.userid;

    const { product_name, price, discount_percent, discount, totalpay, promocode, jalan, kecamatan, kota, provinsi, kodepos, latitude, longitude, alamat_map, payment_method, fid_product, fid_voucher } = req.body;

    if(!jalan){
        res.status(200).send({
            code: 200,
            success: false,
            message: 'Anda belum menentukan alamat, silahkan pilih Alamat Anda terlebih dahulu.',
        });
        return;
    }

    const orderNo = randomstring.generate(10);
    console.log('1');
    console.log(req.body);

    try {
        const save = await db.transaction.create({
            order_no: orderNo.toUpperCase(),
            product_name : product_name,
            qty : '1', 
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
            status_transaksi : 'MENUNGGU PEMBAYARAN', //MENUNGGU PEMBAYARAN | BATAL | MENEMUKAN MITRA | DALAM PERJALANAN | SELESAI
            fid_product : fid_product,
            uid: uid
        });
        console.log('2');

        const customer = await db.users.findAll({
            where: {uid: save.uid}
        });
        console.log('3');

        const date = Date(save.createdAt);

        const ms1 = 'Order Masuk dari CARKLIN\n'+date+'\n\n';
        const ms2 = 'Order No. : '+ save.order_no + '\n';
        const ms3 = 'Layanan : '+ save.product_name + '\n';
        // const ms4 = 'Harga : '+ save.price + '\n';
        // const ms5 = 'Potongan Harga : '+ save.discount + '\n';
        // const ms6 = 'Total Pembayaran : '+ save.totalpay + '\n\n';
        const ms7 = 'Status : '+ save.status_transaksi + '\n\n';
        const ms8 = 'Nama Pelanggan : '+ customer[0]['name'] + '\n';
        const ms9 = 'Nomor Whatsapp : '+ customer[0]['phone'] + '\n';
        const ms10 = 'Alamat :\n';
        const ms11 = save.jalan + ', ' + save.kecamatan + ', ' + save.kota + ', ' + save.provinsi + '\n';
        const ms12 = 'https://www.google.com/maps/@'+save.latitude+','+save.longitude+',18.81z?entry=ttu\n';

        var config = {
            method: 'POST',
            url: process.env.FONNTE_URL,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': process.env.FONNTE_TOKEN },
            data: qs.stringify({
                'target': process.env.OP_WA,
                'message': ms1+ms2+ms3+ms7+ms8+ms9+ms10+ms11+ms12,
            })
        };

        console.log('4');

        try {
            const sendNotif = await axios(config);
            console.log('5');

            // console.log(sendNotif);
            if(sendNotif['status']) {
                res.status(200).send({
                    code: 200,
                    success: true,
                    message: 'Data transaksi berhasil disimpan',
                    message_notif: sendNotif['detail'],
                    data: save
                });
                return;
            }else{
                console.log('10');

                res.status(200).send({
                    code: 200,
                    success: false,
                    message: 'Data gagal mengirim pesan',
                    message_notif: sendNotif['detail'],
                    data: save
                });
                return;
            }
            
        } catch (err) {
            console.log('11');

            res.status(400).send({
                code: 400,
                success: false,
                message: err.message,
            });
            return;
        }

    } catch (err) {
        console.log('12');
        console.log(err)

        res.status(400).send({
            code: 400,
            success: false,
            message: err.message,
        });
        return;
    }

}

exports.getOrderOneTime = async (req, res) => {
    const uid = req.userid;
    const { status } = req.query;

    try {
        var allData = await db.transaction.findAll({
            // where: {uid : uid, status_transaksi : { [Op.ne]: 'SELESAI' }},
            where: {uid : uid, status_transaksi : status },
            include: {
                model: db.product,
                attributes: ['title'],
                include: {
                    model: db.productCategory,
                    where: {id: 1},
                    attributes: ['id','title'],
                }
            },
            order: [
                [['id', 'DESC']],
            ],
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

exports.getSubscribe = async (req, res) => {
    const uid = req.userid;
    const { status } = req.query;

    try {
        var allData = await db.transaction.findAll({
            // where: {uid : uid, status_transaksi : 'SELESAI' },
            where: {uid : uid, status_transaksi : status },
            include: {
                model: db.product,
                attributes: ['title'],
                include: {
                    model: db.productCategory,
                    where: {id: 2},
                    attributes: ['2','title'],
                }
            },
            order: [
                [['id', 'DESC']],
            ],
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

