import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLobbyId, setName } from '../../redux/actions';
import './style.css';

const Home = () => {
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

    return (
        <div className='home-container'>
            <input type="text" name='name' placeholder="Enter your name" value={nameInput} onChange={handleInput(setNameInput)} required></input>
            {!isJoin && <button onClick={handleJoin}>Join a game</button>}
            { isJoin && 
                <>
                    <input type="text" name="lobbyId" placeholder="Lobby ID" value={lobbyIdInput} onChange={handleInput(setLobbyIdInput)} required></input>
                    <button onClick={handlePlay}>Join</button>
                </>
            }
            <button onClick={() => dispatch(setName(nameInput))}><Link className='main-btn' to={nameInput ? "/host" : "/"}>Host a game</Link></button>
        </div>
    )
}

export default Home;