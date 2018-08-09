import { combineReducers } from 'redux';
import LoginReducer from './LoginReducer';
import BillingReducer from './BillingReducer';  
 
// Combine all the reducers
const rootReducer = combineReducers({
    LoginReducer
    , BillingReducer
})
 
export default rootReducer;