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


exports.loginAccess = async (req, res) => {

}

exports.loginOTP = async (req, res) => {
    const { phone } = req.body;
    const otp = randomstring.generate({length: 4,charset: 'numeric'});

    var config = {
        method: 'get',
        url: 'https://api.callmebot.com/whatsapp.php?phone=+'+ phone +'&text='+otp+'+is+your+NyuciMobil+OTP&apikey='+process.env.CHATBOTAPI,
        headers: { 'Content-Type': 'application/json' },
        // data: data
    };

    try {
        const sendOtp = await axios(config);
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
                // otp: otp,
                createdAt: { [sequelize.Op.gte]: sequelize.literal("NOW() - (INTERVAL '840 SECOND')")}
            },
        });
        // console.log(otpFind)
        if(otpFind.length < 1) {
            res.status(200).send({
                code: 200,
                success: false,
                message: 'Kode OTP Anda Salah atau expired, silahkan ulangi kembali.',
                data: {
                    status: 0,
                    token: ''
                }
            });
            return;
        } else {
            console.log(phone.substring(1))
            const userFind = await db.users.findAll({
                where: { phone: phone.substring(1) }
            });
            console.log(userFind)
            if(userFind.length < 1){
                res.status(200).send({
                    code: 200,
                    success: false,
                    message: 'Nomor Anda belum terdaftar.',
                    data: {
                        status: 1,
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
                data: dataUser[0]
            });
            return;            
        }
        
    } catch (err) {
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
            where: { phone: phone.substring(1) }
        });
        // console.log(userFind.length)
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
            phone: phone.substring(1),
            name: name,
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