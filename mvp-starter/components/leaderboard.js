import Profiles from "./profiles.js";
export default function Leaderboard() {
    return (
        <div className="quiz-outer">
            <div className="leaderboardMain">
                <div id="header">
                    <h1 className="headerLeaderboard">Weekly Rankings</h1>
                </div>
                <div className="leaderboard">
                    <Profiles />
                </div>
            </div>
        </div>
    );
}