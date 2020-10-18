const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { auth } = require('../middleware/auth');
const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');

// for verify email
let sendEmail = (emailTo) => {
    let transporter = nodemailer.createTransport(
        {
            host: 'smtp.naver.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.NODEMAILER_AUTH_USER,
                pass: process.env.NODEMAILER_AUTH_PASS
            }
        }
    );

    let message = {
        to: emailTo,
        subject: '[CBM] 가입 인증을 완료해주세요.' + Date.now(),
        text: 'test',
        html: '<p>이메일 가입 인증 테스트</p>'
    };

    // verify connection configuration
    transporter.verify((error, success) => {
        if (error) {
            console.log('[Nodemailer] cannot verified')
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });

    transporter.sendMail(message, (error, info) => {
        if (error) {
            console.log('[Nodemailer] error occurred');
            console.log(error.message);
            return process.exit(1);
        }
        console.log('[Nodemailer] Message sent successfully');
        console.log(nodemailer.getTestMessageUrl(info));
    });
};

// -------------------------
//          User
// -------------------------

router.get('/auth', auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image,
        provider: req.user.provider,
        verified: req.user.verified
    });
});

router.post('/checkEmailDup', (req, res) => {
    User.findOne({'email': req.body.email})
        .exec((err, usingEmail) => {
            if (err) {
                return res.status(400).send(err);
            }

            if (usingEmail !== null) {
                res.status(200).json({success: false});
            } else {
                res.status(200).json({success: true});
            }
        });
});

router.post('/signup', (req, res) => {
    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) {
            return res.json({success: false, err});
        }
        // sendEmail(req.body.email);
        return res.status(200).json({
            success: true
        });
    });
});

router.post('/signin', (req, res) => {
    User.findOne({'email': req.body.email}, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: 'Auth failed, email is not founded.'
            });
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: 'Wrong password'
                });
            }
            sendEmail(req.body.email);
            user.generateToken((err, user) => {
                if (err) {
                    return res.status(400).send(err);
                }

                res.cookie('w_authExp', user.tokenExp, {httpOnly: true});
                res
                    .cookie('w_auth', user.token, {httpOnly: true})
                    .status(200)
                    .json({
                        loginSuccess: true,
                        userId: user._id
                    });
            });
        });
    });
});

router.get('/logout', auth, (req, res) => {
    User.findOneAndUpdate({'_id': req.user._id}, {token: "", tokenExp: 0}, (err, doc) => {
        if (err) {
            return res.json({success: false, err});
        }
        res.clearCookie('w_authExp');
        return res.clearCookie('w_auth').status(200).send({
            success: true
        });
    });
});

router.post('/kakao', (req, res) => {
    const userInfo = {
        'email': req.body.kakaoUser.current.kakao_account.email,
        'name': req.body.kakaoUser.current.properties.nickname,
        'provider': 1,
        'authChecked': true
    };
    User.findOne({ 'email' : userInfo.email }, (err, user) => {
        if (!user) {
            const newUser = new User(userInfo);
            newUser.save((err, doc) => {
                if (err) {
                    return res.json({success: false, err});
                }
                doc.generateToken((err, kUser) => {
                    if (err) {
                        return res.status(400).send(err);
                    }

                    res
                        .status(200)
                        .json({
                            loginSuccess: true,
                            userId: kUser._id,
                            w_auth: kUser.token,
                            w_authExp: kUser.tokenExp
                        });
                });
            });
        }
        user.generateToken((err, kUser) => {
            if (err) {
                return res.status(400).send(err);
            }

            res
                .status(200)
                .send({
                    loginSuccess: true,
                    userId: kUser._id,
                    w_auth: kUser.token,
                    w_authExp: kUser.tokenExp
                });
        });
    });
});

module.exports = router;