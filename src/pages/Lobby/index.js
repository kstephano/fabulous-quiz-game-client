import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const io = require('socket.io-client');
const serverEndpoint = "http://localhost:4000";
const socket = io(serverEndpoint);

const Lobby = () => {
    const [ players, setPlayers ] = useState([]);
    const name = useSelector(state => state.name);
    const params = useParams();

    useEffect(() => {
        socket.on("connection", () => {
            console.log("connected");
        });
        /*
        socket.emit("joinLobby", name);

        // add new player to the list when "newPlayer" event is received from the server
        socket.on('newPlayer', (name) => {
            setPlayers([...players, name]);
        });
        */

        // Disconnect socket when component unmounts
        return () => {
            socket.disconnect();
        }
    }, []);

    const renderPlayers = () => players.map((player, index) => <li key={index}>{player.name}</li>);

    return (
        <div className='lobby-container'>
            <h1>Lobby</h1>
            <div className='players-container'>
                <p>{players.length}/{}</p>
                <ul>
                    {renderPlayers}
                </ul>
            </div>
            <div className='invite-friends-container'>
                <h2>Invite your friends!</h2>
                <p className='lobby-id'>{params.lobbyId}</p>
            </div>
        </div>
    )
}

export default Lobby;