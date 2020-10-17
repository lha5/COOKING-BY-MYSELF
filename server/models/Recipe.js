const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectID,
        ref: 'User'
    },
    title : {
        type: String,
        maxLength: 100
    },
    content : {
        type: String
    },
    category: {
        type: Number,
        default: 1
    },
    images: {
        type: Array,
        default: []
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

recipeSchema.index({
    title: 'text',
    content: 'text'
}, {
    weight: {
        title: 5,
        content: 3
    }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = { Recipe };