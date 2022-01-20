import React, {useEffect, useState} from "react";
import axios from 'axios'
import {LeaderboardItem} from "../../components"

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([])

    useEffect(() => {
        axios
            .get('http://localhost:3000/users/leaderboard')
            .then(response => setLeaderboardData(response.data.users));
        console.log(leaderboardData)
      }, []);
    
    const leaderboard = leaderboardData.map(data => <LeaderboardItem data={data} key={data.id} />)

    return (
        <div className="leaderboard-container">
            <h2>Leaderboard</h2>
            <div className="leaderboard">
                <div className="leaderboard-item">
                    <p>Name</p>
                    <p>Score</p>
                </div>
                {leaderboard}
            </div>
        </div>
    )
}

export default Leaderboard;