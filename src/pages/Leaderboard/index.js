import React, {useEffect, useState} from "react";
import axios from 'axios'
import {LeaderboardItem} from "../../components"

const Leaderboard = () => {
    console.log('Hello Peter')
    const [leaderboardData, setLeaderboardData] = useState([])
    console.log('Hello Peter')
    useEffect(() => {

        console.log("Peter hi")
        axios
          .get('http://localhost:3000/users/leaderboard')
          .then(response => setLeaderboardData(response.data.users));

        console.log(leaderboardData)
      }, []);
    
    console.log('Rhys is thanos')
    const leaderboard = leaderboardData.map(data => <LeaderboardItem data={data} key={data.id} />)

console.log("Hello")
console.log("Hello")
    return (
        // console.log("Hello")
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