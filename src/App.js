import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Home, Host, Leaderboard, Game, Results, Lobby } from "./pages"
import { Header } from "./layout"

import "./App.css"

import "./App.css"

const App = () => {
    return (
        <>
            <Header />
            <Routes>
				<Route exact path="/" element={<Home />}></Route>
				<Route path="/host" element={<Host />}></Route>
                <Route path="/leaderboard" element={<Leaderboard />}></Route>
                <Route path='/lobby/:isHost' element={<Lobby />}></Route>
                <Route path="/game" element={<Game />}></Route>
                <Route path="/results" element={<Results />}></Route>
			</Routes>
        </>
    )
}

export default App;