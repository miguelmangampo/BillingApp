import { GET, POST } from './RequestAction';
import AppConfig from '../AppConfig';

export function getDashboardDetails(companyID, callback){
	const url = 'dashboard?companyID=' + companyID;
	GET(url, (error, success) => {
		callback(error, success);
	});
}