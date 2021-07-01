
import { createStore, applyMiddleware, compose } from 'redux'
import reduxThunk from 'redux-thunk';
import reducers from './reducers';


export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);

        localStorage.setItem('state', serializedState);
    } catch (err) {

        console.log(err)
    }
};

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};
const persistedState = loadState();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
    reducers,
    persistedState,
    composeEnhancers(applyMiddleware(reduxThunk))
);

store.subscribe(() => saveState(store.getState()))
