var mongoose      = require('mongoose');
var bcrypt        = require('bcrypt-nodejs');

// define the schema for our shop model
var shopSchema = mongoose.Schema({

    shop_name: {
        type: String,
        required: true,    
    },
    address: {
        type: String,
    },
    tel: {
        type: String,  
    },
    lat: {
        type: Number,  
    },
    long: {
        type: Number,
    },
    created_at: {
        type: Date,
    },
    cat_id: {
        type: Object,    
    },
    user_id: {
        type: Object,
        required: true,     
    }
});

// create the model for shops and expose it to our app
module.exports = mongoose.model('shop', shopSchema);









