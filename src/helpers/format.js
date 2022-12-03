export function oneLineHtml(strings, ...values) {
    const output = values.reduce((sum, el, i) => sum + strings[i] + el, '') + strings[values.length];
    return output
        .split(/\r\n|\r|\n/)
        .map(line => line.trim())
        .join('');
}
