const config = require('dc-api-core/config');
const https = require('https');
const qs = require('querystring');

function requestPOST (url, payload) {
	payload = Buffer.from(payload);
	return new Promise(resolve => {
		const headers = {
			'content-type': 'application/x-www-form-urlencoded',
			'content-length': payload.length
		};

		const req = https.request(url, { method: 'POST', headers }, res => {
			let body = '';
			res.on('data', chunk => body += chunk.toString());
			res.on('end', () => {
				resolve(JSON.parse(body));
			});
		});

		req.write(payload);
		req.end();
	});
}

function request (url, payload) {
	if (payload) {
		return requestPOST(url, qs.stringify(payload));
	}

	return new Promise(resolve => {
		const req = https.request(url, res => {
			let body = '';
			res.on('data', chunk => body += chunk.toString());
			res.on('end', () => {
				resolve(JSON.parse(body));
			});
		});

		req.end();
	});
}

function install (ctx) {
	if (config.vk) require('./vk');
	if (config.google) require('./google');
}

module.exports = { install, request };
