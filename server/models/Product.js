const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectID,
        ref: 'User'
    },
    title : {
        type: String,
        maxLength: 50
    },
    description : {
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
    price: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        maxLength: 100,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

productSchema.index({
    title: 'text',
    description: 'text'
}, {
    weight: {
        title: 5,
        description: 3
    }
});

const Product = mongoose.model('Recipe', productSchema);

module.exports = { product };