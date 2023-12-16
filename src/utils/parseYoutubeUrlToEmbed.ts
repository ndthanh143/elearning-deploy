export const parseYoutubeUrlToEmbed = (url: string) => {
  const newUrl = url.replace('watch?v=', 'embed/')

  return newUrl
}
