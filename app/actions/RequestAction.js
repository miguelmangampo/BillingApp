import AppConfig from '../AppConfig'

const authType = 'GMSAuth';
const httpTimeout = 10;
const headers = () => {
	return {
		'Content-Type': 'application/json',
		'Authorization': authType + ' ' + AppConfig.token,	
	};
}

function httpRequest (verb, url, body, callback) {
	fetch(AppConfig.apiUrl + url, {
		method: verb,
		headers: headers(),
		timeout: httpTimeout,
		body: (verb === 'GET') ? null : JSON.stringify(body)
	})
	.then((response) => {
		if (response.status >= 400) {
			const errResponse = (response._bodyText) 
				? JSON.parse(response._bodyText)
				: response;
			errResponse.statusCode = response.status;
			throw errResponse;
		}
		return response.json();
	})
	.then((success) => {
		callback(null, success);
	})
	.catch((error) => {
		callback(error, null);
	});
}

export function POST(url, param, callback){
	httpRequest('POST', url, param, (error, response) => {
		callback(error, response);
	});
}

export function GET(url, callback){
	httpRequest('GET', url, {}, (error, response) => {
		callback(error, response);
	});
}