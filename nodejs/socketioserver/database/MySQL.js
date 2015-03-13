var app = require("../app");
var mysql = require('mysql');

var connection = mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password : ''
		});

if(app.DEBUG){
	console.log(connection);
}

connection.query('USE champ_db');

var exports = module.exports = {
	connection: connection
};
