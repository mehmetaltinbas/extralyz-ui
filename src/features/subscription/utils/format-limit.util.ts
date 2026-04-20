export function formatLimit(value: number): string {
    return value === -1 ? 'Unlimited' : String(value);
}
