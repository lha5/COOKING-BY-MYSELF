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

router.post('/recipes', (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let term = req.body.searchTerm;
    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            findArgs[key] = req.body.filters[key];
        }
    }

    if (term) {
        Recipe
            .find(findArgs)
            .find({ $text: { $search: term }})
            .sort({ updatedAt : -1 })
            .populate('writer')
            .skip(skip)
            .limit(limit)
            .exec((err, recipesInfo) => {
                if (err) {return res.status(400).json({ success: false, err })}
                return res.status(200).json({ success: true, recipesInfo, postSize: recipesInfo.length });
            });
    } else {
        Recipe
            .find(findArgs)
            .sort({ updatedAt : -1 })
            .populate('writer')
            .skip(skip)
            .limit(limit)
            .exec((err, recipesInfo) => {
                if (err) {return res.status(400).json({ success: false, err })}
                return res.status(200).json({ success: true, recipesInfo, postSize: recipesInfo.length });
            });
    }
});

module.exports = router;