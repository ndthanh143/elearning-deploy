export const isHeadingInViewport = (headingId: string) => {
  const headingElement = document.getElementById(headingId)

  if (!headingElement) {
    return false
  }

  const bounding = headingElement.getBoundingClientRect()

  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) - 300 &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
