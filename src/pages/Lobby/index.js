import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Lobby = () => {
    const [ socket, setSocket ] = useState(null);
    const [ players, setPlayers ] = useState([]);
    const [ messages, setMessages ] = useState(["hi"]);
    const params = useParams();
    const navigate = useNavigate();
    const name = useSelector(state => state.user.name);
    const isHost = useSelector(state => state.user.isHost);
    const lobbyId = params.lobbyId;

    console.log(isHost);
    console.log(name);

    const joinRoom = (socket) => {
        // make a socket room if host
        if (isHost) { 
            socket.emit("create-lobby", { username: name, lobbyId: lobbyId });
            socket.on("lobby-created", (msg) => { 
                console.log(msg);
                setMessages(messages => [ ...messages, msg ]);
            });
        // otherwise, join a pre-existing socket room    
        } else {
            socket.emit("request-join-lobby", { username: name, lobbyId: lobbyId });

            socket.on("entry-permission", (lobbyId) => {
                console.log(`Joined lobby ${lobbyId}`);
                setMessages(messages => [ ...messages, `Joined lobby ${lobbyId}`]);
            });
        }

        socket.on("new-player-joining", ({ username, lobbyId, roomCount }) => {
            console.log(`${username} has joined lobby ${lobbyId}`);
            console.log(`There are now ${roomCount} players in the lobby`)
            setMessages(messages => [ ...messages, `${username} has joined lobby ${lobbyId}` ]);
            setMessages(messages => [ ...messages, `There are now ${roomCount} players in the lobby` ]);
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
        console.log(socket);
        joinRoom(socket);
    }, []);

    const startGame = () => {
        navigate(`/game/${socket}`);
    }

    const renderPlayers = () => players.map((player, index) => <li key={index}>{player.name}</li>);
    const renderMessages = () => messages.map((message, index) => <p className='message' key={index}>{message}</p>)

    return (
        <div className='lobby-container'>
            <h1>Lobby</h1>
            <div className='players-container'>
                <p>{players.length}/{}</p>
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
                <p className='lobby-id'>{params.lobbyId}</p>
            </div>
        </div>
    )
}

export default Lobby;