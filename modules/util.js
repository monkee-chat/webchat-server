const moment = require("moment");

function GetErrorFile(statusCode) {
	return `/error/${statusCode}.html`;
}

function GetConsoleTime() {
	return moment().format("YYYY-MM-DD HH:mm:ss:SSS");
}

function CreateRegexFromExtensions(extensions) {
	let regex = "^.+?(";
	for (let i = 0; i < extensions.length; i++) {
		const element = extensions[i];
		regex += `\\.${element}`;
		regex += (i < extensions.length - 1) ? "|" : ")$";
	}

	return regex;
}

function CustomConsoleLog(text, logType) {
	if (logType == null) logType = "log";
	switch (logType.toLowerCase()) {
		case "log":
			console.log(`[${GetConsoleTime()}] ${text}`);
			break;
		case "error":
			console.error(`[${GetConsoleTime()}] ${text}`);
			break;
	}
}

module.exports = { GetErrorFile, GetConsoleTime, CustomConsoleLog, CreateRegexFromExtensions };