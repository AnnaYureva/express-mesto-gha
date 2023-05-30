const urlRegex = /http[s]?:\/(?:\/[^\\/]+){1,}(?:\/[А-Яа-я\w ]+\.[a-z]{3,5}(?![\\/]))/gm;

module.exports = urlRegex;
