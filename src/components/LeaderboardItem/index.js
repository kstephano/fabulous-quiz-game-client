import React from "react";

const LeaderboardItem = ({data}) => {
    return(
        <div className="leaderboard-item">
            <p>{data.username}</p>
            <p>{data.score}</p>
        </div>
    )
}

export default LeaderboardItem