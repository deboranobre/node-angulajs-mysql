var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");


//LOGGER
var log4js = require('log4js');
//log4js.configure('./config/log4js.json');
var log = log4js.getLogger("server");

//STATIC FILES
app.use(express.static('public'));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Body parser use JSON data

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

// ROOT - Loads Angular App
app.get('/', function (req, res) {
	res.sendFile( __dirname + "/" + "index.html" );
});

// This responds a GET request for the /list page.
app.get('/api/list', function (req, res) {
	console.log("GET Request :: /list");
	log.info('GET Request :: /list');
	var data = {
        "error": 1,
        "collections": ""
    };
	
	pool.getConnection(function (err, connection) {
		connection.query('SELECT * from collections', function (err, rows, fields) {
			connection.release();

			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["collections"] = rows;
				res.json(data);
			} else if (rows.length === 0) {
				//Error code 2 = no rows in db.
				data["error"] = 2;
				data["collections"] = 'Nenhum catálogo encontrado...';
				res.json(data);
			} else {
				data["collections"] = 'error while performing query';
				res.json(data);
				console.log('Error while performing Query: ' + err);
				log.error('Error while performing Query: ' + err);
			}
		});
	
	});
});

//UPDATE Collection
app.put('/api/update', function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var description = req.body.description;
    var data = {
        "error": 1,
        "collection": ""
    };
	console.log('PUT Request :: /update: ' + id);
	log.info('PUT Request :: /update: ' + id);
    if (!!id && !!name && !!description) {
		pool.getConnection(function (err, connection) {
			connection.query("UPDATE collections SET name = ?, description = ? WHERE id=?",[name,  description, id], function (err, rows, fields) {
				if (!!err) {
					data["collection"] = "Error Updating data";
					console.log(err);
					log.error(err);
				} else {
					data["error"] = 0;
					data["collections"] = "Updated Collection Successfully";
					console.log("Updated: " + [id, name, description]);
					log.info("Updated: " + [id, name, description]);
				}
				res.json(data);
			});
		});
    } else {
        data["collection"] = "Please provide all required data";
        res.json(data);
    }
});

//LIST Collection by ID
app.get('/api/list/:id', function (req, res) {
	var id = req.params.id;
	var data = {
        "error": 1,
        "collection": ""
    };
	
	console.log("GET request :: /list/" + id);
	log.info("GET request :: /list/" + id);
	pool.getConnection(function (err, connection) {
		connection.query('SELECT * from collections WHERE id = ?', id, function (err, rows, fields) {
			connection.release();
			
			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["collection"] = rows;
				res.json(data);
			} else {
				data["collection"] = 'Nenhum catálogo encontrado..';
				res.json(data);
				console.log('Error while performing Query: ' + err);
				log.error('Error while performing Query: ' + err);
			}
		});
	
	});
});

//INSERT new collection
app.post('/api/insert', function (req, res) {
	var name = req.body.name;
    var description = req.body.description;
    var data = {
        "error": 1,
        "collections": ""
    };
	console.log('POST Request :: /insert: ');
	log.info('POST Request :: /insert: ');
    if (!!name && !!description) {
		pool.getConnection(function (err, connection) {
			connection.query("INSERT INTO collections SET name = ?, description = ?",[name,  description], function (err, rows, fields) {
				if (!!err) {
					data["collections"] = "Erro ao adicionar dados";
					console.log(err);
					log.error(err);
				} else {
					data["error"] = 0;
					data["collections"] = "Catálogo adicionado com sucesso!";
					console.log("Added: " + [name, description]);
					log.info("Added: " + [name, description]);
				}
				res.json(data);
			});
        });
    } else {
        data["collections"] = "Por favor preencha todos os campos obrigatórios.";
        res.json(data);
    }
});

// DELETE Collection
app.post('/api/delete', function (req, res) {
    var id = req.body.id;
    var data = {
        "error": 1,
        "collection": ""
    };
	console.log('DELETE Request :: /delete: ' + id);
	log.info('DELETE Request :: /delete: ' + id);
    if (!!id) {
		pool.getConnection(function (err, connection) {
			connection.query("DELETE FROM collections WHERE id=?",[id],function (err, rows, fields) {
				if (!!err) {
					data["collection"] = "Error deleting data";
					console.log(err);
					log.error(err);
				} else {
					data["collection"] = 0;
					data["collection"] = "Delete collection Successfully";
					console.log("Deleted: " + id);
					log.info("Deleted: " + id);
				}
				res.json(data);
			});
		});
    } else {
        data["collections"] = "Please provide all required data (i.e : id ) & must be a integer";
        res.json(data);
    }
});

// LIST Record by ID
app.get('/api/listRecordById/:id', function (req, res) {
	console.log("GET Request :: /listRecordById");
	log.info('GET Request :: /listRecordById');

	var id = req.params.id;
	var data = {
        "error": 1,
        "records": ""
    };
	
	pool.getConnection(function (err, connection) {
		connection.query('SELECT * from records WHERE id = ?', id, function (err, rows, fields) {
			connection.release();

			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["record"] = rows;
				res.json(data);
			} else {
				data["record"] = 'Nenhum disco encontrado..';
				res.json(data);
				console.log('Error while performing Query: ' + err);
				log.error('Error while performing Query: ' + err);
			}
		});
	
	});
});

// This responds a GET request for the /listRecords page.
app.get('/api/listRecords/:collection_id', function (req, res) {
	console.log("GET Request :: /listRecords");
	log.info('GET Request :: /listRecords');

	var collection_id = req.params.collection_id;
	var data = {
        "error": 1,
        "records": ""
    };
	
	pool.getConnection(function (err, connection) {
		connection.query('SELECT * from records WHERE collection_id = ?', collection_id, function (err, rows, fields) {
			connection.release();

			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["records"] = rows;
				res.json(data);
			} else if (rows.length === 0) {
				//Error code 2 = no rows in db.
				data["error"] = 2;
				data["records"] = 'Nenhum disco encontrado...';
				res.json(data);
			} else {
				data["records"] = 'error while performing query';
				res.json(data);
				console.log('Error while performing Query: ' + err);
				log.error('Error while performing Query: ' + err);
			}
		});
	
	});
});

//INSERT new record
app.post('/api/insertRecord', function (req, res) {
	var title = req.body.title;
    var artist = req.body.artist;
    var year = req.body.year;
    var collection_id = req.body.collection_id;

    var data = {
        "error": 1,
        "records": ""
    };
	console.log('POST Request :: /insertRecord: ');
	log.info('POST Request :: /insertRecord: ');

    if (!!title && !!artist && !!year && !!collection_id) {
		pool.getConnection(function (err, connection) {
			connection.query("INSERT INTO records SET title = ?, artist = ?, year = ?, collection_id = ?",[title,  artist, year, collection_id], function (err, rows, fields) {
				if (!!err) {
					data["records"] = "Erro ao adicionar dados";
					console.log(err);
					log.error(err);
				} else {
					data["error"] = 0;
					data["records"] = "Disco adicionado com sucesso!";
					console.log("Added: " + [title,  artist, year, collection_id]);
					log.info("Added: " + [title,  artist, year, collection_id]);
				}
				res.json(data);
			});
        });
    } else {
        data["records"] = "Por favor preencha todos os campos obrigatórios.";
        res.json(data);
    }
});

//UPDATE Record
app.put('/api/updateRecord', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var artist = req.body.artist;
    var year = req.body.year;
    var collection_id = req.body.id;
    var data = {
        "error": 1,
        "record": ""
    };

	console.log(req.body);

	console.log('PUT Request :: /updateRecord: ' + id);
	log.info('PUT Request :: /updateRecord: ' + id);
    if (!!title && !!artist && !!year && !!collection_id && !!id) {
		pool.getConnection(function (err, connection) {
			connection.query("UPDATE records SET title = ?, artist = ?, year = ? WHERE id=? AND collection_id=?",[title,  artist, year, collection_id, id], function (err, rows, fields) {
				if (!!err) {
					data["record"] = "Error Updating data";
					console.log(err);
					log.error(err);
				} else {
					data["error"] = 0;
					data["records"] = "Updated Record Successfully";
					console.log("Updated: " + [title,  artist, year, collection_id, id]);
					log.info("Updated: " + [title,  artist, year, collection_id, id]);
				}
				res.json(data);
			});
		});
    } else {
        data["record"] = "Please provide all required data";
        res.json(data);
    }
});

// DELETE Record
app.post('/api/deleteRecord', function (req, res) {
    var id = req.body.id;
    var data = {
        "error": 1,
        "record": ""
    };
	console.log('DELETE Request :: /deleteRecord: ' + id);
	log.info('DELETE Request :: /deleteRecord: ' + id);
    if (!!id) {
		pool.getConnection(function (err, connection) {
			connection.query("DELETE FROM records WHERE id=?",[id],function (err, rows, fields) {
				if (!!err) {
					data["record"] = "Error deleting data";
					console.log(err);
					log.error(err);
				} else {
					data["record"] = 0;
					data["record"] = "Delete Record Successfully";
					console.log("Deleted: " + id);
					log.info("Deleted: " + id);
				}
				res.json(data);
			});
		});
    } else {
        data["records"] = "Please provide all required data (i.e : id ) & must be a integer";
        res.json(data);
    }
});

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("App listening at: " + host + ":" + port);

})