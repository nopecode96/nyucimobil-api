const db = require("../models/index.model");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const randomstring = require('randomstring');
// var functions = require("../../config/function");
const async = require('async')
const sequelize = require('sequelize');
var passwordHash = require('password-hash');
const { uuid } = require('uuid');
const axios = require("axios");
dotenv.config();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
let jwtSecretKey = process.env.JWT_SECRET_KEY;
const qs = require('qs');


exports.loginAccess = async (req, res) => {

}

exports.loginOTP = async (req, res) => {
    const { phone } = req.body;
    const otp = randomstring.generate({length: 4,charset: 'numeric'});

    var config = {
        method: 'POST',
        // url: 'https://api.callmebot.com/whatsapp.php?phone=+'+ phone +'&text='+otp+'+is+your+NyuciMobil+OTP&apikey='+process.env.CHATBOTAPI,
        url: process.env.FONNTE_URL,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': process.env.FONNTE_TOKEN },
        data: qs.stringify({
            'target': phone,
            'message': otp + ' adalah kode OTP Anda untuk login pada Aplikasi CarKlin.id. Mohon untuk tidak membagikan kode OTP Anda kepada orang lain.'
        })
    };

    try {
        const sendOtp = await axios(config);
        console.log(sendOtp);
        if(sendOtp['status'] === false) {
            res.status(200).send({
                code: 200,
                success: false,
                message: sendOtp['detail']
            });
            return;
        }
        const otpSave = await db.otp.create({
            phone: phone.trim(),
            otp: otp
        });
        if(otpSave){
            res.status(200).send({
                code: 200,
                success: true,
                message: 'OTP sudah dikirim, silahkan check Whatsapp Anda.'
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

exports.loginOtpVerify = async (req, res) => {
    const { phone, otp } = req.body;
    // console.log(phone)

    try {
        const otpFind = await db.otp.findAll({
            where: { 
                phone: phone, 
                otp: otp,
                createdAt: { [sequelize.Op.gte]: sequelize.literal("NOW() - (INTERVAL '840 SECOND')")}
            },
        });
        // console.log(otpFind)
        if(otpFind.length < 1) {
            res.status(200).send({
                code: 200,
                success: false,
                message: 'Kode OTP Anda Salah atau expired, silahkan ulangi kembali.',
                status: 0,
                data: {
                    token: ''
                }
            });
            return;
        } else {
            console.log('mulai')
            console.log(phone)
            const userFind = await db.users.findAll({
                where: { phone: phone }
            });
            console.log(userFind)
            if(userFind.length < 1){
                res.status(200).send({
                    code: 200,
                    success: true,
                    message: 'Nomor Anda belum terdaftar.',
                    status: 1,
                    data: {
                        token: ''
                    }
                    
                });
                return;
            } 

            // console.log(userFind)
            let uid = userFind[0].uid;
            let dataToken = {
                userId: uid,
                date: Date()
            }

            if(!jwtSecretKey){
                res.status(200).send({
                    code: 200,
                    success: false,
                    message: 'jwtSecretKey tidak valid',
                    status: 0,
                    data: {
                        token: ''
                    }
                });
                return;
            }

            const token = jwt.sign(dataToken, jwtSecretKey);
            const update = {
                token: token,
                last_login: Date()
            }
            const dataUpdate = await db.users.update(update, { where: { uid: uid } })

            const dataUser = await db.users.findAll({where: {uid: uid}})

            res.status(200).send({
                code: 200,
                success: true,
                message: 'Login Berhasil!',
                status: 2,
                data: dataUser[0]
            });
            return;            
        }
        
    } catch (err) {
        res.status(400).send({
            code: 400,
            success: false,
            message: err.message,
            status: 0,
            data: {
                token: ''
            }
        });
        return;
    }
}

exports.register = async (req, res) => {
    const { phone, name, fid_user_type } = req.body;

    if (!phone || !name) {
        res.status(200).send({
            code: 200,
            success: false,
            message: "Error Insert: Field.",
            field: {
                name: name,
                phone: phone,
            },
            data: {
                token: ''
            }
        });
        return;
    }

    try{
        // var hashedPassword = passwordHash.generate(passcode);
        let initialPoint = 0;

        const findPointNewMember = await db.mstPoint.findAll({where: {id: 1, published: true }});
        
        if(findPointNewMember.length > 0){
            initialPoint = findPointNewMember[0].value;
        }

        const userFind = await db.users.findAll({
            where: { phone: phone }
        });
        console.log(userFind.length)
        if(userFind.length > 0){
            res.status(200).send({
                code: 200,
                success: false,
                message: 'Nomor Anda sudah terdaftar',
                data: {
                    token: ''
                }
            });
            return;
        }

        const userSave = await db.users.create({
            phone: phone,
            name: name,
            gender: 'Pria',
            point_balance: initialPoint,
            fid_type: 1,
            fid_status: 1
        })
        let uid = userSave.uid;

        const updateUserPointTrx = db.userPoint.create({
            fid_point: 1,
            title: 'New Member',
            desc: 'Point untuk Member Baru',
            value: initialPoint,
            uid: uid,
        })


        let dataToken = {
            userId: uid,
            date: Date()
        }

        if(!jwtSecretKey){
            res.status(200).send({
                code: 200,
                success: false,
                message: 'jwtSecretKey tidak valid'
            });
            return;
        }

        const token = jwt.sign(dataToken, jwtSecretKey);
        const update = {
            token: token,
            last_login: Date()
        }
        const dataUpdate = await db.users.update(update, { where: { uid: uid } })

        const dataUser = await db.users.findAll({
            where: {uid: uid},
            include: {
                model: db.userType
            }
        })

        res.status(200).send({
            code: 200,
            success: true,
            message: 'Registrasi Berhasil!',
            data: dataUser[0]
        });
        return;
          
    } catch (err) {
        console.log(err)
        res.status(400).send({
            code: 400,
            success: false,
            message: err.message,
            data: {
                token: ''
            }
        });
        return;
    }

}

exports.logout = async (req, res) => {
    const uid = req.userid;

    try {
        const logout = await db.users.update({token: ''}, {
            where: { uid: uid }
        });

        res.status(200).send({
            code: 200,
            success: true,
            message: 'Berhasil Keluar Aplikasi!',
            data: {
                token: ''
            }
        });
        return;

    } catch (err) {
        console.log(err)
        res.status(400).send({
            code: 400,
            success: false,
            message: err.message,
            data: {
                token: ''
            }
        });
        return;
    }
    


}