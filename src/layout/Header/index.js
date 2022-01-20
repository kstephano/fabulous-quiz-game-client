import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./style.css"

import "./style.css"

const Header = () => {
    const navigate = useNavigate();
    return (
        <header>
            <h1 onClick={() => navigate('/')}>Fabulous Quiz Game</h1>
            <nav>
                <NavLink to="/">Play</NavLink>
                <NavLink to="/leaderboard">Leaderboard</NavLink>
            </nav>
        </header>
    )
}

export default Header;