import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from 'react-hooks-use-modal';
import { setLobbyId } from '../../redux/actions';

const Lobby = () => {
    const [ socket, setSocket ] = useState(null);
    const [ players, setPlayers ] = useState([]);
    const [ messages, setMessages ] = useState(["hi"]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const name = useSelector(state => state.user.name);
    const isHost = useSelector(state => state.user.isHost);
    const lobbyId = useSelector(state => state.user.lobbyId);
    const category = useSelector(state => state.lobby.category);
    const [ Modal, open, close ] = useModal('root', { preventScroll: true, closeOnOverlayClick: false });


    console.log(isHost);
    console.log(name);
    console.log(category);

    const joinRoom = (socket) => {
        // make a socket room if host
        if (isHost) { 
            socket.emit("create-lobby", { username: name, category: category });
            socket.on("lobby-created", ({ lobbyId }) => { 
                dispatch(setLobbyId(lobbyId));
                console.log(`Lobby created by ${name}`);
                setMessages(messages => [ ...messages, `Lobby created by ${name}` ]);
            });
            setPlayers(players => [...players, name]);
            console.log(players);
        // otherwise, join a pre-existing socket room    
        } else {
            console.log(lobbyId)
            socket.emit("request-join-lobby", { username: name, lobbyId: lobbyId });

            socket.on("entry-permission", ({ lobbyId, players }) => {
                console.log(`Joined lobby ${lobbyId}`);
                setPlayers([ ...players, name ]);
                console.log(players);
                setMessages(messages => [ ...messages, `Joined lobby ${lobbyId}`]);
            });

            socket.on("lobby-id-invalid", () => {
                open();
            });
        }

        socket.on("new-player-joining", ({ newPlayer, roomCount }) => {
            const { username, lobby_id } = newPlayer;
            console.log(`${username} has joined lobby ${lobby_id}`);
            console.log(`There are now ${roomCount} players in the lobby`)
            setMessages(messages => [ ...messages, `${username} has joined lobby ${lobby_id}` ]);
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

        // Disconnect socket when component unmounts
        return () => {
            socket.disconnect();
        }
    }, []);

    const startGame = () => {
        navigate(`/game/${socket}`);
    }

    const renderPlayers = () => players.map((player, index) => <li key={index}>{player.name}</li>);
    const renderMessages = () => messages.map((message, index) => <p className='message' key={index}>{message}</p>)

    return (
        <div className='lobby-container'>
            <h2>Lobby</h2>

            <Modal className="pop-up">
                <h2>Lobby does not exist</h2>
                <button id="close-pop-up-btn" onClick={() => navigate('/')}>Go back</button>
            </Modal>

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
                <p className='lobby-id'>{lobbyId}</p>
            </div>
        </div>
    )
}

export default Lobby;