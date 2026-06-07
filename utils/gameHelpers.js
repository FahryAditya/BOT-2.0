/**
 * Helper functions for game logic
 */

const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

module.exports = { getRandomElement };
