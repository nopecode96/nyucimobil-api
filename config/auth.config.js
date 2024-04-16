const jwt = require('jsonwebtoken');
const db = require("../app/models/index.model");
const user = db.users;

exports.apiKeyValidation = (req, res, next) => {
    let apiKey = req.header('Authorization');
    let ApiKey = process.env.API_KEY;
    // console.log(apiKey);
    // console.log(ApiKey);

    if (!apiKey) {
        res.status(203).send({
            code: 203,
            status: false,
            message: "You don't have API Key Access!"
        });
        return;
    }

    try {
        if (apiKey != ApiKey) {
            res.status(203).send({
            code: 203,
            status: false,
            message: 'Your API KEY not Valid!',
            });
            return;
        }
        next();
    } catch (error) {
        res.status(203).send({
            code: 203,
            status: false,
            message: 'Your API KEY Error!',
            error: error.message,
        });
        return;
    }
}

exports.tokenValidation = (req, res, next) => {
    let authToken = req.header('accessToken');
    console.log(authToken)

    if (!authToken) {
        res.status(203).send({
            code: 203,
            status: false,
            message: "Please insert your Access Token"
        });
        return;
    }

    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        var decrypt = jwt.decode(authToken, jwtSecretKey);
        const verified = jwt.verify(authToken, jwtSecretKey);
        // console.log(verified);
        if (!verified) {
            res.status(203).send({
                code: 203,
                status: false,
                message: 'Your Token not Valid',
            });
            return;
        } else {
            // console.log('verified')
            const uid = decrypt.userId;
            // console.log(uid);
            user.findAll({
                 where: { uid: uid, token: authToken }
            })
            .then(data => {
                // console.log(data)
                if (data.length == 0) {
                    res.status(203).send({
                        code: 203,
                        status: false,
                        message: 'Your account is Expired, Please login again.',
                    });
                    return;
                } else {
                    // console.log('lolos')
                    res.locals.userid = uid;
                    req.userid = uid;
                    next();
                }
            })
        }
    } catch (error) {
        res.status(203).send({
            code: 203,
            status: false,
            message: 'Error Token Validation',
            error: error.message,
        });
        return;
    }
}