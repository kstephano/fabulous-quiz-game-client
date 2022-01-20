// action types
const SET_NAME = "SET_NAME";
const SET_ID = "SET_ID";
const SET_SCORE = "SET_SCORE";
const SET_HOST = "SET_HOST";
const SET_LOBBY_ID = "SET_LOBBY_ID";
const SET_LOBBY_OPTIONS = "SET_LOBBY_OPTIONS";
const ADD_PLAYER = "ADD_PLAYER";
const INIT_SOCKET = "SET_SOCKET";

// action creators
const setName = (name) => ({
    type: SET_NAME,
    payload: name
});

const setId = (id) => ({
    type: SET_ID,
    payload: id
});

const setScoreAction = (score) => ({
    type: SET_SCORE,
    payload: score
});

const setHost = (isHost) => ({
    type: SET_HOST,
    payload: isHost
});

const setLobbyId = (lobbyId) => ({
    type: SET_LOBBY_ID,
    payload: lobbyId
});

const setLobbyOptions = (lobbyOptions) => ({
    type: SET_LOBBY_OPTIONS,
    payload: lobbyOptions
});

const addPlayer = (player) => ({
    type: ADD_PLAYER,
    payload: player
});

const initSocket = (socket) => ({
    type: INIT_SOCKET,
    payload: socket
});

export { SET_NAME, SET_ID, SET_SCORE, SET_HOST, SET_LOBBY_ID, SET_LOBBY_OPTIONS, ADD_PLAYER, INIT_SOCKET }
export { setName, setId, setScoreAction, setHost, setLobbyId, setLobbyOptions, addPlayer, initSocket }