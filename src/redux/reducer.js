import { combineReducers } from 'redux';
import { SET_NAME, SET_HOST, SET_LOBBY_OPTIONS } from "./actions";

const userReducer = (state={ name: "", isHost: false }, action) => {
    switch (action.type) {
        case SET_NAME:
            return { ...state, name: action.payload }
        case SET_HOST:
            return { ...state, isHost: action.payload }
        default:
            return state;
    }
}

const lobbyReducer = (state={ numOfQuestions: 5, category: "", difficulty: "", time: 60 }, action) => {
    switch (action.type) {
        case SET_LOBBY_OPTIONS:
            return { state: action.payload }
        default:
            return state;
    }
}

const combinedReducer = combineReducers({
    user: userReducer,
    lobby: lobbyReducer
});

export default combinedReducer;