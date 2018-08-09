import * as types from '../actions/types';

let loginState = {
	loading: false,
	data: {}
};

const LoginReducer = (state = loginState, action) => {
	switch (action.type) {
		case types.LOADING:
			loginState.loading = true;
			state = Object.assign({}, state, loginState);
			return state;

		case types.DATA_AVAILABLE:
			loginState.loading = false;
			loginState.data = action.data;
			state = Object.assign({}, state, loginState);
			return state;
			
		default:
			return state;
	}
};

export default LoginReducer;