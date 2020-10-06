const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
	//console.log(req.headers);
	console.log("Request for " + req.url + " by method " + req.method);

	/*res.statusCode = 200;
	res.setHeader('Contetnt-Type','text/html');
	res.end('<html><h1>Hello, World!</h1></html>');*/
	if (req.method == 'GET'){
		var fileURL;
		if (req.url == '/') fileURL = '/index.html';
		else fileURL = req.url;

		var filePath = path.resolve('./public'+fileURL);
		const fileExt = path.extname(filePath);
		if (fileExt == '.html'){
			fs.exists(filePath, (exists) => {
				if (!exists) {//fs.excists return true or false
					res.statusCode = 404;
					res.setHeader('Content-Type', 'text/html');
					res.end('<html><body><h1> Error 404: ' + fileURL + ' not found</h1></body></html>');
					return;
				}
				res.statusCode = 200;
				res.setHeader('Content-Type', 'text/html');
				fs.createReadStream(filePath).pipe(res);	//will be in the .body of response

			})
		}else{
			res.statusCode = 404;
			res.setHeader('Content-Type', 'text/html');
			res.end('<html><body><h1> Error 404: ' + fileURL + ' not found is not .HTML file</h1></body></html>');
			return;

		}

	}else{
		res.statusCode = 404;
		res.setHeader('Content-Type', 'text/html');
		res.end('<html><body><h1> Error 404: ' + req.method + ' not supported</h1></body></html>');
		return;

	}
})

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}`);

});