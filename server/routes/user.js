const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { auth } = require('../middleware/auth');

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
        provider: req.user.provider
    });
});

router.post('/checkEmail', (req, res) => {
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
        'provider': 1
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