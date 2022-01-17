import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const Lobby = () => {
    const [ players, setPlayers ] = useState([]);
    const [ socket, setSocket ] = useState(null);
    const name = useSelector(state => state.name);
    const params = useParams();
    const serverEndpoint = "http://localhost:4000";

    useEffect(() => {
        const newSocket = io(serverEndpoint);
        console.log(newSocket);
        setSocket(newSocket);
        console.log(socket);
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