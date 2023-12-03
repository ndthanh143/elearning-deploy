import { convertToSlug } from '.'

export const addIdToH2Tags = (htmlContent: string) => {
  const modifiedContent = htmlContent.replace(/<h2>(.*?)<\/h2>/g, (_, children) => {
    const id = convertToSlug(children)
    return `<h2 id="${id}">${children}</h2>`
  })

  return modifiedContent
}
