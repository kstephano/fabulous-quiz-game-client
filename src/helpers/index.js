function randomNumBetween(min, max) { 
    return Math.floor(Math.random() * (max - min) + min);
}

export { randomNumBetween }