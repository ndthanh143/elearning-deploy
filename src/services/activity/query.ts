import { activityService } from '.'
import { defineQuery } from '../../utils'

export const activityKeys = {
  all: ['activity'] as const,
  myActivities: () => [...activityKeys.all, 'my-activities'] as const,
  myActivity: (query: { fromDate: string; toDate: string }) =>
    defineQuery([...activityKeys.myActivities(), query], () => activityService.getMyActivity(query)),
}
