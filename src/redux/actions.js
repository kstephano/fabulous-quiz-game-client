// action types
const SET_NAME = "SET_NAME";
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

export { SET_NAME, SET_HOST, SET_LOBBY_ID, SET_LOBBY_OPTIONS, ADD_PLAYER, INIT_SOCKET }
export { setName, setHost, setLobbyId, setLobbyOptions, addPlayer, initSocket }