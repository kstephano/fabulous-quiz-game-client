// action types
const SET_NAME = "SET_NAME";
const SET_HOST = "SET_HOST";
const SET_LOBBY_OPTIONS = "SET_LOBBY_OPTIONS";

// action creators
const setName = (name) => ({
    type: SET_NAME,
    payload: name
});

const setHost = (isHost) => ({
    type: SET_HOST,
    payload: isHost
});

const setLobbyOptions = (lobbyOptions) => ({
    type: SET_LOBBY_OPTIONS,
    payload: lobbyOptions
});


export { SET_NAME, SET_HOST, SET_LOBBY_OPTIONS }
export { setName, setHost, setLobbyOptions }