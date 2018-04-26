module.exports = {
		'domain'         : 'http://localhost:8080',
		'allowedOrigins' : ['http://localhost:8080'],
		
		//'domain'         : 'https://www.soad.social',
		//'allowedOrigins' : ['http://www.soad.social', 'https://www.soad.social', 'http://soad.social', 'https://soad.social', 'www.soad.social', 'soad.social'],

		'username_regex' : /^[a-zA-Z0-9/\.\-\_]{2,30}$/, // rule for username
};
