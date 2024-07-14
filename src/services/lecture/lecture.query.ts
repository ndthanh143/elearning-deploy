import { defineQuery } from '../../utils'
import { GetLectureDetailParams } from './lecture.dto'
import { lectureService } from './lecture.service'

export const lectureKeys = {
  all: ['lecture'] as const,
  details: () => [...lectureKeys.all, 'detail'] as const,
  detail: (params: GetLectureDetailParams) =>
    defineQuery([...lectureKeys.details(), params], () => lectureService.getById(params)),
}
