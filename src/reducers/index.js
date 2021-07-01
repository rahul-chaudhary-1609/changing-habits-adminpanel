import { combineReducers } from 'redux';
import authReducer from './authReducer';
import sidebarReducer from './sidebarReducer'

const appReducer = combineReducers({
    auth: authReducer,
    sidebar: sidebarReducer
});

export default function rootreducer(state, action) {
    if (action.type === 'USER_LOGOUT') {

        state = undefined
    }

    return appReducer(state, action)
}