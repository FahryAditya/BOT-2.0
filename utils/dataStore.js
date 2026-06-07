/**
 * Simple in-memory data store for game scores and leaderboards
 */
const scores = {}; // { phoneNumber: { points: 0, streak: 0 } }

const updateScore = (phoneNumber, points) => {
    if (!scores[phoneNumber]) {
        scores[phoneNumber] = { points: 0, streak: 0 };
    }
    scores[phoneNumber].points += points;
    scores[phoneNumber].streak += 1;
};

const getLeaderboard = () => {
    // Sort and return top scorers
    return Object.entries(scores)
        .sort((a, b) => b[1].points - a[1].points)
        .slice(0, 5);
};

module.exports = { updateScore, getLeaderboard };
