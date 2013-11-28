var express = require('express');
var rest = require('restler');
var fs = require('fs');
var products;

var getFilters = function(req, res) {
	var filters = [
		{name:'Brand'       ,type:'String',elems:['ACER','APPLE','ASUS','AVATAR','DELL','LENOVO','SAMSUNG']},
		{name:'Ram'         ,type:'Number',elems:[2,4,6,8,12,16]},
		{name:'Hard Drive'  ,type:'Number',elems:[16,24,128,500,520,750,1024]}
	];
	res.send(200,filters);
}

var getProducts = function(req, res) {
	res.send(200,products);
}

var loadData = function() {

	var request = rest.get('https://dl.dropboxusercontent.com/u/20243104/db.csv');
	request.on('complete', function(data) { 
		products = [];

		var lines = data.toString().split('\n');
		var header = lines[0].split('\t');
		lines = lines.splice(1);

        lines.forEach(function(line){
            var t = line.split('\t');
            if(t.length == 10) {
                var p = {};
                header.forEach(function(h,i) {
                	p[h] = t[i];
                });
                products.push(p);
            }
        });
        console.log('Size: '+products.length);
	});
/*
	fs.readFile('data/db.csv','utf-8',function(err,data){
		if(err) {
			return console.log(err);
		}
		
	});
*/
}
var fileSystemTest = function(req, res) {
	var request = rest.get('https://dl.dropboxusercontent.com/u/20243104/db.csv');

		
	request.on('complete', function(result) { 
		res.send(200,result);
	});
	/*var data = fs.readFileSync('https://dl.dropboxusercontent.com/u/20243104/db.csv','utf-8');
*/
	
}
var launchWebApp = function() {
	var app = express();
	app.get('/',function(req,res){
		res.send(200,{msg:'Hello JSON'});
	});

	app.get('/filters',getFilters);
	app.get('/products',getProducts);
	app.get('/test',fileSystemTest);

	var port = process.env.PORT || 8080;
	app.listen(port,function() {
		console.log('Listening on port: '+port);
	});

}

var main = function() {
	loadData();
	launchWebApp();
}

main();