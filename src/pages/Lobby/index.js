import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    const [ newHost, setNewHost ] = useState(null);
    const [ isNewHost, setIsNewHost ] = useState(false);
    const [ playerId, setPlayerId ] = useState(0);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const isHost = params.isHost;
    const name = useSelector(state => state.user.name);
    const lobbyId = useSelector(state => state.user.lobbyId);
    const { numOfQuestions, category, difficulty, roundLimit } = useSelector(state => state.lobby);
    const [ ModalInvalidLobby, openModalInvalidLobby ] = useModal('root', { preventScroll: true, closeOnOverlayClick: false });
    const [ ModalFullLobby, openModalFullLobby ] = useModal('root', { preventScroll: true, closeOnOverlayClick: false });

    console.log(messages);

    const joinRoom = (socket) => {
        // make a socket room if host
        if (isHost === 'true') { 
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
                dispatch(setName(host.username));
                dispatch(setId(host.id));
                setMessages(messages => [ `Lobby created by ${host.username}`, ...messages ]);
                setPlayers(players => [ ...players, host ]);
                setCurrentPlayer(host);
                console.log(`Lobby ${host.lobby_id} created by ${host.username}`);
            });
        // otherwise, join a pre-existing socket room    
        } else {
            socket.emit("request-join-lobby", { username: name, lobbyId: lobbyId });

            socket.on("entry-permission", ({ lobbyId, existingPlayers, newPlayer }) => {
                console.log(newPlayer);
                setPlayers([ ...existingPlayers ]);
                setPlayerId(newPlayer.id);
                setCurrentPlayer(newPlayer);
                dispatch(setLobbyId(lobbyId));
                dispatch(setId(newPlayer.id));
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
            console.log("player left");
            setPlayers(players => players.filter(p => p.id !== player.id));
            setMessages(messages => [`${player.username} has left the lobby`, ...messages]);
        });

        // choose new host if they have left
        socket.on("host-left", ({ newHost }) => {
            setMessages(messages => [`Host left`, ...messages]);
            console.log(newHost);
            setNewHost(newHost);
        });

        // host loads the game for other players
        socket.on("loading-game", () => {
            navigate(`/game`);
        });
    }

    useEffect(() => {
        const io = require('socket.io-client');
        const serverEndpoint = "https://quizfab-app.herokuapp.com/";
        const newSocket = io(serverEndpoint);
        newSocket.on("connected", (msg) => {
            console.log(msg);
        });
        if (socket === null) setSocket(newSocket);
        dispatch(initSocket(newSocket));

        joinRoom(newSocket);
        waitInRoom(newSocket);
    }, []);

    useEffect(() => {
        if (newHost !== null) {
            if (newHost.id === playerId) {
                setIsNewHost(true);
                setMessages(messages => [ `You are now the host`, ...messages ]);
            }
        }
    }, [newHost]);

    const startGame = () => {
        // host starts the game
        socket.emit("host-load-game", ({ lobbyId: lobbyId }));
        navigate('/game');
    }

    const leaveLobby = (socket) => {
        console.log(lobbyId)
        setPlayers(players => players.filter(p => p.id !== currentPlayer.id));
        socket.emit("leave-lobby", ({ lobbyId: lobbyId , player: currentPlayer, isHost: isHost }));
        navigate('/');
        socket.disconnect();
    }

    const renderPlayers = () => players.map((player, index) => <li key={index}>{player.username}</li>);
    const renderMessages = () => messages.map((message, index) => <p className='message' key={index}>{message}</p>)

    return (
        <div id='lobby-container'>
            <h2>Lobby</h2>

            <ModalInvalidLobby>
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
            </ModalFullLobby>

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
            { isHost === 'false' && !isNewHost && 
            <div className="start-buttons-div">
                <p className="white">Waiting for the host to start the game</p>
                <button onClick={()=> leaveLobby(socket)} className="orange-button">Leave lobby</button>
            </div>
            }
            { (isHost === 'true' || isNewHost) && 
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