var mongoose      = require('mongoose');
var bcrypt        = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,     
    },
    pin: {
        type: Number, 
    },
    info: {
        first_name: String,
        last_name: String,
        gender: String,
        birthdate: Date,
    },
    joined_at: {
        type: Date,
        required: true,     
    },
    confirm_email: {
        type: Boolean,
        required: true,   
        default: false,  
    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);









