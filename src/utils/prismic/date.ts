export function getProjectYear(date: string | null) {
    // prismic date field => 'YYYY-MM-DD
    return date?.split('-')?.[0]
}

export function getNumberedDate(date: string | null): number {
    return date ? Number(date.split('-').reduce((accumulator, currentValue) => accumulator + currentValue)) : 0
}
