import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categories, difficulty, time } from '../../data/index';
import { getLobbyId } from '../../helpers/index';

const Host = () => {
    const renderOptions = (list) => list.map((item) => <option value={item}>{item}</option>);
    const navigate = useNavigate();

    const createLobby = () => {
        const lobbyId = getLobbyId();
        navigate(`/lobby/${lobbyId}`)
    }

    return(
        <div className='host-container'>
            <form className='settings-form' onSubmit={createLobby}>
                <h1>Lobby Settings</h1>
                <label htmlFor='rounds'>Rounds</label>
                <input type="number" id="rounds" name="rounds" step="1" min="5" max="30" />
                <label htmlFor='category'>Category</label>
                <select name="category" id="category">{renderOptions(categories)}</select>
                <label htmlFor='difficulty'>Difficulty</label>
                <select>{renderOptions(difficulty)}</select>
                <label htmlFor='time'>Round time in seconds</label>
                <select name="time" id="time">{renderOptions(time)}</select>
                <button type="submit" id="create-lobby-btn">Create!</button>
            </form>
        </div>
    )
}

export default Host;