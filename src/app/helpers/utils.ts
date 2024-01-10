export const getNameInitials = (name: string) => {
    const words = name.split(' ');
    if (words.length === 1) {
        return words[0].substring(0, 2);
    } else if (words.length >= 2) {
        return words[0].charAt(0) + words[1].charAt(0);
    }
    return '';
}