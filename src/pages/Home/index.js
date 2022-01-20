import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLobbyId, setName } from '../../redux/actions';
import './style.css';

const Home = () => {
    console.log('hi')
    const [ nameInput, setNameInput ] = useState("");
    const [ lobbyIdInput, setLobbyIdInput ] = useState("");
    const [ isJoin, setIsJoin ] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInput = setter => e => {
        setter(e.target.value);
    }

    const handleJoin = () => {
        if (nameInput) {
            setIsJoin(isJoin => !isJoin)
        }
    }

    const handlePlay = () => {
        if (lobbyIdInput) {
            dispatch(setName(nameInput));
            dispatch(setLobbyId(lobbyIdInput));
            navigate(`/lobby`);
        }
    }

    const handleHost = () => {
        if (nameInput) {
            dispatch(setName(nameInput))
            navigate("/host")
        }
    }

    const handleHost = () => {
        if (nameInput) {
            dispatch(setName(nameInput))
            navigate("/host")
        }
    }

    return (
        <div id='home-container'>
            <input type="text" name='name' placeholder="Enter your name" value={nameInput} onChange={handleInput(setNameInput)} required></input>
            {!isJoin && <button onClick={handleJoin} className="join-button">Join a game</button>}
            { isJoin && 
                <>
                    <input type="text" name="lobbyId" placeholder="Lobby ID" value={lobbyIdInput} onChange={handleInput(setLobbyIdInput)} required></input>
                    <button onClick={handlePlay} className="join-button">Play!</button>
                </>
            }
            <button onClick={handleHost} className="host-button">Host a game</button>
        </div>
    )
}

export default Home;