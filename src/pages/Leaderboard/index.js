import React, { useEffect, useState } from "react";
import axios from "axios";
import { LeaderboardItem } from "../../components";

import "./style.css";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/users/leaderboard").then((response) => {
      console.log(response.data.users);
      setLeaderboardData(
        response.data.users.filter((user) => !(!user.score && user.score !== 0))
      );
    });
  }, []);

  const leaderboard = leaderboardData.map((data) => (
    <LeaderboardItem data={data} key={data.id} />
  ));

  return (
    <div id="leaderboard-container">
      <h2>Leaderboard</h2>
      <div className="leaderboard">
        <div className="leaderboard-item leaderboard-heading">
          <p>Name</p>
          <p>Score</p>
        </div>
        {leaderboard}
      </div>
    </div>
  );
};

export default Leaderboard;
