//omits the 1st and 2nd arg from the command line
let args = process.argv.slice(2);

	/*response.writeHead(200, {
		"Content-Type": "text/html"
	});
	response.end("test");*/

//Check requested URL, with IP:port
request.addListener("end", function () {
	staticServer.serve(request, response, function (error, result) {
		let consoleTime = new Date().toLocaleString("es-CL");
		console.log(`[${consoleTime}] HTTP Request: ${request.url} from ${request.connection.remoteAddress}:${request.connection.remotePort}`);
		if (result != null) {
			//ok
		} else if (error != null) {
			//error > check which one
			console.error(`Error serving ${request.url} for ${request.connection.remoteAddress}:${request.connection.remotePort}) => [${error.status}] ${error.message}`);

			// Respond to the client
			response.writeHead(error.status, error.headers);
			response.end();
		}
	});
}).resume();