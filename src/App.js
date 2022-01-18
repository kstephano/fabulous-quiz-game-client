import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Home, Host, Leaderboard, Game, Results } from "./pages"
import { Header } from "./layout"
import Lobby from './pages/Lobby';

import "./App.css"

const App = () => {
    return (
        <>
            <Header />
            <Routes>
				<Route exact path="/" element={<Home />}></Route>
				<Route path="/host" element={<Host />}></Route>
                <Route path="/leaderboard" element={<Leaderboard />}></Route>
                <Route path="/lobby/:lobbyId" element={<Lobby />}></Route>
                <Route path="/game/:lobbyId" element={<Game />}></Route>
                <Route path="/results" element={<Results />}></Route>
			</Routes>
        </>
    )
}

export default App;