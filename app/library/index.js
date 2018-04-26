module.exports = {
	// check api key and user device
	middleware: function (req, res, next) {
	    var key = 'WtsXVOAg10qZFcGJlo6T';

	    // check api key
	    if(req.body.api_key == key || req.query.api_key == key) {
	        // check user agent, we alllow request from device only
	        // req.get('User-Agent')
	        if(1) {
	            return next();
	        }
	    }
	    
	    res.status(409).send({
	        status_message: 'if you can hack our service api. welcome to join with us :) \n Contact apichai.freedom@gmail.com',
	        error: "your api key is not supported",
	    });
	},

	isInt: function(value){
	  if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
	    return true;
	  } else {
	      return false;
	  }
	},

	parseBoolean: function (boolean) {
	    return (boolean === 'true');
	}
}









