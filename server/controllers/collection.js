var express = require('express');
var pool = require('../pool.js');
var log = require('../log.js');

var collection = express();

// This responds a GET request for the /list page.
collection.get('/api/list', function (req, res) {
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
collection.put('/api/update', function (req, res) {
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
collection.get('/api/list/:id', function (req, res) {
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
collection.post('/api/insert', function (req, res) {
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
collection.post('/api/delete', function (req, res) {
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

module.exports = collection;