import { GET } from './RequestAction';
import AppConfig from '../AppConfig';
import * as types from './types';
import _ from 'lodash';

export function getList(pageNumber, companyID, accountType, vehicleTypeID, clientName, vehicleName, callback){
	const isSearchAccountType = (!accountType || accountType.trim() == 'ALL' || accountType.trim() == '') ? 0 : 1;
	const isSearchVehicleType = (!vehicleTypeID || vehicleTypeID == 0 || vehicleTypeID.trim() == '') ? 0 : 1;
	const isSearchClientName = (!clientName || clientName.trim() == '') ? 0 : 1;
	const isSearchVehicleName = (!vehicleName || vehicleName.trim() == '') ? 0 : 1;

	AppConfig.billing.companyID = (!companyID || companyID == 0) ? AppConfig.companyID : companyID;
    const selectedCompany = _.find(AppConfig.companyList, (company) => {
      return company.id == AppConfig.billing.companyID;
    });
    AppConfig.billing.societyID = (selectedCompany && selectedCompany.societyID) ? selectedCompany.societyID : AppConfig.societyID;

	const url = AppConfig.username + '/api/societies/' + AppConfig.billing.societyID + '/client-vehicle-summary/search'
				+ '?companyID=' + AppConfig.billing.companyID
				+ '&sortBy=gmsNo_ASC'
				+ '&pageNumber=' + pageNumber
				+ '&pageSize=' + AppConfig.billing.page.size
				+ '&totalRecords=' + AppConfig.billing.page.totalRecords
				+ '&isSearchGMSNo=0&gmsNo=0'
				+ '&isSearchAccountType=' + isSearchAccountType + '&accountType=' + accountType
				+ '&isSearchVehicleType=' + isSearchVehicleType + '&vehicleTypeID=' + vehicleTypeID
				+ '&isSearchTerminalID=0&terminalID=0'
				+ '&isSearchClient=' + isSearchClientName + '&clientNameKey=' + clientName
				+ '&isSearchVehicle=' + isSearchVehicleName + '&vehicleNameKey=' + vehicleName
				+ '&isSearchStartMobility=0&startMobilityFrom=0&startMobilityTo=0';

	return (dispatch) => {
		dispatch({ type: types.LOADING });

		GET(url, (error, success) => {
			if (pageNumber > AppConfig.billing.page.number) {
				AppConfig.billing.list = AppConfig.billing.list.concat(success ? success.data: []);
			} else {
				AppConfig.billing.list = success ? success.data: [];
			}

			const response = {
				status: (error) ? types.RESPONSE_ERROR : types.RESPONSE_OK,
				type: types.DATA_AVAILABLE,
				data: AppConfig.billing.list,
				totalRecords: (success) ? success.totalRecords : 0,
				pageNumber: pageNumber,
			};
			AppConfig.billing.page.totalRecords = response.totalRecords;
			AppConfig.billing.page.number = pageNumber;
			callback(error, response.status);
			dispatch(response);
		});
	};
}

export function getPayments(clientVehicleID, callback){
	const url = 'payments-by-page/history'
			+ '?clientVehicleID=' + clientVehicleID
			+ '&pageNumber=1' + '&pageSize=1000000' + '&totalRecords=0';
	GET(url, (error, success) => {
		callback(error, success);
	});
}

export function getPayables(clientVehicleID, callback){
	const url = 'payableslist/' + clientVehicleID;
	GET(url, (error, success) => {
		callback(error, success);
	});
}