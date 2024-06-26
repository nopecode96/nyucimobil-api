const { where } = require("sequelize");
const db = require("../../models/index.model");
const Op = require('sequelize').Op;
const sequelize = require('sequelize');


exports.profileDetail = async (req, res) => {
    const uid = req.userid;
    console.log(uid);

    try {
        const getdata = await db.users.findAll({
            where: {uid: uid},
            attributes: ['uid', 'name', 'email', 'phone', 'birthday', 'gender', ],
            include: [
                { model: db.userStatus, attributes: ['id', 'title'] },
                { model: db.userType, attributes: ['id', 'title'] }
            ]
        });
        // console.log(getdata);


        if(getdata.length == 0){
            res.status(200).send({
                code: 200,
                success: false,
                message: 'Data tidak berhasil ditampilkan.',
                // data: getdata[0]
            });
            return;
        }

        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data berhasil ditampilkan.',
            data: getdata[0]
        });
        return;

    } catch(err) {
        res.status(400).send({
            code: 400,
            success: false,
            message: err.message
        });
        return;
    }
}

exports.profileUpdate = async (req, res) => {
    const uid = req.userid;
    const { email, name, gender, birthday } = req.body;

    const updateData = {
        email: email,
        name: name,
        gender: gender,
        birthday: birthday,
    }

    try {
        const update = await db.users.update(updateData, {where: {uid: uid}})

        const getdata = await db.users.findAll({
            where: {uid: uid},
            attributes: ['uid', 'name', 'email', 'phone', 'birthday', 'gender', ],
            include: [
                { model: db.userStatus, attributes: ['id', 'title'] },
                { model: db.userType, attributes: ['id', 'title'] }
            ]
        });

        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data berhasil diubah.',
            data: getdata[0]
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


exports.photoUpdate = async (req, res) => {
    const uid = req.userid;
    if(!req.file){
        res.status(500).send({
            code: 500,
            success: false,
            message: "Photo tidak sesuai, silahkan ulang kembali"
        });
        return;
    }
    const fileName = req.file.filename;
    try {
        const photoUpdate = await db.users.update({photo: fileName}, {where: {uid: uid}});
        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data berhasil diubah.',
            data: {
                photo: fileName
            }
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

//============Address===============
//============Address===============
//============Address===============

exports.addresses = async (req, res) => {
    const uid = req.userid;

    try {
        const getDataAddress = await db.userAddress.findAll({
            where : {uid: uid},
            order: [['id', 'DESC']]
        })

        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data berhasil ditampilkan.',
            data: getDataAddress
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

exports.addressSave = async (req, res) => {
    const uid = req.userid;
    const { title, lat, lng, jalan, kelurahan, kecamatan, kota, provinsi, negara, detail, kodepos, alamat_map, def } = req.body;

    if(!lat || !lng){
        res.status(400).send({
            code: 400,
            success: false,
            message:'Parameter lokasi salah',
            params: {
                lat: lat,
                lng: lng
            }
        });
        return;
    }

    try {
        if(def == 'true'){
            const dataResetDefault = {
                default: 'false'
            }
            const defaultReset = await db.userAddress.update(dataResetDefault, {where : { uid: uid }});
    
            const dataSave = {
                title: title, 
                lat: lat, 
                lng: lng, 
                jalan: jalan, 
                kelurahan: kelurahan, 
                kecamatan: kecamatan, 
                kota: kota, 
                provinsi: provinsi, 
                negara: negara, 
                kodepos: kodepos, 
                alamat_map: alamat_map, 
                detail: detail, 
                default: 'true', 
                uid: uid
            }
            const addressSave = await db.userAddress.create(dataSave);
            res.status(200).send({
                code: 200,
                success: true,
                message: 'Data berhasil disimpan.',
                data: {
                    id: addressSave.id
                }
            });
            return;
        } else {
            const dataSave = {
                title: title, lat: lat, lng: lng, address: address, distric: distric, city: city, province: province, default: 'false', uid: uid
            }
            const addressSave = await db.userAddress.create(dataSave);
            res.status(200).send({
                code: 200,
                success: true,
                message: 'Data berhasil disimpan.',
                data: {
                    id: addressSave.id
                }
            });
            return;
        }
        

    } catch (err) {
        res.status(400).send({
            code: 400,
            success: false,
            message: err.message
        });
        return;
    }
}

exports.addressUpdate = async (req, res) => {
    const uid = req.userid;
    const { title, lat, lng, jalan, kelurahan, kecamatan, kota, provinsi, negara, detail, kodepos, alamat_map, def,id } = req.body;

    if(!lat || !lng){
        res.status(400).send({
            code: 400,
            success: false,
            message:'Parameter lokasi salah'
        });
        return;
    }

    try {
        if(def == 'true'){
            const dataResetDefault = {
                default: 'false'
            }
            const defaultReset = await db.userAddress.update(dataResetDefault, {where : { uid: uid }});

            const dataUpdate = {
                title: title, lat: lat, lng: lng, jalan: jalan, kelurahan: kelurahan, kecamatan: kecamatan, kota: kota, provinsi: provinsi, negara: negara, detail: detail, kodepos: kodepos,alamat_map: alamat_map, default: 'true'
            }
            const addressUpdate = await db.userAddress.update(dataUpdate, {where : { id: id, uid: uid }});
            res.status(200).send({
                code: 200,
                success: true,
                message: 'Data berhasil diubah.'
            });
            return;
        }else{
            const dataUpdate = {
                title: title, lat: lat, lng: lng, jalan: jalan, kelurahan: kelurahan, kecamatan: kecamatan, kota: kota, provinsi: provinsi, negara: negara, detail: detail, kodepos: kodepos,alamat_map: alamat_map, default: 'true'
            }
            const addressUpdate = await db.userAddress.update(dataUpdate, {where : { id: id, uid: uid }});
            res.status(200).send({
                code: 200,
                success: true,
                message: 'Data berhasil diubah.'
            });
            return;
        }
    } catch (err) {
        res.status(400).send({
            code: 400,
            success: false,
            message: err.message
        });
        return;
    }
}

exports.addressDelete = async (req, res) => {
    const uid = req.userid;
    const {id} = req.query;

    try {
        const addressDelete = await db.userAddress.destroy({ where: { id: id, uid: uid }});
        if(addressDelete == 0){
            res.status(200).send({
                code: 200,
                success: false,
                message: 'Data id record salah.'
            });
            return;
        }
        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data berhasil dihapus.'
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

//============Car==============
//============Car==============
//============Car==============

exports.cars = async (req, res) => {
    const uid = req.userid;

    try {
        const getDataCars = await db.userCar.findAll({
            where : {uid: uid}
        })

        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data berhasil ditampilkan.',
            data: getDataCars
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

exports.carSave = async (req, res) => {
    const uid = req.userid;
    const { category, brand, model, type, plat_no } = req.body;

    if(!category || !brand || !model || !type){
        res.status(400).send({
            code: 400,
            success: false,
            message:'Parameter tidak lengkap'
        });
        return;
    }

    try {
        const dataSave = {
            category: category,brand: brand, model: model, type: type, plat_no: plat_no, uid: uid
        }
        const carSave = await db.userCar.create(dataSave);
        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data berhasil disimpan.'
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

exports.carUpdate = async (req, res) => {
    const uid = req.userid;
    const { category, brand, model, type, plat_no, id } = req.body;

    if(!brand || !type){
        res.status(400).send({
            code: 400,
            success: false,
            message:'Parameter tidak lengkap'
        });
        return;
    }

    try {
        
        const dataUpdate = {
            category: category,brand: brand, model: model, type: type, plat_no: plat_no
        }
        const addressUpdate = await db.userCar.update(dataUpdate, {where : { id: id, uid: uid }});
        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data berhasil diubah.'
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

exports.carDelete = async (req, res) => {
    const uid = req.userid;
    const {id} = req.query;

    try {
        const carDelete = await db.userCar.destroy({ where: { id: id, uid: uid }});
        if(carDelete == 0){
            res.status(200).send({
                code: 200,
                success: false,
                message: 'Data id record salah.'
            });
            return;
        }
        res.status(200).send({
            code: 200,
            success: true,
            message: 'Data berhasil dihapus.'
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

//==========Address===========
//==========Address===========
//==========Address===========

exports.getWilayah = async (req, res) => {
    const uid = req.userid;
    const { search } = req.query;
    if(search){
        const lookupValue = search.toLowerCase();
        var condition = { name: sequelize.where(sequelize.fn('LOWER', sequelize.col('reg_districts.name')), 'LIKE', '%' + lookupValue + '%')  }
    } else {
        null
    }
    db.regDistrics.findAll({
        where: condition,
        attributes: ['id', 'name'],
        include: {
            model: db.regRegencies,
            attributes: ['id', 'name'],
            include: {
                model: db.regProvincies,
                attributes: ['id', 'name'],
            }
        }
    }).then(data => {
        if (data) {
            res.send({
                code: 200,
                success: true,
                message: "Data berhasil diambil",
                data: data
            });
            return;
        } else {
            res.status(404).send({
                code: 404,
                success: false,
                message: `Cannot find user with id=${id}.`
            });
            return;
        }
    }).catch(err => {
        res.status(500).send({
            code: 500,
            success: false,
            message: "Error retrieving user with id=" + id
        });
        return;
    });

}