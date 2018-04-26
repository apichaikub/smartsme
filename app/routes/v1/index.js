var express = require('express');
var router = express.Router();

// mongoose mongodb
var mongoose = require('mongoose');
// utility module which provides straight-forward
var async = require('async'); 
// a simple yet powerful JSON schema validator 
var validate = require('validate-fields')();
// general config
var config = require('../../../config/general');
// Native JS implementation of BCrypt for Node
var bcrypt = require('bcrypt-nodejs');

var ObjectId = mongoose.Types.ObjectId;


// ===== load models =====
var User = require('../../../app/models/user');
var Shop = require('../../../app/models/shop');
var Product = require('../../../app/models/product');

// ===== libs functions =====
var lib = require('../../../app/library');

// allow origin domains
router.use(function(req, res, next) {
    var origin = req.headers.origin;
    if(config.allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
    }
    return next();
});

// Test page
router.get('/test', lib.middleware, function(req, res) {

    User.find({}, function(err, user){
        console.log(user);
    });

    res.send("It's work v.1");
});

// login local
router.post('/login-local', lib.middleware, function(req, res) {

    var email = req.body.email;
    var password = req.body.password;

    var schema = {
        email : 'email',
        password : 'string(6,)'
    }, value = {
        email : email,
        password : password
    }

    if (!validate(schema, value)) {
        var errMsg = validate.lastError;
        res.status(422).send({
            status_code: res.statusCode,
            status_message: 'Unprocessable Entity (Missing Parameters) ' + errMsg,
        });
        return;
    }

    User.findOne({'email': email}, function(err, user){
        if(err) {
            res.status(500).send({
                status_code: res.statusCode,
                status_message: 'Internal Server Error',
                error: err,
            });
            return;
        }

        if(!user) {
            res.status(401).send({
                status_code: res.statusCode,
                status_message: 'Email not found',
                auth: false,
            });
            return;
        }

        // check password
        var passwordIsValid = bcrypt.compareSync(password, user.password);
        if(!passwordIsValid) {
            res.status(401).send({
                status_code: res.statusCode,
                status_message: 'Password is invalid.',
                auth: false,
            });
            return;
        }

        res.send({
            status_code: res.statusCode,
            status_message: 'OK',
            auth: true,
        });
    });
});

// register local
router.post('/register-local', lib.middleware, function(req, res) {

    var email = req.body.email;
    var password = req.body.password;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var shop_name = req.body.shop_name;
    var cat_id = parseInt(req.body.cat_id);

    var schema = {
        email : 'email',
        password : 'string(6,)',
        first_name : String,
        last_name : String,
        shop_name : String,
        cat_id : Number,
    }, value = {
        email : email,
        password : password,
        first_name : first_name,
        last_name : last_name,
        shop_name : shop_name,
        cat_id : cat_id,
    }
             
    if (!validate(schema, value)) {
        var errMsg = validate.lastError;
        res.status(422).send({
            status_code: res.statusCode,
            status_message: 'Unprocessable Entity (Missing Parameters) ' + errMsg,
        });
        return;
    }

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to register already exists
    User.findOne({ 'email' :  email }, function(err, user) {
        if(err) {
            res.status(500).send({
                status_code: res.statusCode,
                status_message: 'Internal Server Error',
                error: err,
            });
            return;
        }

        // check to see if theres already a user with that email
        if (user) {
            res.status(409).send({
                status_code: res.statusCode,
                status_message: 'Conflict (This email is already taken)',
            });
            return;
        }

        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.generateHash(password);
        newUser.info.first_name = first_name;
        newUser.info.last_name = last_name;
        newUser.confirm_email = false;
        newUser.joined_at = Date.now();

        // insert new user
        newUser.save(function(err) {
            if(err) {
                res.status(500).send({
                    status_code: res.statusCode,
                    status_message: 'Internal Server Error',
                    error: err,
                });
                return;
            }

            var newShop = new Shop();
            newShop.shop_name = shop_name;
            newShop.cat_id = cat_id;
            newShop.user_id = newUser._id;
            newShop.created_at = Date.now();

            // insert new shop
            newShop.save(function(err) {
                if(err) {
                    res.status(500).send({
                        status_code: res.statusCode,
                        status_message: 'Internal Server Error',
                        error: err,
                    });
                    return;
                }

                res.send({
                    status_code: res.statusCode,
                    data: {
                        user: newUser,
                        shop: newShop
                    }
                }); 
            });
        });
    });
});

// new product
router.post('/product/new', function(req, res){
    var is_active = req.body.is_active;
    var p_code = req.body.p_code;
    var barcode = req.body.barcode;
	var p_name = req.body.p_name;
	var unit  = req.body.unit;
	var jsonImage = req.body.jsonImage;
    var jsonStock = req.body.jsonStock;
	var jsonPrices = req.body.jsonPrices;
	var jsonModifiers = req.body.jsonModifiers;
	var jsonTaxes = req.body.jsonTaxes;
	var cat_name = req.body.cat_name;
	var shop_id = req.body.shop_id;

	var schema = {
        p_name : String,
        shop_id : String
    }, value = {
        p_name : p_name,
        shop_id : shop_id
    }
    
    if (!validate(schema, value)) {
        var errMsg = validate.lastError;
        res.status(422).send({
            status_code: res.statusCode,
            status_message: 'Unprocessable Entity (Missing Parameters) ' + errMsg,
        });
        return;
    }

    var newProduct = new Product();

    newProduct.p_name = p_name;
    newProduct.shop_id = new ObjectId(shop_id);

    if(barcode) newProduct.barcode = barcode;

    // insert product
    newProduct.save(function(err){
    	if(err) {
            res.status(500).send({
                status_code: res.statusCode,
                status_message: 'Internal Server Error',
                error: err,
            });
            return;
        }

        res.send({
            status_code: res.statusCode,
            status_message: 'OK',
            data: newProduct,
        });
    });
});

// edit product
router.put('/product/edit', function(req, res){
	
});

module.exports = router;





