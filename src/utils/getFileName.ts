export const getFileName = (filePath: string): string => {
  const parts: string[] = filePath.split('/')

  const fileName: string = parts[parts.length - 1]

  return fileName
}
