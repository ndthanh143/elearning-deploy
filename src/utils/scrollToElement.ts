export function scrollToElement(elementId: string) {
  const element = document.getElementById(elementId)

  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'center',
    })
  } else {
    console.error(`Element with ID '${elementId}' not found.`)
  }
}
