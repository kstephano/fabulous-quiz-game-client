import React from "react";
import {LeaderboardItem} from "../../components"

const Leaderboard = () => {
    const leaderboardData = [{id: 1, name: "Emily", score: "100%", category: "general knowledge"}]
    const leaderboard = leaderboardData.map(data => <LeaderboardItem data={data} key={data.id} />)

    return (
        <div className="leaderboard-container">
            <h2>Leaderboard</h2>
            <div className="leaderboard">
                <div className="leaderboard-item">
                    <p>Name</p>
                    <p>Category</p>
                    <p>Score</p>
                </div>
                {leaderboard}
            </div>
        </div>
    )
}

export default Leaderboard;