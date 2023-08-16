export function getProjectYear(date?: string | null): number {
    // prismic date field => 'YYYY-MM-DD
    const year = date?.split('-')?.[0] || '0'
    return parseInt(year)
}

export function getNumberedData(date?: string | null): number {
    // From 'YYYY-MM-DD' To 20220320
    return date ? parseInt(date) : 0
}

export function getNumberedDate(date: string | null): number {
    return date ? Number(date.split('-').reduce((accumulator, currentValue) => accumulator + currentValue)) : 0
}
