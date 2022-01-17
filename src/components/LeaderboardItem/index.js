import React from "react";

const LeaderboardItem = ({data}) => {
    return(
        <div className="leaderboard-item">
            <p>{data.name}</p>
            <p>{data.category}</p>
            <p>{data.score}</p>
        </div>
    )
}

export default LeaderboardItem