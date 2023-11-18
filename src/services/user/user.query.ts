import { defineQuery } from '../../utils'
import { userService } from './user.service'

export const userKeys = {
  all: ['users'] as const,
  profiles: () => [...userKeys.all, 'profile'] as const,
  profile: () => defineQuery([...userKeys.profiles()], userService.getCurrentUser),
}
