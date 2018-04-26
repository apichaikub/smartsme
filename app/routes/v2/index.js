const express = require('express');
const router = express.Router();

router.get('/test', function(req, res){
	res.send("It's work for v.2");
});

module.exports = router;