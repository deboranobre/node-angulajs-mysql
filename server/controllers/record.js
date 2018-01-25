var express = require('express');
var pool = require('../pool.js');
var log = require('../log.js');

var record = express();

// LIST Record by ID
record.get('/api/listRecordById/:id', function (req, res) {
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
record.get('/api/listRecords/:collection_id', function (req, res) {
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
record.post('/api/insertRecord', function (req, res) {
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
record.put('/api/updateRecord', function (req, res) {
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
record.post('/api/deleteRecord', function (req, res) {
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

module.exports = record;