var mongoose      = require('mongoose');
var bcrypt        = require('bcrypt-nodejs');

// define the schema for our product model
var productSchema = mongoose.Schema({

    is_active: {
        type: Boolean,
        required: true,
        default: true, 
    },
    p_code: {
        type: String,
    },
    barcode: {
        type: String,   
    },
    p_name: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
    },
    images: {
        thumbnail: String,
        medium: String,
        larger: String,
        original: String,
    },
    stock: {
        is_active: {
            type: Boolean,
            required: true,
            default: false, 
        },
        unti_count: {
            type: Number,
        },
        warning: {
            min: Number,
            max: Number,
        },
    },
    prices: [{
        option: String,
        cost: Number,
        price: Number,
        sku: String,
    }],
    modifiers: [{
        modifier_id: Object,
    }],
    taxes: [{
        tax_id: Object,
    }],
    cat_id: {
        type: Object,
    },
    shop_id: {
        type: Object,
        required: true,
    }
});

// create the model for products and expose it to our app
module.exports = mongoose.model('product', productSchema);









