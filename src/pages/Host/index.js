import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { categories, difficulties, times } from '../../data/index';
import { setHost, setLobbyOptions } from '../../redux/actions';

const Host = () => {
    const [ rounds, setRounds ] = useState(5);
    const [ categoryId, setCategoryId ] = useState(8);
    const [ difficulty, setDifficulty ] = useState(difficulties[0]);
    const [ time, setTime ] = useState(times[0]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const createLobby = e => {
        e.preventDefault();
        dispatch(setHost(true));
        dispatch(setLobbyOptions({ 
            numOfQuestions: rounds,
            category: categoryId,
            difficulty: difficulty,
            roundLimit: time 
        }));
        navigate(`/lobby`);
    }

    // render options and set value to list item
    const renderOptions = (list) => list.map((item, index) => <option key={index} value={item}>{item}</option>);
    // render options and set value to list index
    const renderCategories = (list) => list.map((item, index) => <option key={index} value={index + 8}>{item.name}</option>)

    return(
        <div className='host-container'>
            <form className='settings-form' onSubmit={createLobby}>
                <h1>Lobby Settings</h1>
                <label htmlFor='rounds'>Number of questions</label>
                <input onChange={e => setRounds(e.target.value)} type="number" id="rounds" name="rounds" step="1" min="5" max="30" />
                <label htmlFor='category'>Category</label>
                <select onChange={e => setCategoryId(e.target.value)} name="category" id="category">{renderCategories(categories)}</select>
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