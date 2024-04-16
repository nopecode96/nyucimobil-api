

exports.otpSend = async (req, res, next) => {
    const { phone } = req.query;
    const otp = randomstring.generate({length: 4,charset: 'numeric'});

    var config = {
        method: 'get',
        url: 'https://api.callmebot.com/whatsapp.php?phone=+'+ phone +'&text='+otp+'+is+your+PasarOnline+OTP&apikey='+process.env.CHATBOTAPI,
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