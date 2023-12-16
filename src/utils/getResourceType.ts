import resources from '@/assets/images/icons/resources'
import { icons } from '../assets/images/icons'

export enum ResourceFileTypeEnum {
  Powerpoint = 'ppt',
  Powerpointx = 'pptx',
  Word = 'doc',
  Excel = 'xlsx',
  PDF = 'pdf',
  png = 'png',
  jpeg = 'jpeg',
}

export const getResourceType = (urlDocument: string) => {
  let lastDotIndex = urlDocument.lastIndexOf('.')
  let fileExtension = urlDocument.substring(lastDotIndex + 1).toLowerCase()

  const typeResourceIcons: any = {
    ppt: icons.resource.powerpoint,
    pptx: icons.resource.powerpoint,
    doc: icons.resource.word,
    docs: icons.resource.word,
    xlsx: icons.resource.excel,
    pdf: icons.resource.pdf,
    png: icons.resource.png,
    jpeg: icons.resource.jpeg,
  }
  return typeResourceIcons[fileExtension] || resources.common
}
