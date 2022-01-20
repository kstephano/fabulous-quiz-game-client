function randomNumBetween(min, max) { 
    return Math.floor(Math.random() * (max - min) + min);
}

function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export { randomNumBetween, decodeHtml }