const util = require("./modules/util");
const io = require("socket.io");
const http = require("http");
const fs = require("fs");
const static = require("node-static");
const fileServer = new static.Server("./public", {
	cache: 3600,
	serverInfo: process.env.STATIC_SERVER_VERSION,
	headers: {
		"X-ServedBy": "webchat-node-static"
	}
});

const fileExtensionOmmited = ["json", "xml", "env", "config"];

const httpServer = http.createServer(HTTPServer_Handler);
const ioServer = io(httpServer, {
	path: process.env.SOCKET_PATH
});

httpServer.on("connection", function (socket) {
	//debugger;
});

httpServer.on("connect", function (request, socket, head) {
	util.CustomConsoleLog(`connect: ${request.url}`);
});

httpServer.on("request", function (request, response) {
	util.CustomConsoleLog(`request: ${request.url}`);
});

httpServer.on("close", function (request, response) {
	util.CustomConsoleLog(`close: ${request.url}`);
});

httpServer.listen({
	host: process.env.SERVER_HOST,
	port: process.env.SERVER_PORT
}, HTTPServer_Listener);

function HTTPServer_Handler(request, response) {
	request.addListener("end", function () {

		let checkErrorFolder = new RegExp(/^[\/]error[\/]([A-z]|[0-9]|[.])*$/g);
		let checkJSONFiles = new RegExp(util.CreateRegexFromExtensions(fileExtensionOmmited), "g")

		if (checkErrorFolder.test(request.url)) {
			//Error folder should be hidden
			StaticServer_Handler(request, response, {
				status: 404,
				message: `"Error" folder is hidden`
			}, null);
		} else if (checkJSONFiles.test(request.url)) {
			StaticServer_Handler(request, response, {
				status: 404,
				message: `Extension is not allowed`
			}, null);
		} else {
			fileServer.serve(request, response, function (error, serveResponse) {
				StaticServer_Handler(request, response, error, serveResponse);
			});
		}
	}).resume();
}

function StaticServer_Handler(request, response, error, serveResponse) {
	if (error != null) {
		fileServer.serveFile(util.GetErrorFile(error.status), error.status, {}, request, response);
		util.CustomConsoleLog(`Error serving ${request.url} for ${request.connection.remoteAddress}:${request.connection.remotePort} => [${error.status}] ${error.message}`, "error")
	}
}

function HTTPServer_Listener() {
	util.CustomConsoleLog(`HTTP Server listening on ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
}

ioServer.on("connection", IOServerEvent_Connection);

function IOServerEvent_Connection(socket) {
	let socketConnection = socket.request.connection;

	socket.on("connect", SocketEvent_Connect);
	socket.on("custom_event", SocketEvent_Custom);
	socket.on("disconnect", SocketEvent_Disconnect);

	util.CustomConsoleLog(`Client connected: ${socketConnection.remoteAddress}:${socketConnection.remotePort} => ${socket.id}`);
}

function SocketEvent_Connect() {
	util.CustomConsoleLog("ClientEvent_Connect");
}

function SocketEvent_Custom(e) {
	util.CustomConsoleLog("ClientEvent_Custom");
}

function SocketEvent_Disconnect(e) {
	util.CustomConsoleLog("ClientEvent_Disconnect");
}