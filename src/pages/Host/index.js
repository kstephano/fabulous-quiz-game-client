import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { categories, difficulties, times } from '../../data/index';
import { setHost, setLobbyOptions } from '../../redux/actions';

const Host = () => {
    const [ rounds, setRounds ] = useState(5);
    const [ category, setCategory ] = useState(categories[0]);
    const [ difficulty, setDifficulty ] = useState(difficulties[0]);
    const [ time, setTime ] = useState(times[0]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const createLobby = e => {
        e.preventDefault();
        dispatch(setHost(true));
        dispatch(setLobbyOptions({ 
            numOfQuestions: rounds,
            category: category,
            difficulty: difficulty,
            time: time 
        }));
        navigate(`/lobby`);
    }

    const renderOptions = (list) => list.map((item, key) => <option key={key} value={item}>{item}</option>);

    return(
        <div className='host-container'>
            <form className='settings-form' onSubmit={createLobby}>
                <h2>Lobby Settings</h2>
                <label htmlFor='rounds'>Number of questions</label>
                <input onChange={e => setRounds(e.target.value)} type="number" id="rounds" name="rounds" step="1" min="5" max="30" />
                <label htmlFor='category'>Category</label>
                <select onChange={e => setCategory(e.target.value)} name="category" id="category">{renderOptions(categories)}</select>
                <label htmlFor='difficulty'>Difficulty</label>
                <select onChange={e => setDifficulty(e.target.value)} name='difficulty' id='difficulty'>{renderOptions(difficulties)}</select>
                <label htmlFor='time'>Time limit (seconds)</label>
                <select onChange={e => setTime(e.target.value)} name="time" id="time" type="number">{renderOptions(times)}</select>
                <button type="submit" id="create-lobby-btn">Create!</button>
            </form>
        </div>
    )
}

export default Host;