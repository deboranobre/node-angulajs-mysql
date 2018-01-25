var mysql = require('mysql');
var log = require('./log.js');

/*MY SQL Connection Info*/
var pool = mysql.createPool({
	//connectionLimit : 25,
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'passei_direto'
	//port :'3307'
});

log.debug('Server is starting....');

//TEST CONNECTION
pool.getConnection(function (err, connection) {
	if (!err) {
		console.log("Database is connected ... ");
		log.info('Database is connected ... ');
		connection.release();
	} else {
		console.log("Error connecting database ... ");
		log.error('Error connecting database ... ');
	}
	console.log("releasing connection ... ");
});

module.exports = pool;
