const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Recipe } = require('../models/Recipe');

// -------------------------
//          Recipe
// -------------------------

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/recipe/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

let upload = multer({ storage: storage }).single('file');

router.post('/image', (req, res) => {
    // 가져온 이미지를 저장한다.
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename });
    });
});

router.post('/upload', (req, res) => {
    const recipe = new Recipe(req.body);
    recipe.save((err) => {
        if (err) {return res.status(400).json({ success: false, err })}
        return res.status(200).json({ success: true });
    });
});

module.exports = router;