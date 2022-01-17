import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Home, Host, Leaderboard, Game } from "./pages"
import { Header } from "./layout"

const App = () => {
    return (
        <>
            <Header />
            <Routes>
				<Route exact path="/" element={<Home />}></Route>
				<Route path="/host" element={<Host />}></Route>
                <Route path="/leaderboard" element={<Leaderboard />}></Route>
                <Route path="/game/:lobbyId" element={<Game />}></Route>
			</Routes>
        </>
    )
}

export default App;