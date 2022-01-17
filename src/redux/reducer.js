import { combineReducers } from 'redux';
import { SET_NAME } from "./actions";

const reducer = (state="", action) => {
    switch (action.type) {
        case SET_NAME:
            return action.payload
        default:
            return state;
    }
}

const combinedReducer = combineReducers({
    name: reducer
});

export default combinedReducer;