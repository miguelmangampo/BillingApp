import { GET, POST } from './RequestAction';
import AppConfig from '../AppConfig';

export function getStatus(serviceEntityID, callback){
	const url = AppConfig.username 
			+ '/api/societies/' + AppConfig.billing.societyID
			+ '/service-entities/' + serviceEntityID;
	GET(url, (error, success) => {
		callback(error, success);
	});
}

export function getMobilityData(serviceEntityID, dateTimeFrom, dateTimeTo, callback){
	const url = AppConfig.username 
			+ '/api/societies/' + AppConfig.billing.societyID
			+ '/service-entities/' + serviceEntityID
			+ '/mobility-data'
			+ '?createdFrom=' + dateTimeFrom
			+ '&createdTo=' + dateTimeTo;
	GET(url, (error, success) => {
		callback(error, success);
	});
}

export function activation(serviceEntityID, status, callback){
	const url = AppConfig.username 
			+ '/api/societies/' + AppConfig.billing.societyID
			+ /service-entities/ + serviceEntityID
			+ '/activation';
	const body = { 
		operation: status,
		reservation: true,
	};
	POST(url, body, (error, success) => {
		callback(error, success);
	});
}