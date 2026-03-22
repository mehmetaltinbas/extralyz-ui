export function camelToTitleCase(camelCasedString: string): string {
    if (!camelCasedString) return "";

    const words: string[] = [];
    let currentWord = "";

    for (const letter of camelCasedString) {
        if (letter === letter.toUpperCase() && currentWord !== "") {
            words.push(currentWord);
            currentWord = letter;
        } else {
            currentWord += letter;
        }
    }
    
    words.push(currentWord);

    const titleCased = words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return titleCased;
}
