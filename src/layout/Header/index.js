import React from "react";
import { NavLink } from "react-router-dom";
import "./style.css"

const Header = () => {
    return (
        <header>
            <h1>Fabulous Quiz Game</h1>
            <nav>
                <NavLink to="/">Play</NavLink>
                <NavLink to="/leaderboard">Leaderboard</NavLink>
            </nav>
        </header>
    )
}

export default Header;