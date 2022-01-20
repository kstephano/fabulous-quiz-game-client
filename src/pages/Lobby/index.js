import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from 'react-hooks-use-modal';
import { setLobbyId, initSocket, setName, setId } from '../../redux/actions';
import { randomNumBetween } from '../../helpers/index';

import "./style.css"

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
    const { numOfQuestions, category, difficulty, roundLimit } = useSelector(state => state.lobby);
    const [ ModalInvalidLobby, openModalInvalidLobby ] = useModal('root', { preventScroll: true, closeOnOverlayClick: false });
    const [ ModalFullLobby, openModalFullLobby ] = useModal('root', { preventScroll: true, closeOnOverlayClick: false });

    const joinRoom = (socket) => {
        console.log(randomNumBetween(1, 5));
        // make a socket room if host
        if (isHost) { 
            let categoryId = category;
            if (category === 8) {
                categoryId = randomNumBetween(9, 32);
            }
            console.log("category id:" + categoryId);
            // send event to create the lobby
            socket.emit("create-lobby", { username: name, numOfQuestions: numOfQuestions, categoryId: categoryId, difficulty: difficulty, roundLimit: roundLimit });
            // on lobby created event
            socket.on("lobby-created", ({ host }) => { 
                dispatch(setLobbyId(host.lobby_id));
                dispatch(setId(host.id));
                dispatch(setName(host.username));
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
        <div id='lobby-container'>
            <h2>Lobby</h2>

            {/* <ModalInvalidLobby>
                <div className="pop-up">
                    <h3>Lobby does not exist</h3>
                    <button id="close-pop-up-btn" onClick={() => navigate('/')}>Close</button>
                </div>
            </ModalInvalidLobby>

            <ModalFullLobby className="pop-up">
                <div className="pop-up">
                    <h3>Lobby is full</h3>
                    <button id="close-pop-up-btn" onClick={() => navigate('/')}>Close</button>
                </div>
            </ModalFullLobby> */}

            <div className='players-container'>
                <p>Players: {players.length}/10{}</p>
                { players.length !== 0 &&
                    <ul>
                        {renderPlayers()}
                    </ul>
                }
            </div>
            {messages.length !== 0 &&
                <div className='message-container'>
                    {renderMessages()}
                </div>
            }
            { !isHost && 
            <div className="start-buttons-div">
                <p>Waiting for the host to start the game</p>
                <button onClick={()=> leaveLobby(socket)} className="orange-button">Leave lobby</button>
            </div>
            }
            { isHost && 
            <div className="start-buttons-div host-buttons">
                <button onClick={startGame} className="green-button">Start Game</button>
                <button onClick={()=> leaveLobby(socket)} className="orange-button">Leave lobby</button>
            </div>
            }
            <div className='invite-friends-container'>
                <h2>Invite your friends!</h2>
                <p className='lobby-id'>Lobby ID: {lobbyId}</p>
            </div>
        </div>
    )
}

export default Lobby;