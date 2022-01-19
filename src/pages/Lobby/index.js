import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from 'react-hooks-use-modal';
import { setLobbyId, initSocket } from '../../redux/actions';

const Lobby = () => {
    const [ socket, setSocket ] = useState(null);
    const [ currentPlayer, setCurrentPlayer ] = useState(null);
    const [ players, setPlayers ] = useState([]);
    const [ messages, setMessages ] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const name = useSelector(state => state.user.name);
    const lobbyId = useSelector(state => state.user.lobbyId);
    const isHost = useSelector(state => state.user.isHost);
    const category = useSelector(state => state.lobby.category);
    const [ ModalInvalidLobby, openModalInvalidLobby ] = useModal('root', { preventScroll: true, closeOnOverlayClick: false });
    const [ ModalFullLobby, openModalFullLobby ] = useModal('root', { preventScroll: true, closeOnOverlayClick: false });

    const joinRoom = (socket) => {
        // make a socket room if host
        if (isHost) { 
            socket.emit("create-lobby", { username: name, category: category });
            socket.on("lobby-created", ({ host }) => { 
                dispatch(setLobbyId(host.lobby_id));
                console.log(`Lobby ${host.lobby_id} created by ${host.username}`);
                setMessages(messages => [ `Lobby created by ${host.username}`, ...messages ]);
                setPlayers(players => [ ...players, host ]);
                setCurrentPlayer(host);
            });
        // otherwise, join a pre-existing socket room    
        } else {
            socket.emit("request-join-lobby", { username: name, lobbyId: lobbyId });

            socket.on("entry-permission", ({ lobbyId, existingPlayers, newPlayer }) => {
                setPlayers([ ...existingPlayers ]);
                setCurrentPlayer(newPlayer);
                dispatch(setLobbyId(lobbyId));
                setMessages(messages => [ `Joined lobby ${lobbyId}`, ...messages]);
            });

            socket.on("lobby-is-full", () => {
                openModalFullLobby();
            });

            socket.on("lobby-id-invalid", () => {
                openModalInvalidLobby();
            });
        }
    }

    const waitInRoom = (socket) => {
        // add new player to local player list for everyone
        socket.on("add-new-player", ({ newPlayer }) => {
            setPlayers(players => [ ...players, newPlayer ]);
        });

        // herald the new player to other players
        socket.on("herald-new-player", ({ newPlayer }) => {
            const { username } = newPlayer;
            setMessages(messages => [ `${username} has joined the lobby`, ...messages ]);
        });
        
        // remove player from list when they leave
        socket.on("player-left", ({ player }) => {
            setPlayers(players => players.filter(p => p.id !== player.id));
            setMessages(messages => [`${player.username} has left the lobby`, ...messages]);
        });

        // host loads the game for other players
        socket.on("loading-game", () => {
            navigate(`/game`);
        });
    }

    useEffect(() => {
        const io = require('socket.io-client');
        const serverEndpoint = "http://localhost:4000";
        const newSocket = io(serverEndpoint);
        newSocket.on("connected", (msg) => {
            console.log(msg);
        });
        if (socket === null) setSocket(newSocket);
        dispatch(initSocket(newSocket));

        joinRoom(newSocket);
        waitInRoom(newSocket);
    }, []);

    const startGame = () => {
        // host starts the game
        socket.emit("host-load-game", ({ lobbyId: lobbyId, currentPlayer: currentPlayer }));
        navigate('/game');
    }

    const leaveLobby = (socket) => {
        console.log(lobbyId)
        socket.emit("leave-lobby", ({ lobbyId: lobbyId , player: currentPlayer }));
        navigate('/');
        socket.disconnect();
    }

    const renderPlayers = () => players.map((player, index) => <li key={index}>{player.username}</li>);
    const renderMessages = () => messages.map((message, index) => <p className='message' key={index}>{message}</p>)

    return (
        <div className='lobby-container'>
            <h2>Lobby</h2>
            <button onClick={()=> leaveLobby(socket)}>Leave lobby</button>

            <ModalInvalidLobby className="pop-up">
                <h3>Lobby does not exist</h3>
                <button id="close-pop-up-btn" onClick={() => navigate('/')}>Close</button>
            </ModalInvalidLobby>

            <ModalFullLobby className="pop-up">
                <h3>Lobby is full</h3>
                <button id="close-pop-up-btn" onClick={() => navigate('/')}>Close</button>
            </ModalFullLobby>

            <div className='players-container'>
                <p>{players.length}/10{}</p>
                <ul>
                    {renderPlayers()}
                </ul>
            </div>
            <div className='message-container'>
                {renderMessages()}
            </div>
            <button onClick={startGame} disabled={!isHost}>Start Game</button>
            <div className='invite-friends-container'>
                <h2>Invite your friends!</h2>
                <p className='lobby-id'>{lobbyId}</p>
            </div>
        </div>
    )
}

export default Lobby;