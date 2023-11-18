import { icons } from '../assets/images/icons'

export enum ResourceFileTypeEnum {
  Powerpoint = 'ppt',
  Word = 'word',
  Excel = 'excel',
}

export const getResourceType = (path: string) => {
  const type = path
  const typeResourceIcons: any = {
    ppt: icons.resource.powerpoint,
    word: icons.resource.word,
    excel: icons.resource.excel,
  }
  return typeResourceIcons[type]
}
