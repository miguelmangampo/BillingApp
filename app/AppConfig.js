export default class AppConfig {
	static apiUrl = 'https://billing-a.cloud-gms.com:61000/';
	static token = '';
	static username = '';
	static societyID = '';
	static companyCode = '';
	static companyID = 0;
	static companyList = [];
	static originCompanies = [
		1 // GMSP
	];
	static billing = {
		page: {
			number: 1,
			size: 10,
			totalRecords: 0			
		},
		search: {
			clientName: '',
			vehicleName: ''
		},
		list: [],
		societyID: '',
		companyID: 0,
	};
	static home = {
		companyID: 0,
	}
}