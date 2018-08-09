import { POST, GET } from './RequestAction';
import AppConfig from '../AppConfig';
import * as types from './types';

function loginResponse(data) {
	return {
		status: (data && data.status) ? data.status : types.RESPONSE_ERROR,
		msg: (data && data.msg) ? data.msg : 'Cannot connect to server at the moment.'
	};
}

function setConfig(username, data) {
	AppConfig.token = (data) ? data.token : '';
	AppConfig.username = (data) ? username: '';
	AppConfig.societyID = (data) ? data.gmsContractID : '';
	AppConfig.companyCode = (data) ? data.companyCode : '';
	AppConfig.companyID = (data) ? data.companyID : 0;
}

function populateCompanyList(callback) {
	const url = 'companies-by-page?pageNumber=1&pageSize=1000&totalRecords=0';
	GET(url, (error, success) => {
		AppConfig.companyList = (error) ? [] : success.list;
		callback(true);
	});	
}

export function attemptLogin(username, password, callback){
	return (dispatch) => {
		dispatch({ type: types.LOADING });
		POST('login', { Username: username, Password: password }, (error, success) => {
			const response = {
				data: loginResponse(error ? error : success),
				type: types.DATA_AVAILABLE
			};	
			setConfig(username, error ? null : success);
			populateCompanyList((isDone) => {
				dispatch(response);
				callback(response.data);
			});
		});
	};
}
