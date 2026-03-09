export function getAlphabetLetter(index: number, isUppercase = true): string {
    const startCode = isUppercase ? 65 : 97;
    return String.fromCharCode(startCode + index);
}
