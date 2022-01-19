import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from 'react-hooks-use-modal';
// import { setLobbyId } from '../../redux/actions';

const Lobby = () => {
    const [ socket, setSocket ] = useState(null);
    const [ players, setPlayers ] = useState([]);
    const [ messages, setMessages ] = useState([]);
    const [ lobbyId, setLobbyId ] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const name = useSelector(state => state.user.name);
    const isHost = useSelector(state => state.user.isHost);
    const category = useSelector(state => state.lobby.category);
    const [ ModalInvalidLobby, openModalInvalidLobby ] = useModal('root', { preventScroll: true, closeOnOverlayClick: false });
    const [ ModalFullLobby, openModalFullLobby ] = useModal('root', { preventScroll: true, closeOnOverlayClick: false });

    console.log(lobbyId);

    const joinRoom = (socket) => {
        // make a socket room if host
        if (isHost) { 
            socket.emit("create-lobby", { username: name, category: category });
            socket.on("lobby-created", ({ host }) => { 
                // dispatch(setLobbyId(host.lobby_id));
                console.log(`Lobby ${host.lobby_id} created by ${host.username}`);
                if (lobbyId === "") setLobbyId(host.lobby_id.toString());
                setMessages(messages => [ `Lobby created by ${host.username}`, ...messages ]);
                setPlayers(players => [ ...players, host ]);
            });
        // otherwise, join a pre-existing socket room    
        } else {
            socket.emit("request-join-lobby", { username: name, lobbyId: lobbyId });

            socket.on("entry-permission", ({ lobbyId, existingPlayers }) => {
                setPlayers([ ...existingPlayers ]);
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
            const { username, lobby_id } = newPlayer;
            setMessages(messages => [ `${username} has joined lobby ${lobby_id}`, ...messages ]);
        });
    }

    useEffect(() => {
        const io = require('socket.io-client');
        const serverEndpoint = "http://localhost:4000";
        const socket = io(serverEndpoint);
        socket.on("connected", (msg) => {
            console.log(msg);
        });

        if (socket === null) setSocket(socket);
        joinRoom(socket);
        waitInRoom(socket);

        // Disconnect socket when component unmounts
        return () => {
            console.log(lobbyId)
            socket.emit("leave-lobby", { lobbyId: lobbyId });
            socket.disconnect();
        }
    }, []);

    const startGame = () => {
        navigate(`/game/${socket}`);
    }

    const renderPlayers = () => players.map((player, index) => <li key={index}>{player.username}</li>);
    const renderMessages = () => messages.map((message, index) => <p className='message' key={index}>{message}</p>)

    return (
        <div className='lobby-container'>
            <h1>Lobby</h1>

            <ModalInvalidLobby className="pop-up">
                <h2>Lobby does not exist</h2>
                <button id="close-pop-up-btn" onClick={() => navigate('/')}>Close</button>
            </ModalInvalidLobby>

            <ModalFullLobby className="pop-up">
                <h2>Lobby is full</h2>
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