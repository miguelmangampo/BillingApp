import * as types from '../actions/types';

let myProps = {
	loading: false,
	billingList: []
};

const BillingReducer = (state = myProps, action) => {
	switch (action.type) {
		case types.LOADING:
			myProps.loading = true;
			state = Object.assign({}, state, myProps);
			return state;

		case types.DATA_AVAILABLE:
			myProps.loading = false;
			myProps.billingList = action.data || [];
			myProps.totalLoadedRecords = myProps.billingList.length;
			myProps.totalRecords = action.totalRecords || 0;
			myProps.pageNumber = action.pageNumber || 0;
			myProps.isAuthorized = action.isAuthorized || false;
			myProps.billingListDisplay = [];
			myProps.billingListDisplay = myProps.billingListDisplay.concat(myProps.billingList);
			if (myProps.billingList.length < myProps.totalRecords) {
				myProps.billingListDisplay.push({ isLoadMoreComponent: true });
			}			
			state = Object.assign({}, state, myProps);
			return state;
			
		default:
			return state;
	}
};

export default BillingReducer;