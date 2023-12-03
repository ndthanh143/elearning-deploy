import { defineQuery } from '../../utils'
import { lectureService } from './lecture.service'

export const lectureKeys = {
  all: ['lecture'] as const,
  details: () => [...lectureKeys.all, 'detail'] as const,
  detail: (lectureId: number) =>
    defineQuery([...lectureKeys.details(), lectureId], () => lectureService.getById(lectureId)),
}
