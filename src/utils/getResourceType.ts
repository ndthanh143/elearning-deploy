import { icons } from '../assets/images/icons'

export enum ResourceFileTypeEnum {
  Powerpoint = 'ppt',
  Word = 'word',
  Excel = 'excel',
  PDF = 'pdf',
}

export const getResourceType = (urlDocument: string) => {
  let lastDotIndex = urlDocument.lastIndexOf('.')
  let fileExtension = urlDocument.substring(lastDotIndex + 1)

  const typeResourceIcons: any = {
    ppt: icons.resource.powerpoint,
    word: icons.resource.word,
    excel: icons.resource.excel,
    pdf: icons.resource.pdf,
  }
  return typeResourceIcons[fileExtension]
}
