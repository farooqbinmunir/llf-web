// Reads a duration token such as `750ms` or `0.5s` in milliseconds, for scripts that take their timing from the stylesheet.
export const toMilliseconds = (value: string) => (value.trim().endsWith('ms') ? Number.parseFloat(value) : Number.parseFloat(value) * 1000);
