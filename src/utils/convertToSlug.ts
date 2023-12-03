export const convertToSlug = (title: string) => `${title.replace(/\s+/g, '-').toLowerCase()}`
