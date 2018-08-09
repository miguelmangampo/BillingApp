import Moment from 'moment';
import Numeral from 'numeral';
import _ from 'lodash';
import AppConfig from '../AppConfig';

export function defaultDateFormat(date){
	return Moment(date).format('YYYY-MM-DD');
}

export function defaultDateTimeFormat(date){
	return Moment(date).format('YYYY-MM-DD, h:mm a');
}

export function defaultMoneyFormat(money){
	return Numeral(money).format('0,0.00');
}

export function defaultNumberFormat(money){
	return Numeral(money).format('0,0');
}

export function getActivationStatusColor(status) {
	let color = '';
	if (status == 'ACTIVE') {
		color = '#1e8449';
	} else if (status == 'INACTIVE') {
		color = '#922b21';
	}  else if (status == 'DEACTIVATING' || status == 'WAITING_TO_DEACT') {
		color = '#dc7633';
	} else if (status == 'ACTIVATING' || status == 'WAITING_TO_ACT') {
		color = '#16a085';
	} else if (status == 'RESERVING_TO_ACTIVATE') {
		color = '#E9967A';
	} else if (status == 'RESERVING_TO_DEACTIVATE') {
		color = '#F08080';
	}
	return {color};	
}

export function isOriginCompany() {
	let company = _.find(AppConfig.originCompanies, (companyID) => {
		return companyID == AppConfig.companyID;
	})

	return !!company;
}
