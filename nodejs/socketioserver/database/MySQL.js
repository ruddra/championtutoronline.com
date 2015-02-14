var app = require("../app");
var mysql = require('mysql');

var connection = mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password : '123456'
		});

if(app.DEBUG){
	console.log(connection);
}

connection.query('USE champ_db');

var exports = module.exports = {
	connection: connection
};